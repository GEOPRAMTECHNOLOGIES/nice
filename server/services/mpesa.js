import axios from 'axios';
import moment from 'moment';

const MPESA_BASE_URL = 'https://sandbox.safaricom.co.ke';
const TOKEN_URL = `${MPESA_BASE_URL}/oauth/v1/generate?grant_type=client_credentials`;

let accessToken = null;
let tokenExpiry = null;

export const getMpesaAccessToken = async (consumerKey, consumerSecret) => {
  try {
    // Return cached token if still valid
    if (accessToken && tokenExpiry && new Date() < tokenExpiry) {
      return accessToken;
    }

    const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');

    const response = await axios.get(TOKEN_URL, {
      headers: {
        Authorization: `Basic ${auth}`,
      },
    });

    accessToken = response.data.access_token;
    // Token expires in 3600 seconds, set expiry to 55 minutes for safety
    tokenExpiry = new Date(Date.now() + 55 * 60 * 1000);

    return accessToken;
  } catch (error) {
    console.error('Error getting M-Pesa access token:', error.response?.data || error.message);
    throw new Error('Failed to generate M-Pesa access token');
  }
};

export const initiateSTKPush = async (
  phoneNumber,
  amount,
  accountReference,
  transactionDesc,
  mpesaConfig,
  callbackUrl
) => {
  try {
    const token = await getMpesaAccessToken(mpesaConfig.consumerKey, mpesaConfig.consumerSecret);

    const timestamp = moment().format('YYYYMMDDHHmmss');
    const password = Buffer.from(
      `${mpesaConfig.shortCode}${mpesaConfig.passKey}${timestamp}`
    ).toString('base64');

    // Ensure phone number is in correct format (254xxxxxxxxx)
    let formattedPhone = phoneNumber.replace(/^0/, '254').replace(/\D/g, '');
    if (!formattedPhone.startsWith('254')) {
      formattedPhone = '254' + formattedPhone;
    }

    const payload = {
      BusinessShortCode: mpesaConfig.shortCode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: Math.ceil(amount), // Ensure whole number
      PartyA: formattedPhone,
      PartyB: mpesaConfig.shortCode,
      PhoneNumber: formattedPhone,
      CallBackURL: callbackUrl,
      AccountReference: accountReference || 'GEOPRAM',
      TransactionDesc: transactionDesc || 'Service Payment',
    };

    const response = await axios.post(
      `${MPESA_BASE_URL}/mpesa/stkpush/v1/processrequest`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return {
      success: true,
      data: {
        merchantRequestId: response.data.MerchantRequestID,
        checkoutRequestId: response.data.CheckoutRequestID,
        responseCode: response.data.ResponseCode,
        responseDesc: response.data.ResponseDescription,
        customerMessage: response.data.CustomerMessage,
      },
    };
  } catch (error) {
    console.error('STK Push Error:', error.response?.data || error.message);
    return {
      success: false,
      error: error.response?.data?.errorMessage || 'Failed to initiate STK push',
    };
  }
};

export const queryTransactionStatus = async (checkoutRequestId, mpesaConfig) => {
  try {
    const token = await getMpesaAccessToken(mpesaConfig.consumerKey, mpesaConfig.consumerSecret);
    const timestamp = moment().format('YYYYMMDDHHmmss');
    const password = Buffer.from(
      `${mpesaConfig.shortCode}${mpesaConfig.passKey}${timestamp}`
    ).toString('base64');

    const payload = {
      BusinessShortCode: mpesaConfig.shortCode,
      Password: password,
      Timestamp: timestamp,
      CheckoutRequestID: checkoutRequestId,
    };

    const response = await axios.post(
      `${MPESA_BASE_URL}/mpesa/stkpushquery/v1/query`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('Query Error:', error.response?.data || error.message);
    return {
      success: false,
      error: error.message,
    };
  }
};

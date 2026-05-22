# Deployment Guide - Geopram Service Platform

## Quick Deployment to Vercel

### Step 1: Prepare Your Repository

```bash
# Initialize git (if not already done)
git init
git add .
git commit -m "Initial commit - Geopram Service Platform"

# Push to GitHub, GitLab, or Bitbucket
git remote add origin <your-repo-url>
git push -u origin main
```

### Step 2: Deploy Backend to Vercel

1. **Create Backend Project**
   ```bash
   # Login to Vercel CLI
   npm i -g vercel
   vercel login
   
   # Navigate to server directory
   cd server
   
   # Deploy
   vercel deploy --prod
   ```

2. **Configure Environment Variables in Vercel Dashboard**
   - Go to: Project Settings → Environment Variables
   - Add the following variables:

   ```
   MONGO_URI=mongodb+srv://geopramtech_db_user:bZZA50KjO6AT1382@cluster0.58midep.mongodb.net/?appName=Cluster0
   JWT_SECRET=d44d56ec39e2c8d400dafd94da658dce5e8f5d87d04883250c642e00781
   ADMIN_EMAIL=celestaki018@gmail.com
   ADMIN_PASSWORD=kim@7222
   MPESA_CONSUMER_KEY=zy6Tc09PA8eteY3Mf5zOFgnPGmYJnCpJVdbF3ZeG
   MPESA_CONSUMER_SECRET=KZ7pRIGv7y0FrdPThgVxxrvXHQhX8kHkj7XtRZLSKQxgMzA1RleT
   MPESA_SHORTCODE=4574727
   MPESA_TILL_NUMBER=5367886
   MPESA_PASSKEY=9d09b38cbf40d3dc7bb1b627954fdc4b7273353279209905e96ce031
   MPESA_CALLBACK_URL=https://your-vercel-backend-url.vercel.app/api/payments/callback
   NODE_ENV=production
   SERVER_URL=https://your-vercel-backend-url.vercel.app
   ```

3. **Note Your Backend URL**
   - After deployment, you'll get a URL like: `https://geopram-api.vercel.app`
   - Save this for frontend configuration

### Step 3: Deploy Frontend to Vercel

1. **Create Frontend Project**
   ```bash
   # Navigate to client directory
   cd ../client
   
   # Deploy
   vercel deploy --prod
   ```

2. **Configure Environment Variables**
   - Go to: Project Settings → Environment Variables
   - Add the backend URL:
   
   ```
   VITE_API_URL=https://your-vercel-backend-url.vercel.app
   ```

3. **Rebuild and Deploy**
   - Vercel will automatically rebuild with the new environment variable

### Step 4: Configure M-Pesa Callback

1. **Update M-Pesa Callback URL**
   - In your admin panel or M-Pesa configuration
   - Set callback URL to: `https://your-vercel-backend-url.vercel.app/api/payments/callback`

2. **Verify Deployment**
   - Test payment flow in production
   - Monitor webhook responses

## Complete Environment Variables Checklist

### Backend (.env or Vercel)
- [ ] MONGO_URI
- [ ] JWT_SECRET
- [ ] ADMIN_EMAIL
- [ ] ADMIN_PASSWORD
- [ ] MPESA_CONSUMER_KEY
- [ ] MPESA_CONSUMER_SECRET
- [ ] MPESA_SHORTCODE
- [ ] MPESA_TILL_NUMBER
- [ ] MPESA_PASSKEY
- [ ] MPESA_CALLBACK_URL
- [ ] NODE_ENV=production
- [ ] SERVER_URL

### Frontend (.env or Vercel)
- [ ] VITE_API_URL (Backend URL)

## Troubleshooting

### Build Errors
```bash
# Clear Vercel build cache
vercel build --cwd ./

# Rebuild locally first
npm run build --prefix client
npm run build --prefix server
```

### Database Connection Issues
- Verify MONGO_URI is correct
- Check MongoDB IP whitelist (add 0.0.0.0/0 for Vercel)
- Ensure database user has correct permissions

### M-Pesa Integration Issues
- Verify all M-Pesa credentials are correct
- Check callback URL is accessible (use webhook testing tool)
- Review server logs in Vercel dashboard
- Test with sandbox credentials first

### API Connection Issues
- Verify VITE_API_URL in frontend environment variables
- Check CORS is enabled in backend
- Ensure backend is running and accessible

## Monitoring

### Server Logs
1. Go to Vercel Dashboard
2. Select your backend project
3. Click "Logs" tab
4. View real-time logs

### Database Monitoring
1. Log in to MongoDB Atlas
2. Go to your cluster
3. Check "Logs" section
4. Monitor connection activity

## Post-Deployment Checklist

- [ ] Backend API is accessible
- [ ] Frontend loads correctly
- [ ] Login/Registration works
- [ ] Services display properly
- [ ] Order creation works
- [ ] M-Pesa payment flow functions
- [ ] Admin dashboard accessible
- [ ] Order management works
- [ ] Notifications appear
- [ ] Database connections stable

## Production Security Tips

1. **Environment Variables**
   - Never commit `.env` to git
   - Use Vercel's secure environment variables
   - Rotate secrets regularly

2. **Database**
   - Enable IP whitelist (add Vercel ranges)
   - Use strong passwords
   - Regular backups

3. **API Security**
   - Monitor API usage
   - Implement rate limiting
   - Log suspicious activities

4. **Payments**
   - Use production M-Pesa credentials when ready
   - Verify all callbacks are signed
   - Test payment scenarios thoroughly

## Scaling Considerations

- Monitor database performance
- Consider read replicas for high traffic
- Implement caching (Redis)
- Use CDN for static files
- Monitor API response times

---

**Need Help?**
- Check Vercel documentation: https://vercel.com/docs
- MongoDB support: https://docs.mongodb.com
- M-Pesa API docs: https://developer.safaricom.co.ke

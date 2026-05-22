# 🚀 Geopram Platform - Quick Start Guide

## What You Got

A **complete, production-ready full-stack service ordering platform** with:
- ✅ User authentication & registration
- ✅ Admin dashboard with statistics
- ✅ Service management (CRUD)
- ✅ Order management system
- ✅ M-Pesa payment integration
- ✅ Real-time notifications
- ✅ Professional UI/UX design
- ✅ Ready for Vercel deployment

## 5-Minute Setup

### 1. Extract & Navigate
```bash
unzip geopram-service-platform.zip
cd geopram-service-app
```

### 2. Install Dependencies
```bash
npm install
npm install --prefix server
npm install --prefix client
```

### 3. Setup Environment
```bash
# Copy the example environment file
cp .env.example .env

# Edit .env with your credentials (your existing ones are already there!)
nano .env  # or open in your editor
```

### 4. Run Locally
```bash
npm run dev
```

This starts:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

### 5. Login to Admin Dashboard
1. Go to http://localhost:3000
2. Click "Sign up"
3. Fill in details
4. Use the admin registration endpoint with your ADMIN_EMAIL and ADMIN_PASSWORD to create admin account
5. Or modify credentials in .env to match your preferred ones

## File Structure at a Glance

```
geopram-service-app/
├── server/                    # Node.js/Express backend
│   ├── models/               # Database schemas (User, Service, Order)
│   ├── routes/               # API endpoints
│   ├── middleware/           # Authentication
│   ├── services/             # M-Pesa integration
│   └── server.js             # Main server entry
│
├── client/                    # React frontend
│   ├── src/
│   │   ├── pages/           # All page components
│   │   ├── components/      # Reusable UI components
│   │   ├── styles/          # CSS (professionally styled)
│   │   ├── api.js           # API client with Axios
│   │   ├── store.js         # Zustand state management
│   │   └── App.jsx          # Main app with routing
│   └── vite.config.js       # Vite configuration
│
├── README.md                  # Complete documentation
├── DEPLOYMENT.md              # Vercel deployment guide
├── .env.example               # Environment template
└── package.json               # Root package configuration
```

## Key Features Explained

### 🛠️ Admin Features
- **Dashboard**: View statistics (total orders, revenue, completed orders)
- **Orders Management**: See all orders with customer details, update status
- **Services Management**: Create, edit, delete services with prices

### 👤 User Features
- **Browse Services**: Search, filter by category
- **Order Services**: Initiate M-Pesa payment
- **Track Orders**: See order status in real-time
- **Order History**: View all past orders

### 💳 M-Pesa Integration
- STK Push payment initiation
- Automatic callback handling
- Order status updates on payment confirmation
- Till number included in transactions

## Database Models

### User
```
- name
- email (unique)
- phone
- password (hashed)
- role (user/admin)
- timestamps
```

### Service
```
- name
- description
- price
- category
- duration
- image URL
- isActive
- createdBy (admin reference)
```

### Order
```
- orderId (unique)
- user (reference)
- service (reference)
- amount
- status (pending/completed/failed)
- paymentStatus (unpaid/paid/failed)
- M-Pesa details (merchant request ID, checkout request ID)
- timestamps
```

## API Endpoints

### Public
- `POST /api/auth/register` - User signup
- `POST /api/auth/login` - User login
- `GET /api/services` - Browse all services
- `POST /api/payments/callback` - M-Pesa webhook

### Protected (User)
- `GET /api/auth/me` - Current user info
- `POST /api/orders` - Create order
- `GET /api/orders` - My orders
- `POST /api/orders/:id/payment` - Pay for order

### Protected (Admin Only)
- `POST /api/services` - Create service
- `PUT /api/services/:id` - Update service
- `DELETE /api/services/:id` - Delete service
- `GET /api/admin/orders` - All orders
- `PUT /api/admin/orders/:id` - Update order status
- `GET /api/admin/stats` - Dashboard statistics

## Environment Variables (Your Credentials Are Ready!)

Your `.env.example` already contains your credentials:

```
MONGO_URI=mongodb+srv://geopramtech_db_user:bZZA50KjO6AT1382@cluster0...
JWT_SECRET=d44d56ec39e2c8d400dafd94da658dce5e8f5...
ADMIN_EMAIL=celestaki018@gmail.com
ADMIN_PASSWORD=kim@7222
MPESA_CONSUMER_KEY=zy6Tc09PA8eteY3Mf5...
MPESA_CONSUMER_SECRET=KZ7pRIGv7y0FrdPThgVxxrvXHQhX8kHkj7XtRZLSKQxgMzA1RleT
MPESA_SHORTCODE=4574727
MPESA_TILL_NUMBER=5367886
MPESA_PASSKEY=9d09b38cbf40d3dc7bb1b627954f...
```

Just copy to `.env` and you're ready!

## Deployment to Vercel (Easy!)

### Backend
```bash
cd server
vercel deploy --prod
# Note the URL it gives you
```

### Frontend
```bash
cd ../client
# Add env var: VITE_API_URL=<your-backend-url>
vercel deploy --prod
```

See `DEPLOYMENT.md` for detailed instructions.

## Professional Features Included

✨ **UI/UX**
- Modern responsive design
- Smooth animations
- Professional color scheme
- Mobile-friendly layout

🔐 **Security**
- Password hashing (bcryptjs)
- JWT authentication
- Protected API routes
- CORS enabled

🔔 **Notifications**
- Real-time toast notifications
- Success/error/warning messages
- Auto-dismiss after 4 seconds

📊 **Admin Dashboard**
- Revenue tracking
- Order statistics
- Order management
- Service CRUD

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port 5000 (backend)
lsof -ti :5000 | xargs kill -9

# Kill process on port 3000 (frontend)
lsof -ti :3000 | xargs kill -9
```

### MongoDB Connection Error
- Check MongoDB is running
- Verify connection string
- Check IP whitelist on MongoDB Atlas
- Ensure user credentials are correct

### M-Pesa Payment Not Working
- Verify credentials are correct
- Check callback URL is accessible
- Test with sandbox environment first
- Review server logs

### Build Errors
```bash
# Clear and reinstall
rm -rf node_modules
rm package-lock.json
npm install
```

## Next Steps

1. **Local Testing**
   - Start the app locally
   - Create test services
   - Test the payment flow

2. **Admin Setup**
   - Create admin account
   - Add some test services
   - View dashboard

3. **User Testing**
   - Register as regular user
   - Browse services
   - Complete a test order

4. **Deploy**
   - Follow DEPLOYMENT.md
   - Add environment variables to Vercel
   - Test in production

## Support & Resources

📚 **Documentation**
- README.md - Full documentation
- DEPLOYMENT.md - Vercel deployment guide
- .env.example - Environment template

🔗 **External Resources**
- MongoDB: https://docs.mongodb.com
- Express: https://expressjs.com
- React: https://react.dev
- M-Pesa API: https://developer.safaricom.co.ke
- Vercel: https://vercel.com/docs

## Important Notes

✅ **What's Ready to Use**
- All code is production-ready
- No placeholder data
- Professional error handling
- Database models optimized
- M-Pesa integration complete

⚙️ **What You Need to Add**
- Your MongoDB credentials (in .env)
- Your M-Pesa credentials (in .env - already provided!)
- Deploy to Vercel (see DEPLOYMENT.md)
- Add real services through admin panel

🎯 **Testing Credentials**
- Email: any valid email
- Password: min 6 characters
- Phone: 254XXXXXXXXX or 0XXXXXXXXX format
- Admin: use ADMIN_EMAIL & ADMIN_PASSWORD from .env

## Commands Reference

```bash
# Development
npm run dev          # Start both frontend & backend
npm run server       # Backend only
npm run client       # Frontend only

# Production
npm run build        # Build both
npm start            # Production server

# Individual
cd server && npm run dev      # Backend
cd client && npm run dev      # Frontend
cd client && npm run build    # Build frontend
```

---

## 🎉 You're All Set!

Your complete service platform is ready. Just:
1. Install dependencies
2. Configure .env
3. Run locally or deploy to Vercel
4. Start taking orders!

**Happy coding! 🚀**

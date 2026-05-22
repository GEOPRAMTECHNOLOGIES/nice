# 📦 Geopram Service Platform - Complete Setup & Usage Guide

## Package Contents

Your professional service ordering platform includes:

### 📂 Project Structure
```
geopram-service-platform.zip (49 KB)
└── geopram-service-app/
    ├── server/              # Express.js backend (Node.js)
    ├── client/              # React frontend (Vite)
    ├── README.md            # Full documentation
    ├── QUICKSTART.md        # 5-minute quick start
    ├── DEPLOYMENT.md        # Vercel deployment guide
    ├── .env.example         # Pre-configured environment variables
    ├── .gitignore           # Git ignore file
    ├── package.json         # Root configuration
    └── vercel.json          # Vercel deployment config
```

## ⚡ Quick Start (5 Minutes)

### Step 1: Extract & Navigate
```bash
unzip geopram-service-platform.zip
cd geopram-service-app
```

### Step 2: Install All Dependencies
```bash
# Install root dependencies
npm install

# Install backend dependencies
npm install --prefix server

# Install frontend dependencies
npm install --prefix client
```

### Step 3: Set Up Environment
```bash
# Copy the example environment file (your credentials are already included!)
cp .env.example .env

# Verify the credentials in .env match your needs
# Default admin credentials:
# ADMIN_EMAIL=celestaki018@gmail.com
# ADMIN_PASSWORD=kim@7222
```

### Step 4: Start Development Server
```bash
npm run dev
```

This starts both frontend and backend simultaneously:
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5000

### Step 5: Access the Application
1. Open http://localhost:3000 in your browser
2. Click "Sign up" to create a user account
3. Login with your credentials
4. Browse services and place orders

## 👨‍💼 Admin Access

### Create Admin Account
The application includes a special admin registration endpoint. To create an admin:

1. Use the `/api/auth/register-admin` endpoint with:
   ```json
   {
     "name": "Admin Name",
     "email": "admin@example.com",
     "phone": "254712345678",
     "password": "securePassword",
     "adminEmail": "celestaki018@gmail.com",
     "adminPassword": "kim@7222"
   }
   ```

2. Or modify the credentials in `.env` and create admin through registration

### Admin Dashboard Features
- **📊 Dashboard**: View total orders, completed orders, revenue, etc.
- **📋 Orders Management**: See all customer orders with details (name, email, phone, price)
- **🛠️ Services Management**: Create, edit, delete services
- **💾 Order Status Updates**: Update order status and add notes

## 🔧 Available Commands

```bash
# Development
npm run dev              # Start both frontend & backend
npm run server           # Start backend only
npm run client           # Start frontend only

# Production
npm run build            # Build both applications
npm start                # Start production server

# Individual development
cd server && npm run dev    # Backend development
cd client && npm run dev    # Frontend development
cd client && npm run build  # Build frontend for production
```

## 🗄️ Database Setup

Your MongoDB connection is already configured in `.env`:

```
MONGO_URI=mongodb+srv://geopramtech_db_user:bZZA50KjO6AT1382@cluster0.58midep.mongodb.net/?appName=Cluster0
```

**The database is ready to use!** No additional setup needed.

## 💳 M-Pesa Integration

Your M-Pesa credentials are pre-configured:

```
MPESA_CONSUMER_KEY=zy6Tc09PA8eteY3Mf5...
MPESA_CONSUMER_SECRET=KZ7pRIGv7y0FrdPThgVxxrvXHQhX8kHkj7XtRZLSKQxgMzA1RleT
MPESA_SHORTCODE=4574727
MPESA_TILL_NUMBER=5367886
MPESA_PASSKEY=9d09b38cbf40d3dc7bb1b627954f...
```

**How It Works:**
1. User initiates payment for a service
2. M-Pesa STK push prompt appears on their phone
3. User enters M-Pesa PIN
4. Payment is processed
5. Webhook callback updates order status
6. User sees order as "Completed" and "Paid"

## 🎨 Frontend Features

### User Interface
- **Modern Dashboard**: Clean, professional design
- **Service Browsing**: Search, filter by category
- **Service Details**: Full information including price, duration
- **Order Management**: Track all orders
- **Payment Integration**: One-click M-Pesa payment
- **Notifications**: Real-time success/error messages
- **Responsive Design**: Works on desktop, tablet, mobile

### Pages
- `/` or `/home` - User dashboard
- `/login` - Login page
- `/register` - Registration page
- `/services` - Browse all services
- `/services/:id` - Service detail & checkout
- `/orders` - Order history
- `/admin/dashboard` - Admin dashboard (admin only)
- `/admin/orders` - Order management (admin only)
- `/admin/services` - Service management (admin only)

## 🔌 API Endpoints

### Authentication
```
POST   /api/auth/register           - User signup
POST   /api/auth/login              - User login
POST   /api/auth/register-admin     - Admin signup
GET    /api/auth/me                 - Current user (protected)
```

### Services
```
GET    /api/services                - Get all services
GET    /api/services/:id            - Get service details
POST   /api/services                - Create service (admin)
PUT    /api/services/:id            - Update service (admin)
DELETE /api/services/:id            - Delete service (admin)
```

### Orders & Payments
```
POST   /api/orders                  - Create order (protected)
GET    /api/orders                  - Get user orders (protected)
GET    /api/orders/:orderId         - Get order details (protected)
POST   /api/orders/:orderId/payment - Initiate payment (protected)
POST   /api/payments/callback       - M-Pesa webhook (public)
```

### Admin
```
GET    /api/admin/orders            - Get all orders (admin)
PUT    /api/admin/orders/:id        - Update order status (admin)
GET    /api/admin/stats             - Dashboard stats (admin)
```

## 🔐 Authentication Flow

1. **User Registration**
   - User enters: name, email, phone, password
   - Password is hashed with bcryptjs
   - User account created

2. **User Login**
   - User enters: email, password
   - Password verified
   - JWT token issued
   - Token stored in localStorage

3. **Protected Routes**
   - Token automatically added to API requests
   - Token validated on backend
   - User role checked for admin routes

## 📊 Data Models

### User
- **name**: String
- **email**: String (unique)
- **phone**: String
- **password**: String (hashed)
- **role**: 'user' or 'admin'
- **timestamps**: createdAt, updatedAt

### Service
- **name**: String
- **description**: String
- **price**: Number (in KES)
- **category**: String
- **duration**: String (e.g., "2-3 hours")
- **image**: URL (optional)
- **isActive**: Boolean
- **createdBy**: Admin reference
- **timestamps**: createdAt, updatedAt

### Order
- **orderId**: String (unique, e.g., "ORD-1234567890-ABC123")
- **user**: User reference
- **service**: Service reference
- **userDetails**: {name, email, phone}
- **serviceDetails**: {name, price}
- **amount**: Number
- **status**: 'pending' | 'completed' | 'failed' | 'cancelled'
- **paymentStatus**: 'unpaid' | 'paid' | 'failed'
- **mpesaDetails**: {merchantRequestId, checkoutRequestId, responseCode}
- **notes**: String (admin notes)
- **timestamps**: createdAt, updatedAt, completedAt

## 🚀 Deployment to Vercel

### One-Click Deployment

1. **Connect Your Repository**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Deploy Backend**
   ```bash
   cd server
   vercel deploy --prod
   # Note the URL (e.g., https://geopram-api.vercel.app)
   ```

3. **Deploy Frontend**
   ```bash
   cd ../client
   # Add environment variable in Vercel:
   # VITE_API_URL=https://geopram-api.vercel.app
   vercel deploy --prod
   ```

4. **Configure Environment Variables in Vercel**
   - Go to Project Settings
   - Add all variables from your `.env` file
   - Redeploy

See `DEPLOYMENT.md` for detailed instructions.

## 🧪 Testing the Application

### Test User Flow
1. Register a new account
2. View available services
3. Click "Order Now" on a service
4. Enter your phone number
5. Complete M-Pesa payment
6. Check order history - order should appear as "Pending" initially, then "Completed" after payment

### Test Admin Flow
1. Register as admin
2. Access `/admin/dashboard`
3. View statistics
4. Go to `/admin/orders` to see all orders
5. Update order statuses
6. Go to `/admin/services` to create/edit services

### Test Service Creation
1. As admin, go to `/admin/services`
2. Click "+ Add New Service"
3. Fill in:
   - Service Name
   - Description
   - Price (in KES)
   - Category
   - Duration
   - Image URL (optional)
4. Click "Create Service"
5. Service appears in user browsing section

## ⚙️ Configuration

### Customize Admin Credentials
Edit `.env`:
```
ADMIN_EMAIL=your_email@gmail.com
ADMIN_PASSWORD=your_secure_password
```

### Customize M-Pesa
Edit `.env` with your M-Pesa credentials:
```
MPESA_SHORTCODE=your_short_code
MPESA_TILL_NUMBER=your_till_number
MPESA_PASSKEY=your_passkey
MPESA_CONSUMER_KEY=your_key
MPESA_CONSUMER_SECRET=your_secret
```

### Customize Port
```
PORT=5000  # Backend port
# Frontend uses port 3000 (configurable in vite.config.js)
```

## 🔍 Monitoring & Debugging

### View Backend Logs
```bash
# Terminal running server
npm run server
# Logs appear in real-time
```

### View Frontend Errors
1. Open browser DevTools (F12)
2. Go to Console tab
3. See any JavaScript errors

### View Network Requests
1. Open DevTools
2. Go to Network tab
3. Click "Network" to see API calls
4. Click any request to see details

### Database Monitoring
1. Go to MongoDB Atlas
2. Select your cluster
3. Check "Logs" and "Metrics" sections

## 📝 Common Tasks

### Create a New Service
1. Login as admin
2. Go to `/admin/services`
3. Click "+ Add New Service"
4. Fill in all fields
5. Click "Create Service"

### Update Order Status
1. Go to `/admin/orders`
2. Find the order
3. Click "Edit"
4. Change status
5. Add notes if needed
6. Click "Update"

### Delete a Service
1. Go to `/admin/services`
2. Find the service
3. Click "Delete"
4. Confirm

### View User Orders
1. Login as user
2. Go to `/orders`
3. See all your orders with statuses

### Filter Orders
1. Go to `/admin/orders`
2. Use dropdown filters:
   - Status: Pending, Completed, Failed
   - Payment: Paid, Unpaid, Failed

## 🐛 Troubleshooting

### "Cannot find module" Error
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
npm install --prefix server
npm install --prefix client
```

### Port Already in Use
```bash
# Find and kill process
# On Linux/Mac:
lsof -ti :5000 | xargs kill -9

# On Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### Database Connection Failed
- Check MongoDB URI in `.env`
- Verify database is running
- Check IP whitelist in MongoDB Atlas
- Verify user credentials

### M-Pesa Payment Not Working
- Check all M-Pesa credentials
- Test callback URL with webhook tool
- Check server logs for errors
- Verify phone number format

### Frontend Not Connecting to Backend
- Check VITE_API_URL points to backend URL
- Ensure backend is running
- Check CORS is enabled
- Review Network tab in DevTools

## 📚 Documentation Files

- **README.md** - Complete feature documentation
- **QUICKSTART.md** - 5-minute setup guide
- **DEPLOYMENT.md** - Vercel deployment instructions
- **This file** - Setup and usage guide
- **.env.example** - Environment variables template

## ✅ Pre-Deployment Checklist

- [ ] Database connection working
- [ ] All environment variables set
- [ ] Login/registration works
- [ ] Services display correctly
- [ ] Order creation works
- [ ] M-Pesa payment tested
- [ ] Admin dashboard accessible
- [ ] Order management working
- [ ] Notifications display
- [ ] Responsive design on mobile

## 🎉 You're Ready!

Your complete service platform is ready to use. Start by:
1. Running locally: `npm run dev`
2. Creating test data
3. Testing the payment flow
4. Deploying to Vercel

For more details, see the included documentation files.

---

**Questions?** Check the documentation files or review the code comments for more details.

**Happy Building! 🚀**

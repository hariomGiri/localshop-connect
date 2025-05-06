# Community MarketLink - Project Documentation

## Project Overview

Community MarketLink is a web application that connects local shopkeepers with customers in their community. The platform enables shopkeepers to create online shops, list their products, and manage orders, while customers can browse shops, purchase products, and track their orders.

## Technology Stack

### Frontend
- **Framework**: React with TypeScript
- **UI Library**: Shadcn UI (based on Tailwind CSS)
- **State Management**: React Context API
- **Routing**: React Router
- **API Communication**: Fetch API
- **Build Tool**: Vite

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer
- **Email Service**: Nodemailer

## Core Features

### User Roles
1. **Customer**: Can browse shops, purchase products, and track orders
2. **Shopkeeper**: Can create and manage shops, add products, and fulfill orders
3. **Admin**: Can approve shops, manage users, and oversee platform operations

### Shop Management
- Shopkeepers can create shops with detailed information
- Each shop has a unique profile with images, descriptions, and addresses
- Shops require admin approval before becoming visible to customers
- Shopkeepers can manage their product inventory

### Product Management
- Products include details like name, description, price, category, and stock
- Products can be marked for delivery or pickup
- Product prices and images update dynamically when shopkeepers make changes

### Shopping Cart
- Customers can add products from multiple shops to their cart
- Cart persists between sessions using localStorage
- Cart shows product details, quantities, and total price

### Order System
- Supports regular orders and pre-orders
- Multiple payment methods (currently simulated)
- Order tracking and status updates

### Location-Based Features
- Shops can be searched by location
- Distance-based shop filtering

## Database Schema

### User Model
- Basic user information (name, email, password)
- Role-based access control (customer, shopkeeper, admin)
- Shop association for shopkeepers

### Shop Model
- Shop details (name, description, category)
- Address and contact information
- Approval status
- Owner reference (User)
- Product count

### Product Model
- Product details (name, description, price, category)
- Stock management
- Delivery/pickup options
- Shop association

### Order Model
- Customer reference
- Order items with product details
- Multiple shop support in a single order
- Delivery information
- Payment and order status tracking

## Application Flow

### Customer Journey
1. Register/Login
2. Browse shops and products
3. Add items to cart
4. Checkout and place order
5. Track order status

### Shopkeeper Journey
1. Register as shopkeeper
2. Create shop (pending admin approval)
3. Add products to shop
4. Manage inventory and orders
5. Update shop profile

### Admin Journey
1. Login as admin
2. Approve/reject shop applications
3. Monitor platform statistics
4. Manage users and content

## API Endpoints

### Authentication
- `/api/auth/register` - Register new user
- `/api/auth/login` - User login
- `/api/auth/me` - Get current user

### Shops
- `/api/shops` - Get all approved shops
- `/api/shops/:id` - Get specific shop
- `/api/shops/register` - Register new shop
- `/api/shops/user/myshop` - Get shopkeeper's shop
- `/api/shops/:id/approve` - Approve/reject shop

### Products
- `/api/products` - Get all products
- `/api/products/:id` - Get specific product
- `/api/products/shop/:shopId` - Get shop's products
- `/api/products/my/products` - Get shopkeeper's products

### Orders
- `/api/orders` - Get user's orders
- `/api/orders/:id` - Get specific order
- `/api/orders/create` - Create new order

## Currency
- The application uses Indian Rupees (₹) throughout the platform

## Setup and Installation

### Prerequisites
- Node.js (v14+)
- MongoDB
- npm or yarn

### Installation Steps
1. Clone the repository
2. Install dependencies for frontend and backend
3. Set up environment variables
4. Start the development servers

## Testing Accounts
The system includes scripts to create test accounts:
- Customer: `npm run create-customer`
- Shopkeeper: `npm run create-shopkeeper`
- Admin: `npm run create-admin`
- All users: `npm run create-all-users`
- Demo environment: `npm run setup-demo`

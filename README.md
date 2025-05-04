# LocalShop Connect

LocalShop Connect is a community marketplace platform that connects local shopkeepers with customers in their area. The platform allows shopkeepers to register their shops, list products, and manage orders, while customers can browse shops, search for products, and place orders for pickup or delivery.

## Features

### For Customers
- Browse local shops and products
- Search for specific products
- Add items to cart
- Place orders for pickup or delivery
- Track order status
- Leave reviews for shops and products

### For Shopkeepers
- Register and manage shop profile
- Add and manage products
- Process orders
- Communicate with customers
- View sales analytics

### For Admins
- Approve or reject shop registrations
- Monitor platform activity
- Manage users and shops
- View platform analytics

## Tech Stack

### Frontend
- React
- TypeScript
- Tailwind CSS
- Shadcn UI
- React Router
- React Query

### Backend
- Node.js
- Express
- MongoDB
- JWT Authentication
- Multer (for file uploads)
- Nodemailer (for email notifications)

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/localshop-connect.git
cd localshop-connect
```

2. Install dependencies for frontend
```bash
npm install
```

3. Install dependencies for backend
```bash
cd server
npm install
```

4. Create environment variables
   - Create a `.env` file in the root directory for frontend
   - Create a `.env` file in the server directory for backend

5. Start the development servers

Frontend:
```bash
npm run dev
```

Backend:
```bash
cd server
node index.js
```

## Environment Variables

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
```

### Backend (server/.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/localshop-connect
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d

# Email Configuration
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@example.com
EMAIL_PASS=your-email-password
EMAIL_FROM=LocalShop Connect <your-email@example.com>
```

## Project Structure

```
localshop-connect/
├── public/              # Static files
├── src/                 # Frontend source code
│   ├── components/      # Reusable components
│   ├── contexts/        # React contexts
│   ├── hooks/           # Custom hooks
│   ├── lib/             # Utility functions
│   ├── pages/           # Page components
│   └── App.tsx          # Main application component
├── server/              # Backend source code
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Express middleware
│   ├── models/          # Mongoose models
│   ├── routes/          # API routes
│   ├── utils/           # Utility functions
│   └── index.js         # Server entry point
└── README.md            # Project documentation
```

## License

This project is licensed under the MIT License.

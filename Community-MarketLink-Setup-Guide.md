# Community MarketLink - Setup Guide

This guide will help you set up and run the Community MarketLink application on your local machine.

## Prerequisites

Before you begin, ensure you have the following installed:

1. **Node.js** (v14 or higher)
2. **MongoDB** (local installation or MongoDB Atlas account)
3. **npm** or **yarn** package manager
4. **Git** for version control

## Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/community-marketlink.git
cd community-marketlink
```

### 2. Frontend Setup

Install the frontend dependencies:

```bash
npm install
```

### 3. Backend Setup

Navigate to the server directory and install the backend dependencies:

```bash
cd server
npm install
```

### 4. Environment Configuration

#### Backend Environment Variables

Create a `.env` file in the server directory with the following variables:

```
PORT=5001
MONGODB_URI=mongodb://localhost:27017/localshop-connect
JWT_SECRET=community_marketlink_secret_key_2024
JWT_EXPIRES_IN=7d
```

If you're using MongoDB Atlas, replace the MONGODB_URI with your connection string.

### 5. Database Setup

Ensure MongoDB is running on your local machine or you have access to your MongoDB Atlas cluster.

### 6. Create Test Users (Optional)

The application includes scripts to create test users for development:

```bash
# Create a test customer account
npm run create-customer

# Create a test shopkeeper account
npm run create-shopkeeper

# Create a test admin account
npm run create-admin

# Create all test accounts
npm run create-all-users

# Set up a complete demo environment
npm run setup-demo
```

## Running the Application

### 1. Start the Backend Server

From the server directory:

```bash
npm run dev
```

The server will start on port 5001 (or the port specified in your .env file).

### 2. Start the Frontend Development Server

From the project root directory:

```bash
npm run dev
```

The frontend development server will start, typically on port 8080.

### 3. Access the Application

Open your browser and navigate to:

```
http://localhost:8080
```

## Test Accounts

If you've run the setup scripts, you can use these test accounts:

### Customer
- Email: customer@example.com
- Password: password123

### Shopkeeper
- Email: shopkeeper@example.com
- Password: password123

### Admin
- Email: admin@example.com
- Password: password123

## Building for Production

### 1. Build the Frontend

From the project root:

```bash
npm run build
```

This will create a production build in the `dist` directory.

### 2. Run the Production Server

The backend is configured to serve the frontend build files. After building the frontend, you can run:

```bash
cd server
npm start
```

The application will be available at `http://localhost:5001`.

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check your connection string in the .env file
   - Verify network connectivity to MongoDB Atlas (if using)

2. **Port Already in Use**
   - Change the PORT value in your .env file
   - Kill the process using the port: `npx kill-port 5001`

3. **Missing Dependencies**
   - Run `npm install` in both the root and server directories

4. **Image Upload Issues**
   - Ensure the uploads directory exists and has write permissions
   - Check file size limits in the multer configuration

5. **JWT Authentication Issues**
   - Clear browser localStorage and try logging in again
   - Ensure JWT_SECRET is properly set in the .env file

## Project Structure

```
community-marketlink/
├── dist/                  # Production build
├── public/                # Static assets
├── server/                # Backend code
│   ├── controllers/       # API controllers
│   ├── middleware/        # Express middleware
│   ├── models/            # Mongoose models
│   ├── routes/            # API routes
│   ├── scripts/           # Utility scripts
│   ├── uploads/           # Uploaded files
│   ├── utils/             # Utility functions
│   ├── .env               # Environment variables
│   ├── index.js           # Server entry point
│   └── package.json       # Backend dependencies
├── src/                   # Frontend code
│   ├── components/        # React components
│   ├── contexts/          # React contexts
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utility libraries
│   ├── pages/             # Page components
│   ├── types/             # TypeScript type definitions
│   ├── utils/             # Utility functions
│   ├── App.tsx            # Main App component
│   └── main.tsx           # Application entry point
├── package.json           # Frontend dependencies
└── vite.config.ts         # Vite configuration
```

## Additional Resources

- [React Documentation](https://reactjs.org/docs/getting-started.html)
- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Mongoose Documentation](https://mongoosejs.com/docs/guide.html)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Shadcn UI Documentation](https://ui.shadcn.com/)

## Support

If you encounter any issues or have questions, please open an issue on the GitHub repository or contact the project maintainers.

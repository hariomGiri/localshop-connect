import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const secret = process.env.JWT_SECRET;
console.log('JWT_SECRET:', secret);

try {
  const token = jwt.sign({ id: '123456789' }, secret, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
  
  console.log('Token generated successfully:', token);
  
  // Verify the token
  const decoded = jwt.verify(token, secret);
  console.log('Token verified successfully:', decoded);
} catch (error) {
  console.error('Error with JWT:', error.message);
}

import fetch from 'node-fetch';

const testLoginAPI = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123'
      }),
    });

    const data = await response.json();

    console.log('API Response Status:', response.status);
    console.log('API Response:', data);

    if (data.success) {
      console.log('Login successful!');
      console.log('Token:', data.token);
      console.log('User:', data.user);
    } else {
      console.log('Login failed:', data.message);
    }

  } catch (error) {
    console.error('Error testing login API:', error);
  }
};

// Run the function
testLoginAPI();

const express = require('express');
const pool = require('./db'); // Import the database connection
require('dotenv').config();

const app = express();

// Test route to check the database connection
app.get('/test-db', async (req, res) => {
  try {
    // Use the pool to query the database
    const client = await pool.connect();
    const result = await client.query('SELECT 1');
    client.release(); // Release the client back to the pool
    console.log('Database connection successful');
    res.status(200).json({ message: 'Database connection successful' });
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({ error: 'Database connection failed' });
  }
});

app.get('/', (req, res) => {
  res.send('Hello, this is the homepage of your application!');
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

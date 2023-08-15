console.log('Before dotenv config');

const express = require('express');
require('dotenv').config();



const app = express();
const db = require('./db'); 

console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_PORT:', process.env.DB_PORT);
console.log('DB_NAME:', process.env.DB_NAME);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD);


// Test route to check the database connection
app.get('/test-db', async (req, res) => {
  try {
    await db.any('SELECT 1');
    res.status(200).json({ message: 'Database connection successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Database connection failed' });
  }
});

// ... Existing routes ...

const PORT = process.env.PORT || 5100;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


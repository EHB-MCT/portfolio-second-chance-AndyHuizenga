const { Client } = require('pg');

// Create a new PostgreSQL client instance
const client = new Client({
  host: '172.17.0.2', // Replace with your container's IP address
  port: 5432, // Default PostgreSQL port
  database: 'ThePainterDb',
  user: 'postgres',
  password: 'postgres',
});

// Connect to the database
client.connect()
  .then(() => {
    console.log('Connected to PostgreSQL database');
  })
  .catch(error => {
    console.error('Error connecting to database:', error.message);
  })
  .finally(() => {
    // Close the database connection
    client.end();
  });

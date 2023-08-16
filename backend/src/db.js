const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.POSTGRES_IP, // Replace with PostgreSQL container's IP
  port: 5432, // Default PostgreSQL port
  database: 'postgres', // Default PostgreSQL database
  user: 'postgres', // Default PostgreSQL username
  password: process.env.POSTGRES_PASSWORD // Use the password you set in .env
});

module.exports = pool;

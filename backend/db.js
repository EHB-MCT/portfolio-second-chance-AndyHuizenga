const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD
});

async function applyMigrations() {
  const migrationScriptPath = path.join(__dirname, 'migrations', 'create_tables.sql');
  try {
    const migrationScript = fs.readFileSync(migrationScriptPath, 'utf8');
    await pool.query(migrationScript);
    console.log('Migration script executed successfully');
  } catch (error) {
    console.error('Error executing migration script:', error.message);
  }
}

module.exports = {
  pool,
  applyMigrations
};

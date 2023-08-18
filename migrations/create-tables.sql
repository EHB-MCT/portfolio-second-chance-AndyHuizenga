-- create_tables.sql

CREATE TABLE drawings (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255),
  content TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

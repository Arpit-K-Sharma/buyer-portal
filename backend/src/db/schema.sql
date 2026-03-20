-- Buyer Portal Database Schema
-- Run this file first before seeding: psql -d buyer_portal -f schema.sql

-- Drop tables in reverse dependency order
DROP TABLE IF EXISTS favourites;
DROP TABLE IF EXISTS properties;
DROP TABLE IF EXISTS users;

-- Users table
CREATE TABLE users (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(100) NOT NULL,
  email       VARCHAR(150) UNIQUE NOT NULL,
  password    VARCHAR(255) NOT NULL,
  created_at  TIMESTAMP DEFAULT NOW(),
  updated_at  TIMESTAMP DEFAULT NOW()
);

-- Properties table
CREATE TABLE properties (
  id          SERIAL PRIMARY KEY,
  title       VARCHAR(200) NOT NULL,
  description TEXT,
  location    VARCHAR(200),
  price       NUMERIC(12, 2),
  type        VARCHAR(50),
  image_url   VARCHAR(500),
  created_at  TIMESTAMP DEFAULT NOW()
);

-- Favourites table (junction: user <-> property)
CREATE TABLE favourites (
  id          SERIAL PRIMARY KEY,
  user_id     INTEGER REFERENCES users(id) ON DELETE CASCADE,
  property_id INTEGER REFERENCES properties(id) ON DELETE CASCADE,
  created_at  TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, property_id)
);

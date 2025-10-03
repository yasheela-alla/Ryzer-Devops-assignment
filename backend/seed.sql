-- Ryzer Tokenized Assets Database Schema
-- This script creates the necessary tables and seeds initial data

-- Drop existing tables if they exist
DROP TABLE IF EXISTS transactions;
DROP TABLE IF EXISTS assets;

-- Create assets table
-- Stores information about tokenized real estate assets
CREATE TABLE assets (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price INTEGER NOT NULL,  -- Price per token in USD
    supply INTEGER NOT NULL,  -- Number of tokens available
    location VARCHAR(255),
    type VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create transactions table
-- Records all token purchases
CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    asset_id INTEGER NOT NULL REFERENCES assets(id),
    buyer VARCHAR(255) NOT NULL,
    quantity INTEGER NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed initial assets
INSERT INTO assets (name, price, supply, location, type) VALUES
    ('Luxury Apartment in Mumbai', 100000, 50, 'Mumbai, India', 'Residential'),
    ('Beachfront Villa in Goa', 250000, 20, 'Goa, India', 'Residential'),
    ('Commercial Space in Bangalore', 150000, 35, 'Bangalore, India', 'Commercial'),
    ('Penthouse in Delhi', 300000, 15, 'Delhi, India', 'Residential'),
    ('Resort Property in Kerala', 200000, 25, 'Kerala, India', 'Hospitality'),
    ('Tech Park in Hyderabad', 180000, 40, 'Hyderabad, India', 'Commercial');

-- Create indexes for better query performance
CREATE INDEX idx_transactions_asset_id ON transactions(asset_id);
CREATE INDEX idx_transactions_timestamp ON transactions(timestamp DESC);

-- Display seeded data
SELECT 'Assets seeded successfully:' as message;
SELECT * FROM assets;

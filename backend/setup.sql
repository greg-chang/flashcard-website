-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables to ensure clean state
DROP TABLE IF EXISTS flashcards;
DROP TABLE IF EXISTS decks;
DROP TABLE IF EXISTS users;

-- Create users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    clerk_id TEXT UNIQUE NOT NULL,  -- Clerk's user ID
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL
); 

-- Create the 'decks' table
CREATE TABLE decks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), -- Automatically generate a unique UUID
    owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE, -- Foreign key to the 'users' table
    labels TEXT[], -- An array of text for labels (e.g. ["math", "science"])
    title TEXT NOT NULL,
    description TEXT
);

-- Create the 'flashcards' table
CREATE TABLE flashcards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), -- Automatically generate a unique UUID
    parent_deck UUID NOT NULL REFERENCES decks(id) ON DELETE CASCADE, -- Foreign key to the 'decks' table
    starred BOOLEAN NOT NULL DEFAULT FALSE,
    front TEXT NOT NULL,
    back TEXT NOT NULL
);

-- Enable the extension for using UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
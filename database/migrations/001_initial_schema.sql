-- PostgreSQL / Supabase Schema Migration Script
-- File: c:\VashtyNime\database\migrations\001_initial_schema.sql

-- Enable UUID extension for auto-generating unique identifiers
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Users Table (Synchronized upon login via Firebase Auth)
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(128) PRIMARY KEY, -- Firebase UID (e.g. from Google login)
    username VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    photo VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 2. Anime Table
CREATE TABLE IF NOT EXISTS anime (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    cover_url VARCHAR(500),
    banner_url VARCHAR(500),
    genre VARCHAR(100)[], -- Array of genres (e.g. {'Action', 'Shounen', 'Fantasy'})
    rating NUMERIC(3, 2) DEFAULT 0.0 CHECK (rating >= 0.0 AND rating <= 10.0),
    status VARCHAR(50) DEFAULT 'ONGOING', -- ONGOING, COMPLETED, HIATUS
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Optimize search queries and rating sorted lists
CREATE INDEX IF NOT EXISTS idx_anime_title ON anime(title);
CREATE INDEX IF NOT EXISTS idx_anime_rating ON anime(rating DESC);

-- 3. Episodes Table
CREATE TABLE IF NOT EXISTS episodes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    anime_id UUID REFERENCES anime(id) ON DELETE CASCADE NOT NULL,
    episode_number INT NOT NULL,
    video_url VARCHAR(500) NOT NULL, -- Adaptive HLS .m3u8 streaming link
    duration INT NOT NULL, -- Duration in seconds
    thumbnail VARCHAR(500), -- Episode thumbnail link in R2
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    UNIQUE(anime_id, episode_number)
);

-- Speed up query to fetch episodes for specific anime
CREATE INDEX IF NOT EXISTS idx_episodes_anime_id ON episodes(anime_id);

-- 4. Bookmarks Table
CREATE TABLE IF NOT EXISTS bookmarks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(128) REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    anime_id UUID REFERENCES anime(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    UNIQUE(user_id, anime_id)
);

-- Quick lookup to see a specific user's bookmarks
CREATE INDEX IF NOT EXISTS idx_bookmarks_user_id ON bookmarks(user_id);

-- 5. Histories Table (Tracks users' current watching progress per episode)
CREATE TABLE IF NOT EXISTS histories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(128) REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    episode_id UUID REFERENCES episodes(id) ON DELETE CASCADE NOT NULL,
    progress INT NOT NULL DEFAULT 0, -- Watch progress duration in seconds
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    UNIQUE(user_id, episode_id)
);

-- Quick lookup to build history list
CREATE INDEX IF NOT EXISTS idx_histories_user_id ON histories(user_id);

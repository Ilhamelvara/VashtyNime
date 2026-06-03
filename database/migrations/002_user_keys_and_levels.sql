-- SQL Migration Document: 002_user_keys_and_levels.sql
-- Path: c:\VashtyNime\database\migrations\002_user_keys_and_levels.sql

-- 1. Add new columns to the users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS level INT DEFAULT 1 NOT NULL;
ALTER TABLE users ADD COLUMN IF NOT EXISTS xp INT DEFAULT 0 NOT NULL;
ALTER TABLE users ADD COLUMN IF NOT EXISTS keys_count INT DEFAULT 10 NOT NULL;
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_key_regen_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL;

-- 2. Create the episode_unlocks table to keep track of unlocked episodes
CREATE TABLE IF NOT EXISTS episode_unlocks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(128) REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    episode_id UUID REFERENCES episodes(id) ON DELETE CASCADE NOT NULL,
    unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    UNIQUE(user_id, episode_id)
);

-- Optimize queries searching for unlocked episodes per user
CREATE INDEX IF NOT EXISTS idx_episode_unlocks_user_id ON episode_unlocks(user_id);

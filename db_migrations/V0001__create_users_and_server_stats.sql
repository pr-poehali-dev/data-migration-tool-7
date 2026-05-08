
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(32) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  is_confirmed BOOLEAN DEFAULT FALSE,
  confirm_token VARCHAR(64),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS server_stats (
  id SERIAL PRIMARY KEY,
  online_count INTEGER DEFAULT 0,
  max_online INTEGER DEFAULT 0,
  updated_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO server_stats (online_count, max_online) VALUES (0, 0);

CREATE TABLE IF NOT EXISTS places (
    name TEXT,
    url TEXT NOT NULL,
    latitude REAL,
    longitude REAL,
    user_id INTEGER NOT NULL,
    FOREIGN KEY(user_id) REFERENCES users(ROWID)
);

CREATE TABLE IF NOT EXISTS users (
    email TEXT NOT NULL,
    password TEXT NOT NULL,
    username TEXT,
    UNIQUE(email)
);

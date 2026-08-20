CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    subscription_type VARCHAR(50),
    created_at DATETIME
);

CREATE TABLE IF NOT EXISTS genres (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS content (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(50) NOT NULL,
    language VARCHAR(255),
    release_year INT,
    rating DOUBLE,
    poster_url VARCHAR(500),
    backdrop_url VARCHAR(500),
    trailer_url VARCHAR(500),
    video_url VARCHAR(500),
    duration INT,
    is_premium BOOLEAN DEFAULT FALSE,
    views BIGINT DEFAULT 0,
    cast_members VARCHAR(500),
    director VARCHAR(255),
    age_rating VARCHAR(50),
    created_at DATETIME
);

CREATE TABLE IF NOT EXISTS content_genres (
    content_id BIGINT NOT NULL,
    genre_id BIGINT NOT NULL,
    PRIMARY KEY (content_id, genre_id)
);

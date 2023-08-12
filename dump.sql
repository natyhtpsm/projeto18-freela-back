CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    phone VARCHAR(20),
    email VARCHAR(255) UNIQUE,
    password VARCHAR(255)
);

CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    id_seller INT REFERENCES users(id),
    name VARCHAR(255),
    description TEXT,
    photo VARCHAR(255),
    category VARCHAR(50),
    status VARCHAR(20),
    price DECIMAL(10, 2), 
);

CREATE TABLE sessions (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    token VARCHAR(255) NOT NULL,
    expiration TIMESTAMP NOT NULL,
    token_type VARCHAR(50)
);


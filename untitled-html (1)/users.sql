CREATE DATABASE registration_db;

USE registration_db;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL,
  phone VARCHAR(15) NOT NULL,
  password VARCHAR(100) NOT NULL
);
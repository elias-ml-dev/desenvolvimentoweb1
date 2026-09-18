CREATE DATABASE ecommerce;

USE ecommerce;

CREATE TABLE produtos(
	id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    preco FLOAT NOT NULL
);

select * from produtos;


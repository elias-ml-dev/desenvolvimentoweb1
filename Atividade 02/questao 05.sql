CREATE DATABASE empresa;
USE empresa;

CREATE TABLE clientes(
	id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    telefone VARCHAR (20) NOT NULL
);

select * from clientes;	

	
CREATE DATABASE empresa2;
USE empresa2;

CREATE TABLE funcionarios(
	id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    cargo VARCHAR (100) NOT NULL,
    salario FLOAT NOT NULL
);

select * from funcionarios;	

	
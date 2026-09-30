CREATE DATABASE IF NOT EXISTS laboratorio_avaliacao;
USE laboratorio_avaliacao;

CREATE TABLE IF NOT EXISTS computadores( 
	id INT AUTO_INCREMENT PRIMARY KEY, 
    patrimonio VARCHAR (50) NOT NULL, 
    localizacao VARCHAR (100)NOT NULL,
    responsavel VARCHAR (100) NOT NULL,
    situacao VARCHAR(30) NOT NULL
);

select * from computadores;
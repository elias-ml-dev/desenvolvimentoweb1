CREATE DATABASE laboratorio_avaliacaao;
USE laboratorio_avaliacao;

CREATE TABLE computadores( 
	id INT AUTO_INCREMENT PRIMARY KEY, 
    patrimonio VARCHAR (50) NOT NULL, 
    localizacao VARCHAR (100)NOT NULL,
    responsavel VARCHAR (100) NOT NULL,
    status VARCHAR(30) NOT NULL
);

select * from computadores;
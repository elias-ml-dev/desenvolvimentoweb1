CREATE DATABASE gamer;
use gamer;

CREATE TABLE jogos(
	id INT AUTO_INCREMENT PRIMARY KEY, 
    nome VARCHAR(100), 
    genero VARCHAR(50) 
);

select * from jogos;
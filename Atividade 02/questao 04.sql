CREATE DATABASE instituicao;
USE instituicao;

CREATE TABLE cursos(
	id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    carga_horaria FLOAT NOT NULL
);

select * from cursos;	


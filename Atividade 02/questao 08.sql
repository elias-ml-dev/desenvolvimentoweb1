CREATE DATABASE escola2;
USE escola2;

CREATE TABLE disciplinas (
	id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    professor VARCHAR (100) NOT NULL,
    aulas_semanais VARCHAR (100) NOT NULL
);
	
select * from disciplinas;	

	
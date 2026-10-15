CREATE DATABASE crud_alunos;
USE crud_alunos;

CREATE TABLE alunos(
	id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    turma VARCHAR(100) NOT NULL,
    idade INT NOT NULL,
    email VARCHAR(100) NOT NULL
);

DESCRIBE alunos;

INSERT INTO alunos (nome, turma, idade, email) VALUES 
('Carlos Silva', 'Desenvolvimento de Sistemas', 18, 'carlos.silva@email.com'),
('Ana Souza', 'Desenvolvimento de Sistemas', 17, 'ana.souza@email.com'),
('Lucas Oliveira', 'Banco de Dados', 19, 'lucas.oliveira@email.com');

SELECT * FROM alunos;
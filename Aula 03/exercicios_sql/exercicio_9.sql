CREATE DATABASE gerenciador_tarefas;
USE gerenciador_tarefas;

CREATE TABLE tarefas( 	
	id INT AUTO_INCREMENT PRIMARY KEY, 
    descricao VARCHAR(200), 
    responsavel VARCHAR(100) 
);
select * from tarefas;

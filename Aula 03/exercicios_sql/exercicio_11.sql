CREATE DATABASE cadastro_eventos;
USE cadastro_eventos;

CREATE TABLE eventos( 
	id INT AUTO_INCREMENT PRIMARY KEY, 
    nome VARCHAR(100), 	
    data_evento DATE 
);

select * from eventos;

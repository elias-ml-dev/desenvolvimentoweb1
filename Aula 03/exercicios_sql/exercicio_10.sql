CREATE DATABASE cadastro_computadores;
USE cadastro_computadores;

CREATE TABLE computadores( 
	id INT AUTO_INCREMENT PRIMARY KEY, 
    patrimonio VARCHAR(50), 
    localizacao VARCHAR(100) 
);

select * from computadores;
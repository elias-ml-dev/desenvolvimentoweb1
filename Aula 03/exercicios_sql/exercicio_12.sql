CREATE DATABASE sistema_veiculos;
USE sistema_veiculos;


CREATE TABLE veiculos ( 
	id INT AUTO_INCREMENT PRIMARY KEY, 
	modelo VARCHAR(100), 
    placa VARCHAR(20) 
);

select * from veiculos;
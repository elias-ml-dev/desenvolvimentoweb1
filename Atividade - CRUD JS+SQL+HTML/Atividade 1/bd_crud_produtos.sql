CREATE DATABASE crud_produtos;
USE crud_produtos;

CREATE TABLE produtos(
	id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    quantidade INT NOT NULL,
    preco DECIMAL(10,2) NOT NULL
);


DESCRIBE produtos;

INSERT INTO produtos (nome, quantidade, preco) VALUES
	('Teclado Mecâncico', 15, 189.90),
    ('Mouse Gamer', 25, 89.90),
    ('Headset USB', 10, 149.90);
			
SELECT * FROM produtos;
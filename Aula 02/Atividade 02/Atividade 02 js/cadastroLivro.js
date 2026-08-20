const mysql = require("mysql2")

// Conexão com o Mysql
const conexao = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "biblioteca"
});

// Dados que serão cadastrados
const titulo = "As Crônicas de Nárnia"
const autor = "C. S. Lewis"

// Comando SQL 
const insert = "INSERT INTO livros (titulo, autor) VALUES (?, ?)";

//Envia os dados para o MySQL 
conexao.query(insert,[titulo, autor], function(erro){

    if (erro) {
        console.log("Erro ao cadastrar.");
        console.log(erro);
    } else {
        console.log("Livro cadastrado com sucesso");
    }
});

// ID do Livro que será excluido
const id = 2;

const deletar = "DELETE FROM livros WHERE id = ?";

conexao.query(deletar, [id], function (erro, resultado){

    if (erro) {
        console.log("Erro ao excluir livro.");
        console.log(erro);
    } else if (resultado.affectedRows === 0) {
        console.log("Livro não encontrado");
        } else {
            console.log("Livro excluido com sucesso!")
        }
    conexao.end();
});
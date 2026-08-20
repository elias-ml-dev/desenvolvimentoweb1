const mysql = require("mysql2");

// Conexão copm o MySQL
const conexao = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "ecommerce"
});

// Dados que serão cadastrados
const nome = "Mouse";
const preco = 75.50;

// Comando SQL 
const insert = "INSERT INTO produtos (nome, preco) VALUES (?, ?)";

// Envia os dados para o MySQL
conexao.query(insert,[nome, preco], function(erro){

    if (erro) {
        console.log("Erro ao cadastrar.");
        console.log(erro);
    } else {
        console.log("Produto cadastrado com sucesso!");
    }

});

// ID do produto que será excluído 
const id = 2;

const deletar = "DELETE FROM produtos WHERE id = ?";

conexao.query(deletar, [id], function (erro, resultado) {

    if (erro) {
        console.log("Erro ao excluir produto.");
        console.log(erro);
    } else if (resultado.affectedRows === 0) {
        console.log("Produto não encontrado.");
    } else {
        console.log("Produto excluído com sucesso!");
    }
    conexao.end();
});
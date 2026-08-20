const mysql = require("mysql2");

// Conexão copm o MySQL
const conexao = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "empresa"
});

/*// Dados que serão cadastrados
const nome = "Juliana Costa";
const telefone = 47977770000;

// Comando SQL 
const insert = "INSERT INTO clientes (nome, telefone) VALUES (?, ?)";

// Envia os dados para o MySQL
conexao.query(insert,[nome, telefone], function(erro){

    if (erro) {
        console.log("Erro ao cadastrar.");
        console.log(erro);
    } else {
        console.log("Cliente cadastrado com sucesso!");
    }

});*/

// ID do produto que será excluído 
const id = 2;

const deletar = "DELETE FROM clientes WHERE id = ?";

conexao.query(deletar, [id], function (erro, resultado) {

    if (erro) {
        console.log("Erro ao excluir cliente.");
        console.log(erro);
    } else if (resultado.affectedRows === 0) {
        console.log("Cliente não encontrado.");
    } else {
        console.log("Cliente excluído com sucesso!");
    }
    conexao.end();
});
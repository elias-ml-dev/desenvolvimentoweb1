const mysql = require("mysql2")

// Conexão com o Mysql
const conexao = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "loja"
});

// Dados que serão cadastrados
const produto = "Notebook"
const quantidade = 2
const valor = 3500

// Comando SQL 
const insert = "INSERT INTO vendas (produto, quantidade, valor) VALUES (?, ?, ?)";

//Envia os dados para o MySQL 
conexao.query(insert,[produto, quantidade, valor], function(erro){

    if (erro) {
        console.log("Erro ao cadastrar.");
        console.log(erro);
    } else {
        console.log("Venda cadastrada com sucesso");
    }
    conexao.end();
});


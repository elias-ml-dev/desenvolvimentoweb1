const mysql = require("mysql2");

// Conexão copm o MySQL
const conexao = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "escola"
});

// Dados que serão cadastrados
const nome = "Lara";
const email = "larinha@email.com";

// Comando SQL 
const insert = "INSERT INTO alunos (nome, email) VALUES (?, ?)";

// Envia os dados para o MySQL
conexao.query(insert,[nome, email], function(erro){

    if (erro) {
        console.log("Erro ao cadastrar.");
        console.log(erro);
    } else {
        console.log("Aluno cadastrado com sucesso!");
    }

});

// ID do aluno que será excluído 
const id = 2;

const deletar = "DELETE FROM alunos WHERE id = ?";

conexao.query(deletar, [id], function (erro, resultado) {

    if (erro) {
        console.log("Erro ao excluir  aluno.");
        console.log(erro);
    } else if (resultado.affectedRows === 0) {
        console.log("Aluno não encontrado.");
    } else {
        console.log("Aluno excluído com sucesso!");
    }
    conexao.end();
});
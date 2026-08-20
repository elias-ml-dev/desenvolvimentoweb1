const mysql = require("mysql2")

// Conexão com o MySQL 
const conexao = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "escola"
});

// Dados que serão cadastrados
const nome = "Fernanda"
const disciplina = "Programação"

//Comando SQL 
const insert = "INSERT INTO PROFESSORES (nome, disciplina) VALUES (?, ?)";

//Envia os dados para o MySQL
conexao.query(insert, [ nome, disciplina], function(erro){

    if (erro) {
        console.log("Erro ao cadastrar.");
        console.log(erro);
    } else {
        console.log("Professor cadastrado com sucesso!")
    }
});

// ID do Professor que será excluido
const id = 20;

const deletar = "DELETE FROM professores WHERE id = ?";

conexao.query(deletar, [id], function (erro, resultado){

    if (erro) {
        console.log("Erro ao excluir professor.");
        console.log(erro);
    } else if (resultado.affectedRows === 0) {
        console.log("Professor não encontrado");
        } else {
            console.log("Professor excluido com sucesso!")
        }
    conexao.end();
});
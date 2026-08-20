const mysql = require("mysql2")

// Conexão com o MySQL 
const conexao = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "instituicao"
});

// Dados que serão cadastrados
const nome = "Logistica"
const carga_horaria = 1400

//Comando SQL 
const insert = "INSERT INTO cursos (nome, carga_horaria) VALUES (?, ?)";

//Envia os dados para o MySQL
conexao.query(insert, [ nome, carga_horaria], function(erro){

    if (erro) {
        console.log("Erro ao cadastrar.");
        console.log(erro);
    } else {
        console.log("Curso cadastrado com sucesso!")
    }
});

/*// ID do Curso que será excluido
const id = 3;

const deletar = "DELETE FROM cursos WHERE id = ?";

conexao.query(deletar, [id], function (erro, resultado){

    if (erro) {
        console.log("Erro ao excluir curso.");
        console.log(erro);
    } else if (resultado.affectedRows === 0) {
        console.log("Curso não encontrado");
        } else {
            console.log("Curso excluido com sucesso!")
        }
    conexao.end();
});*/
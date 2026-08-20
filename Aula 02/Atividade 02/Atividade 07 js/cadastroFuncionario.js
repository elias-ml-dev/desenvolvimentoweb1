const mysql = require("mysql2")

// Conexão com o Mysql
const conexao = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "empresa2"
});

// Dados que serão cadastrados
const nome = "Carlos"
const cargo = "Zelador"
const salario = 5000.00

// Comando SQL 
const insert = "INSERT INTO funcionarios (nome, cargo, salario) VALUES (?, ?, ?)";

//Envia os dados para o MySQL 
conexao.query(insert,[nome, cargo, salario], function(erro){

    if (erro) {
        console.log("Erro ao cadastrar.");
        console.log(erro);
    } else {
        console.log("Funcionário cadastrado com sucesso");
    }
});

/*// ID do Filme que será excluido
const id = 50;

const deletar = "DELETE FROM funcionarios WHERE id = ?";

conexao.query(deletar, [id], function (erro, resultado){

    if (erro) {
        console.log("Erro ao excluir funcionario.");
        console.log(erro);
    } else if (resultado.affectedRows === 0) {
        console.log("Funcionário não encontrado");
        } else {
            console.log("Funcionário excluido com sucesso!")
        }
    conexao.end();
});*/
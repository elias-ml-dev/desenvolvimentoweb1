const mysql = require("mysql2")

// Conexão com o Mysql
const conexao = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "escola2"
});

// Dados que serão cadastrados
const nome = "Engenharia de Software"
const professor = "Rafael"
const aulas_semanais = "3 aulas semanais"

// Comando SQL 
const insert = "INSERT INTO disciplinas (nome, professor, aulas_semanais) VALUES (?, ?, ?)";

//Envia os dados para o MySQL 
conexao.query(insert,[nome, professor, aulas_semanais], function(erro){

    if (erro) {
        console.log("Erro ao cadastrar.");
        console.log(erro);
    } else {
        console.log("Disciplina cadastrado com sucesso");
    }
});

/*// ID da Disciplina que será excluido
const id = 2;

const deletar = "DELETE FROM disciplinas WHERE id = ?";

conexao.query(deletar, [id], function (erro, resultado){

    if (erro) {
        console.log("Erro ao excluir disciplina.");
        console.log(erro);
    } else if (resultado.affectedRows === 0) {
        console.log("Disciplina não encontrado");
        } else {
            console.log("Disciplina excluido com sucesso!"  )
        }
    conexao.end();
});*/
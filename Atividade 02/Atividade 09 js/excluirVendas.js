const mysql = require("mysql2")

// Conexão com o Mysql
const conexao = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "loja"
});

// ID da Disciplina que será excluido
const id = 0;

const deletar = "DELETE FROM vendas WHERE id = ?";

conexao.query(deletar, [id], function (erro, resultado){

    if (erro) {
        console.log("Erro ao excluir venda.");
        console.log(erro);
    } else if (resultado.affectedRows === 0) {
        console.log("Venda não encontrada.");
        } else {
            console.log("Venda excluída com sucesso!"  )
        }
    conexao.end();
});

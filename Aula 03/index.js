const mysql = require("mysql2");
const readline = require("readline-sync")


// Conexão com o MySQL
const conexao = mysql.createConnection({
    host:"127.0.0.1",
    user: "root",
    password: "root",
    database: "escola"    
});

//Função para cadastrar aluno
function cadastrarAluno() {

    const nome = readline.question("Digite o nome do aluno: ");
    const email = readline.question("Digite o email do aluno: ");

    const insert = "INSERT INTO alunos (nome, email) VALUES (?,?)";

    conexao.query(insert,[nome, email], function (erro){

        if (erro) {
            console.log("Erro ao cadastrar.");
            console.log(erro);
        } else {
            console.log("Aluno cadastrado com sucesso!");
        }
         menu();
    });  
}

// Função para excluir aluno

function excluirAluno() {

    const id = readline.questionInt("Digite o ID do aluno: ");

    const deletar ="DELETE FROM alunos WHERE id = ?";

    conexao.query(deletar, [id], function (erro, resultado){

        if (erro) {
            console.log("Erro ao excluir o aluno.");
        } else if (resultado.affectedRows === 0) {
            console.log("Aluno não encontrado.");
        } else {
            console.log("Aluno excluído com sucesso!");
        }

        menu();
    });
}


// Função para listar alunos
function listarAlunos() {
    const sql = "SELECT * FROM alunos";

    conexao.query(sql, function (erro, alunos){
        if (erro) {
            console.log("Erro ao buscar alunos.");
        } else {
            console.log("\n--- ALUNOS ---");
            alunos.forEach(function (aluno){
                console.log(
                    aluno.id + " - " +
                    aluno.nome + " - " +
                    aluno.email
                );
            });
        }
        menu();
    });
}

// Menu principal
function menu() {

    console.log("\n===== MENU =====");
    console.log("1 - Cadastrar aluno");
    console.log("2 - Excluir aluno");
    console.log("3 - Listar alunos");
    console.log("0 - Sair");

    const opcao = readline.questionInt("Escolha uma opcao: ");

    if (opcao === 1) {
        cadastrarAluno();
    } else if (opcao === 2) {
        excluirAluno();
    } else if (opcao === 3){
        listarAlunos();
    } else if (opcao === 0) {
        console.log("Programa encerrado");
        conexao.end();
    } else {
        console.log("Opção invalida")
        menu();
    }
}

// Inicia o programa
menu();

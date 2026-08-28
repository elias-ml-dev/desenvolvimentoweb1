const mysql = require("mysql2");
const readline = require("readline-sync")


// Conexão com o MySQL
const conexao = mysql.createConnection({
    host:"localhost",
    user: "root",
    password: "root",
    database: "gerenciador_tarefas"    
});

//Função para cadastrar 
function cadastrarTarefa() {

    const descricao = readline.question("Digite a descrição: ")
    const responsavel = readline.question("Digite o responsável: ")

    const insert = "INSERT INTO tarefas (descricao, responsavel) VALUES (?,?)";

    conexao.query(insert,[descricao, responsavel], function (erro){

        if (erro) {
            console.log("Erro ao cadastrar.");
            console.log(erro);
        } else {
            console.log("Tarefa cadastrada com sucesso!");
        }
         menu();
    });  
}

//Função atualizar
function atualizarTarefa(){
     
    // ID que será atualizado
    const id = readline.questionInt("Digite o ID da tarefa que deseja atualizar: ");
        
        console.log(`\nAtualizando dados `);

        const descricao = readline.question("Digite a descrição: ")
        const responsavel = readline.question("Digite o responsável: ")

        const update = `
            UPDATE tarefas
            SET descricao = ?, responsavel = ? 
            WHERE id = ?
        `;
        conexao.query(update, [descricao, responsavel, id], function (erro, resultado) {
        
            if (erro) {
                console.log("Erro ao atualizar a tarefa.");
                console.log(erro);
            } else if (resultado.affectedRows === 0) {
                console.log("Tarefa não encontrada.");
            } else {
                console.log("Tarefa atualizada com sucesso!");
            }
        menu();
        });
}


// Função para excluir 

function excluirTarefa() {

    const id = readline.questionInt("Digite o ID da TAREFA: ");

    const deletar ="DELETE FROM tarefas WHERE id = ?";

    conexao.query(deletar, [id], function (erro, resultado){

        if (erro) {
            console.log("Erro ao excluir a tarefa.");
        } else if (resultado.affectedRows === 0) {
            console.log("Tarefa não encontrada.");
        } else {
            console.log("Tarefa excluída com sucesso!");
        }

        menu();
    });
}


// Função para listar 
function listarTarefa() {
    const sql = "SELECT * FROM tarefas";

    conexao.query(sql, function (erro, tarefas){
        if (erro) {
            console.log("Erro ao buscar tarefa.");
        } else {
            console.log("\n--- TAREFAS ---");
            tarefas.forEach(function (tarefa){
                console.log(
                    tarefa.id + " - " +
                    tarefa.descricao + " - " +
                    tarefa.responsavel + " - " 
                );
            });
        }
        menu();
    });
}

// Menu principal
function menu() {

    console.log("\n===== TAREFAS =====");
    console.log("1 - Cadastrar tarefa");
    console.log("2 - Listar tarefas");
    console.log("3 - Excluir tarefa");
    console.log("4 - Atualizar tarefa");
    console.log("0 - Sair");

    const opcao = readline.questionInt("Escolha uma opcao: ");

    if (opcao === 1) {
        cadastrarTarefa();
     } else if (opcao === 2){
        listarTarefa();
    } else if (opcao === 3) {
        excluirTarefa();
    } else if (opcao === 4) {
        atualizarTarefa();
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
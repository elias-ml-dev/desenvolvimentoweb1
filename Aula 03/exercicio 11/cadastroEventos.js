const mysql = require("mysql2");
const readline = require("readline-sync")


// Conexão com o MySQL
const conexao = mysql.createConnection({
    host:"localhost",
    user: "root",
    password: "root",
    database: "cadastro_eventos"    
});

//Função para cadastrar 
function cadastrarEvento() {

    const nome = readline.question("Digite o o nome do evento: ")
    const data_evento = readline.question("Digite a data do evento: ")

    const insert = "INSERT INTO eventos (nome, data_evento) VALUES (?,?)";

    conexao.query(insert,[nome, data_evento], function (erro){

        if (erro) {
            console.log("Erro ao cadastrar.");
            console.log(erro);
        } else {
            console.log("Evento cadastrado com sucesso!");
        }
         menu();
    });  
}

//Função atualizar
function atualizarEvento(){
     
    // ID que será atualizado
    const id = readline.questionInt("Digite o ID do evento que deseja atualizar: ");
        
        console.log(`\nAtualizando dados `);

        const nome = readline.question("Digite o o nome do evento: ")
        const data_evento = readline.question("Digite a data do evento: ")

        const update = `
            UPDATE eventos
            SET nome = ?, data_evento = ? 
            WHERE id = ?
        `;
        conexao.query(update, [nome, data_evento, id], function (erro, resultado) {
        
            if (erro) {
                console.log("Erro ao atualizar o evento.");
                console.log(erro);
            } else if (resultado.affectedRows === 0) {
                console.log("Evento não encontrado.");
            } else {
                console.log("Evento atualizado com sucesso!");
            }
        menu();
        });
}

// Função para excluir 

function excluirEvento() {

    const id = readline.questionInt("Digite o ID do EVENTO: ");

    const deletar ="DELETE FROM eventos WHERE id = ?";

    conexao.query(deletar, [id], function (erro, resultado){

        if (erro) {
            console.log("Erro ao excluir o evento.");
        } else if (resultado.affectedRows === 0) {
            console.log("Evento não encontrado.");
        } else {
            console.log("Evento excluído com sucesso!");
        }

        menu();
    });
}


// Função para listar 
function listarEventos() {
    const sql = "SELECT * FROM eventos  ORDER BY data_evento";

    conexao.query(sql, function (erro, eventos){
        if (erro) {
            console.log("Erro ao buscar eventos.");
        } else {
            console.log("\n--- EVENTOS ---");
            eventos.forEach(function (evento){
                console.log(
                    evento.id + " - " +
                    evento.nome + " - " +
                    evento.data_evento + " - " 
                );
            });
        }
        menu();
    });
}

// Menu principal
function menu() {

    console.log("\n===== EVENTOS =====");
    console.log("1 - Cadastrar evento");
    console.log("2 - Listar eventos");
    console.log("3 - Excluir evento");
    console.log("4 - Atualizar evento");
    console.log("0 - Sair");

    const opcao = readline.questionInt("Escolha uma opcao: ");

    if (opcao === 1) {
        cadastrarEvento();
     } else if (opcao === 2){
        listarEventos();
    } else if (opcao === 3) {
        excluirEvento();
    } else if (opcao === 4) {
        atualizarEvento();
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
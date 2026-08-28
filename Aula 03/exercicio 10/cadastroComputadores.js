const mysql = require("mysql2");
const readline = require("readline-sync")


// Conexão com o MySQL
const conexao = mysql.createConnection({
    host:"localhost",
    user: "root",
    password: "root",
    database: "cadastro_computadores"    
});

//Função para cadastrar 
function cadastrarComputador() {

    const patrimonio = readline.question("Digite o patrimonio: ")
    const localizacao = readline.question("Digite a localização: ")

    const insert = "INSERT INTO computadores (patrimonio, localizacao) VALUES (?,?)";

    conexao.query(insert,[patrimonio, localizacao], function (erro){

        if (erro) {
            console.log("Erro ao cadastrar.");
            console.log(erro);
        } else {
            console.log("Computador cadastrado com sucesso!");
        }
         menu();
    });  
}

//Função atualizar
function atualizarComputador(){
     
    // ID que será atualizado
    const id = readline.questionInt("Digite o ID do computador que deseja atualizar: ");
        
        console.log(`\nAtualizando dados `);

         const patrimonio = readline.question("Digite o patrimonio: ")
        const localizacao = readline.question("Digite a localização: ")

        const update = `
            UPDATE computadores
            SET patrimonio = ?, localizacao = ? 
            WHERE id = ?
        `;
        conexao.query(update, [patrimonio, localizacao, id], function (erro, resultado) {
        
            if (erro) {
                console.log("Erro ao atualizar o computador.");
                console.log(erro);
            } else if (resultado.affectedRows === 0) {
                console.log("Computador não encontrado.");
            } else {
                console.log("Computador atualizado com sucesso!");
            }
        menu();
        });
}

// Função para excluir 

function excluirComputador() {

    const id = readline.questionInt("Digite o ID do COMPUTADOR: ");

    const sql = "SELECT * FROM computadores WHERE id = ?";

    conexao.query(sql, [id], function (erro, computadores) {

        if (erro) {
            console.log("Erro ao buscar computador.");
            menu();
        } 
        else if (computadores.length === 0) {
            console.log("Computador não encontrado.");
            menu();
        } 
        else {

            console.log("\nComputador encontrado:");
            console.log("Patrimônio:", computadores[0].patrimonio);
            console.log("Localização:", computadores[0].localizacao);

            const confirmar = readline.question("Deseja excluir? (S/N): ");

            if (confirmar === "S" || confirmar === "s") {

                const deletar = "DELETE FROM computadores WHERE id = ?";

                conexao.query(deletar, [id], function (erro) {

                    if (erro) {
                        console.log("Erro ao excluir.");
                    } else {
                        console.log("Computador excluído com sucesso!");
                    }

                    menu();
                });

            } else {
                console.log("Exclusão cancelada.");
                menu();
            }
        }
    });
}


// Função para listar 
function listarComputador() {
    const sql = "SELECT * FROM computadores";

    conexao.query(sql, function (erro, computadores){
        if (erro) {
            console.log("Erro ao buscar computador.");
        } else {
            console.log("\n--- COMPUTADORES ---");
            computadores.forEach(function (computador){
                console.log(
                    computador.id + " - " +
                    computador.patrimonio + " - " +
                    computador.localizacao + " - " 
                );
            });
        }
        menu();
    });
}

// Menu principal
function menu() {

    console.log("\n===== COMPUTADORES =====");
    console.log("1 - Cadastrar computador");
    console.log("2 - Listar computador");
    console.log("3 - Excluir computador");
    console.log("4 - Atualizar computador");
    console.log("0 - Sair");

    const opcao = readline.questionInt("Escolha uma opcao: ");

    if (opcao === 1) {
        cadastrarComputador();
     } else if (opcao === 2){
        listarComputador();
    } else if (opcao === 3) {
        excluirComputador();
    } else if (opcao === 4) {
        atualizarComputador();
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
const mysql = require("mysql2");
const readline = require("readline-sync")


// Conexão com o MySQL
const conexao = mysql.createConnection({
    host:"localhost",
    user: "root",
    password: "root",
    database: "empresa2"    
});

//Função para cadastrar 
function cadastrarCliente() {

    const nome = readline.question("Digite o nome: ")
    const telefone = readline.question("Digite o telefone: ")

    const insert = "INSERT INTO clientes (nome, telefone) VALUES (?,?)";

    conexao.query(insert,[nome, telefone], function (erro){

        if (erro) {
            console.log("Erro ao cadastrar.");
            console.log(erro);
        } else {
            console.log("Cliente cadastrado com sucesso!");
        }
         menu();
    });  
}

//Função atualizar
function atualizarCliente(){
     
    // ID que será atualizado
    const id = readline.questionInt("Digite o ID do cliente que deseja atualizar: ");
        
        console.log(`\nAtualizando dados `);

        const nome = readline.question("Digite o nome: ")
        const telefone = readline.question("Digite o telefone: ")

        const update = `
            UPDATE clientes
            SET nome = ?, telefone = ? 
            WHERE id = ?
        `;
        conexao.query(update, [nome, telefone, id], function (erro, resultado) {
        
            if (erro) {
                console.log("Erro ao atualizar o cliente.");
                console.log(erro);
            } else if (resultado.affectedRows === 0) {
                console.log("Cliente não encontrado.");
            } else {
                console.log("Cliente atualizado com sucesso!");
            }
        menu();
        });
}

// Função para excluir 

function excluirCliente() {

    const id = readline.questionInt("Digite o ID do CLIENTE: ");

    const deletar ="DELETE FROM clientes WHERE id = ?";

    conexao.query(deletar, [id], function (erro, resultado){

        if (erro) {
            console.log("Erro ao excluir o cliente.");
        } else if (resultado.affectedRows === 0) {
            console.log("Cliente não encontrado.");
        } else {
            console.log("Cliente excluído com sucesso!");
        }

        menu();
    });
}


// Função para listar 
function listarCliente() {
    const sql = "SELECT * FROM clientes";

    conexao.query(sql, function (erro, clientes){
        if (erro) {
            console.log("Erro ao buscar clientes.");
        } else {
            console.log("\n--- CLIENTES ---");
            clientes.forEach(function (cliente){
                console.log(
                    cliente.id + " - " +
                    cliente.nome + " - " +
                    cliente.telefone + " - " 
                );
            });
        }
        menu();
    });
}

// Menu principal
function menu() {

    console.log("\n===== CLIENTES =====");
    console.log("1 - Cadastrar cliente");
    console.log("2 - Listar clientes");
    console.log("3 - Excluir cliente");
    console.log("4 - Atualizar cliente");
    console.log("0 - Sair");

    const opcao = readline.questionInt("Escolha uma opcao: ");

    if (opcao === 1) {
        cadastrarCliente();
     } else if (opcao === 2){
        listarCliente();
    } else if (opcao === 3) {
        excluirCliente();
    } else if (opcao === 4) {
        atualizarCliente();
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
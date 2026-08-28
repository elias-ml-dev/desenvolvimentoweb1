const mysql = require("mysql2");
const readline = require("readline-sync")


// Conexão com o MySQL
const conexao = mysql.createConnection({
    host:"localhost",
    user: "root",
    password: "root",
    database: "loja"    
});

//Função para cadastrar 
function cadastrarProduto() {

    const nome = readline.question("Digite o nome do produto: ");
    const preco = readline.question("Digite o preco: ")
    const quantidade = readline.question("Digite a quantidade: ")

    const insert = "INSERT INTO produtos (nome, preco, quantidade) VALUES (?,?,?)";

    conexao.query(insert,[nome, preco, quantidade], function (erro){

        if (erro) {
            console.log("Erro ao cadastrar.");
            console.log(erro);
        } else {
            console.log("Produto cadastrado com sucesso!");
        }
         menu();
    });  
}

// Função atualizar 

function atualizarProduto(){
     
    // ID que será atualizado
    const id = readline.questionInt("Digite o ID do produto que deseja atualizar: ");
        
        console.log(`\nAtualizando dados `);

        const nome = readline.question("Digite o nome do produto: ");
        const preco = readline.question("Digite o preco: ")
        const quantidade = readline.question("Digite a quantidade: ")

        const update = `
            UPDATE produtos
            SET nome = ?, preco = ?, quantidade = ? 
            WHERE id = ?
        `;
        conexao.query(update, [nome, preco, quantidade, id], function (erro, resultado) {
        
            if (erro) {
                console.log("Erro ao atualizar o produto.");
                console.log(erro);
            } else if (resultado.affectedRows === 0) {
                console.log("Produto não encontrado.");
            } else {
                console.log("Produto atualizado com sucesso!");
            }
        menu();
        });
}


// Função para excluir 

function excluirProduto() {

    const id = readline.questionInt("Digite o ID do PRODUTO: ");

    const deletar ="DELETE FROM produtos WHERE id = ?";

    conexao.query(deletar, [id], function (erro, resultado){

        if (erro) {
            console.log("Erro ao excluir o produto.");
        } else if (resultado.affectedRows === 0) {
            console.log("Produto não encontrado.");
        } else {
            console.log("Produto excluído com sucesso!");
        }

        menu();
    });
}


// Função para listar 
function listarProduto() {
    const sql = "SELECT * FROM produtos";

    conexao.query(sql, function (erro, produtos){
        if (erro) {
            console.log("Erro ao buscar produtos.");
        } else {
            console.log("\n--- PRODUTOS ---");
            produtos.forEach(function (produto){
                console.log(
                    produto.id + " - " +
                    produto.nome + " - " +
                    produto.preco + " - " +
                    produto.quantidade + " - "
                );
            });
        }
        menu();
    });
}

// Menu principal
function menu() {

    console.log("\n===== PRODUTOS =====");
    console.log("1 - Cadastrar produto");
    console.log("2 - Listar produtos");
    console.log("3 - Excluir produtos");
    console.log("4 - Atualizar produto");
    console.log("0 - Sair");

    const opcao = readline.questionInt("Escolha uma opcao: ");

    if (opcao === 1) {
        cadastrarProduto();
     } else if (opcao === 2){
        listarProduto();
    } else if (opcao === 3) {
        excluirProduto();
    }else if (opcao === 4){
        atualizarProduto();
    }else if (opcao === 0) {
        console.log("Programa encerrado");
        conexao.end();
    } else {
        console.log("Opção invalida")
        menu();
    }
}

// Inicia o programa
menu();
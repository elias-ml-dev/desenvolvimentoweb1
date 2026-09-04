const mysql = require("mysql2");
const readline = require("readline-sync")


// Conexão com o MySQL
const conexao = mysql.createConnection({
    host:"localhost",
    user: "root",
    password: "root",
    database: "biblioteca"    
});

//Função para cadastrar 
function cadastrarLivro() {

    const titulo = readline.question("Digite o titulo: ")
    const autor = readline.question("Digite o nome do autor: ")

    const insert = "INSERT INTO livro (titulo, autor) VALUES (?,?)";

    conexao.query(insert,[titulo, autor], function (erro){

        if (erro) {
            console.log("Erro ao cadastrar.");
            console.log(erro);
        } else {
            console.log("Livro cadastrado com sucesso!");
        }
         menu();
    });  
}

// Função atualizar 

function atualizarLivro(){
     
    // ID que será atualizado
    const id = readline.questionInt("Digite o ID do livro que deseja atualizar: ");
        
        console.log(`\nAtualizando dados `);

        const titulo = readline.question("Digite o  novo titulo: ");
        const autor = readline.question("Digite o novo nome do autor: ");

        const update = `
            UPDATE livro
            SET titulo = ?, autor = ? 
            WHERE id = ?
        `;
        conexao.query(update, [titulo, autor, id], function (erro, resultado) {
        
            if (erro) {
                console.log("Erro ao atualizar o livro.");
                console.log(erro);
            } else if (resultado.affectedRows === 0) {
                console.log("Livro não encontrado.");
            } else {
                console.log("Livro atualizado com sucesso!");
            }
        menu();
        });
}


// Função para excluir 

function excluirLivro() {
    const id = readline.questionInt("Digite o ID do livro que deseja excluir? ");

    const sql = "SELECT * FROM livro WHERE id = ?";

    conexao.query(sql,[id], function(erro, livro){
        if(erro){
            console.log("Erro ao buscar livro.");
            console.log(erro)
            menu();
        } else if(livro.length === 0){
            console.log("Livro não encontrado.");
            menu();
        } else{
            console.log("\nLivro encontrado:");
            console.log("Titulo:", livro[0].titulo);
            console.log("Autor:", livro[0].autor);

            const confirmar = readline.question("Deseja excluir: (S/N)");

            if(confirmar === "S" || confirmar === "s"){
                const deletar = "DELETE FROM livro WHERE id = ?";

                conexao.query(deletar,[id], function(erro, resultado){
                    if(erro){
                        console.log("Erro ao excluir livro.");
                        console.log(erro)
                    } else if(resultado.affectedRows === 0){
                        console.log("Livro não encontrado. ");
                    } else{
                        console.log("Livro excluido com sucesso! ");
                    }
                    menu();
                });
            } else if(confirmar === "N" || confirmar === "n"){
                console.log("Exclusão cancelada.");
                menu();
            } else{
                console.log("Opção inválida. ");
                menu();
            }
        
        }
    });
}


// Função para listar 
function listarLivro() {
    const sql = "SELECT * FROM livro";

    conexao.query(sql, function (erro, livro){
        if (erro) {
            console.log("Erro ao buscar livros.");
        } else {
            console.log("\n--- LIVROS ---");
            livro.forEach(function (livro){
                console.log(
                    livro.id + " - " +
                    livro.titulo + " - " +
                    livro.autor + " - " 
                );
            });
        }
        menu();
    });
}

// Menu principal
function menu() {

    console.log("\n===== LIVROS =====");
    console.log("1 - Cadastrar livro");
    console.log("2 - Listar livro");
    console.log("3 - Excluir livro");
    console.log("4 - Atualizar livro");
    console.log("0 - Sair");

    const opcao = readline.questionInt("Escolha uma opcao: ");

    if (opcao === 1) {
        cadastrarLivro();
     } else if (opcao === 2){
        listarLivro();
    } else if (opcao === 3) {
        excluirLivro();
    } else if (opcao === 4) {
        atualizarLivro();
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
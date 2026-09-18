const mysql = require("mysql2");
const readline = require("readline-sync")


// Conexão com o MySQL
const conexao = mysql.createConnection({
    host:"localhost",
    user: "root",
    password: "root",
    database: "locadora"    
});

//Função para cadastrar 
function cadastrarFilme() {

    const titulo = readline.question("Digite o titulo do filme: ")
    const ano = readline.question("Digite o ano do filme: ")

    const insert = "INSERT INTO filmes2 (titulo, ano) VALUES (?,?)";

    conexao.query(insert,[titulo, ano], function (erro){

        if (erro) {
            console.log("Erro ao cadastrar.");
            console.log(erro);
        } else {
            console.log("Filme cadastrado com sucesso!");
        }
         menu();
    });  
}

//Função atualizar
function atualizarFilme(){
     
    // ID que será atualizado
    const id = readline.questionInt("Digite o ID do filme que deseja atualizar: ");
        
        console.log(`\nAtualizando dados `);

        const titulo = readline.question("Digite o titulo do filme: ")
        const ano = readline.question("Digite o ano do filme: ")

        const update = `
            UPDATE filmes2
            SET titulo = ?, ano = ? 
            WHERE id = ?
        `;
        conexao.query(update, [titulo, ano, id], function (erro, resultado) {
        
            if (erro) {
                console.log("Erro ao atualizar o filme.");
                console.log(erro);
            } else if (resultado.affectedRows === 0) {
                console.log("Filme não encontrado.");
            } else {
                console.log("Filme atualizado com sucesso!");
            }
        menu();
        });
}


// Função para excluir 

function excluirFilme() {

    const id = readline.questionInt("Digite o ID do FILME: ");
    const sql ="SELECT * FROM filmes2 WHERE id = ?";

    conexao.query(sql,[id],function(erro, filmes2){
        if(erro){
            console.log("Erro ao buscar filme. ");
            console.log(erro)
            menu();
        } else if(filmes2.length === 0){
            console.log("Filme não encontrado");
            menu();
        } else{
            console.log("\nFilme encontrado. ");
            console.log("Titulo: ", filmes2[0].titulo);
            console.log("Ano: ", filmes2[0].ano);

            const confirmar = readline.question("Deseja realmente excluir o filme? (S/N) ");
            if(confirmar === "S" || confirmar === "s"){
                const deletar = "DELETE FROM filmes2 WHERE id = ?";

                conexao.query(deletar,[id], function(erro,resultado){
                    if(erro){
                        console.log("Erro ao excluir filme. ");
                        console.log(erro)
                    }else if(resultado.affectedRows === 0){
                        console.log("Filme não encontrado. ")
                    } else{
                        console.log("Filme excluido com sucesso! ");
                    }
                    menu();
                })
            }else if(confirmar === "N" || confirmar === "n"){
                console.log("Exclusão cancelada. ");
                menu();
            }else{
                console.log("Opção inválida. ");
                menu();
            }
        }
    });

}


// Função para listar 
function listarFilmes() {
    const sql = "SELECT * FROM filmes2  ORDER BY titulo";

    conexao.query(sql, function (erro, filmes2){
        if (erro) {
            console.log("Erro ao buscar filmes.");
        } else {
            console.log("\n--- FILMES ---");
            filmes2.forEach(function (filme){
                console.log(
                    filme.id + " - " +
                    filme.titulo + " - " +
                    filme.ano + " - " 
                );
            });
        }
        menu();
    });
}

// Menu principal
function menu() {

    console.log("\n===== FILMES =====");
    console.log("1 - Cadastrar filme");
    console.log("2 - Listar filmes");
    console.log("3 - Excluir filme");
    console.log("4 - Atualizar filme");
    console.log("0 - Sair");

    const opcao = readline.questionInt("Escolha uma opcao: ");

    if (opcao === 1) {
        cadastrarFilme();
     } else if (opcao === 2){
        listarFilmes();
    } else if (opcao === 3) {
        excluirFilme();
    } else if (opcao === 4) {
        atualizarFilme();
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
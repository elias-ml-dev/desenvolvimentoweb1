const mysql = require("mysql2");
const readline = require("readline-sync")


// Conexão com o MySQL
const conexao = mysql.createConnection({
    host:"localhost",
    user: "root",
    password: "root",
    database: "gamer"    
});

//Função para cadastrar 
function cadastrarJogo() {

    const nome = readline.question("Digite o nome do jogo: ")
    const genero = readline.question("Digite o genero do jogo: ")

    const insert = "INSERT INTO jogos (nome, genero) VALUES (?,?)";

    conexao.query(insert,[nome, genero], function (erro){

        if (erro) {
            console.log("Erro ao cadastrar.");
            console.log(erro);
        } else {
            console.log("Jogo cadastrado com sucesso!");
        }
         menu();
    });  
}

//Função atualizar
function atualizarJogo(){
     
    // ID que será atualizado
    const id = readline.questionInt("Digite o ID do jogo que deseja atualizar: ");
        
        console.log(`\nAtualizando dados `);

        const nome = readline.question("Digite o  novo nome: ");
        const genero = readline.question("Digite o novo genero: ");

        const update = `
            UPDATE jogos
            SET nome = ?, genero = ? 
            WHERE id = ?
        `;
        conexao.query(update, [nome, genero, id], function (erro, resultado) {
        
            if (erro) {
                console.log("Erro ao atualizar o jogo.");
                console.log(erro);
            } else if (resultado.affectedRows === 0) {
                console.log("Jogo não encontrado.");
            } else {
                console.log("Jogo atualizado com sucesso!");
            }
        menu();
        });
}

// Função para excluir 

function excluirJogo() {

    const id = readline.questionInt("Digite o ID do JOGO: ");
    const sql = "SELECT * FROM  jogos WHERE id = ?";

    conexao.query(sql,[id],function(erro,jogos){
        if(erro){
            console.log("Erro ao buscar jogo. ");
            console.log(erro)
            menu();
        } else if(jogos.length === 0){
            console.log("Jogo não encontrado.");
            menu();
        } else{
            console.log("\nJogo encontrado: ");
            console.log("Nome: ", jogos[0].nome);
            console.log("Genero: ", jogos[0].genero);

            const confirmar = readline.question("Deseja realmente excluir? (S/N) ");

            if(confirmar === "S" || confirmar === "s"){
                const deletar = "DELETE FROM jogos WHERE id = ?";
                conexao.query(deletar,[id],function(erro, resultado){
                    if(erro){
                        console.log("Erro ao excluir jogo.");
                        console.log(erro)
                    } else if(resultado.affectedRows === 0){
                        console.log("Jogo não encontrado. ");
                    } else{
                        console.log("Jogo excluido com sucesso" );
                    }
                    menu();
                })

            } else if(confirmar === "N" || confirmar === "n"){
                console.log("Exclusão cancelada. ")
                menu();
            } else{
                console.log("Opção inválida. ");
                menu();
            }
        }
    }); 
}


// Função para listar 
function listarJogo() {
    const sql = "SELECT * FROM jogos";

    conexao.query(sql, function (erro, jogos){
        if (erro) {
            console.log("Erro ao buscar jogos.");
        } else {
            console.log("\n--- JOGO ---");
            jogos.forEach(function (jogo){
                console.log(
                    jogo.id + " - " +
                    jogo.nome + " - " +
                    jogo.genero + " - " 
                );
            });
        }
        menu();
    });
}

// Menu principal
function menu() {

    console.log("\n===== LIVROS =====");
    console.log("1 - Cadastrar jogo");
    console.log("2 - Listar jogos");
    console.log("3 - Excluir jogo");
    console.log("4 - Atualizar jogo");
    console.log("0 - Sair");

    const opcao = readline.questionInt("Escolha uma opcao: ");

    if (opcao === 1) {
        cadastrarJogo();
     } else if (opcao === 2){
        listarJogo();
    } else if (opcao === 3) {
        excluirJogo();
    } else if (opcao === 4) {
        atualizarJogo();
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
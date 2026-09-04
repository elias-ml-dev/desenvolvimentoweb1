const mysql = require("mysql2");
const readline = require("readline-sync")


// Conexão com o MySQL
const conexao = mysql.createConnection({
    host:"localhost",
    user: "root",
    password: "root",
    database: "escola"    
});

//Função para cadastrar 
function cadastrarCurso() {

    const nome = readline.question("Digite o nome do curso: ")
    const carga_horaria = readline.question("Digite a carga horaria do curso: ")

    const insert = "INSERT INTO cursos (nome, carga_horaria) VALUES (?,?)";

    conexao.query(insert,[nome, carga_horaria], function (erro){

        if (erro) {
            console.log("Erro ao cadastrar.");
            console.log(erro);
        } else {
            console.log("Curso cadastrado com sucesso!");
        }
         menu();
    });  
}


//Função atualizar
function atualizarCurso(){
     
    // ID que será atualizado
    const id = readline.questionInt("Digite o ID do curso que deseja atualizar: ");
        
        console.log(`\nAtualizando dados `);

        const nome = readline.question("Digite o nome do curso: ")
        const carga_horaria = readline.question("Digite a carga horaria do curso: ")

        const update = `
            UPDATE cursos
            SET nome = ?, carga_horaria = ? 
            WHERE id = ?
        `;
        conexao.query(update, [nome, carga_horaria, id], function (erro, resultado) {
        
            if (erro) {
                console.log("Erro ao atualizar o curso.");
                console.log(erro);
            } else if (resultado.affectedRows === 0) {
                console.log("Curso não encontrado.");
            } else {
                console.log("Curso atualizado com sucesso!");
            }
        menu();
        });
}


// Função para excluir 

function excluirCurso() {

    const id = readline.questionInt("Digite o ID do CURSO: ");
    const sql = "SELECT * FROM cursos WHERE id = ?";

    conexao.query(sql,[id], function(erro, cursos){
        if(erro){
            console.log("Erro ao buscar curso.");
            console.log(erro)
            menu();
        } else if(cursos.length === 0){
            console.log("Curso não encontrado. ");
            menu();
        } else{
            console.log("\nCurso encontrado: ");
            console.log("Nome: ", cursos[0].nome);
            console.log("Carga horaria: ", cursos[0].carga_horaria);

            const confirmar = readline.question("Deseja realmente excluir este curso? (S/N) ");

            if(confirmar === "S" || confirmar === "s"){
                const deletar = "DELETE FROM cursos WHERE id = ?";
                conexao.query(deletar,[id],function(erro,resultado){
                    if(erro){
                        console.log("Erro ao excluir curso.");
                        console.log(erro)
                    } else if(resultado.affectedRows === 0){
                        console.log("Curso não encontrado. ")
                    } else {
                        console.log("Curso excluido com sucesso! ")
                    }
                    menu();
                });
            }else if(confirmar === "N" || confirmar === "n"){
                console.log("Exclusão cancelada.");
                menu();
            }else{
                console.log("Opção inválida. ");
                menu();
            }
        }
    });
}


// Função para listar 
function listarCurso() {
    const sql = "SELECT * FROM cursos";

    conexao.query(sql, function (erro, cursos){
        if (erro) {
            console.log("Erro ao buscar curso.");
        } else {
            console.log("\n--- CURSOS ---");
            cursos.forEach(function (curso){
                console.log(
                    curso.id + " - " +
                    curso.nome + " - " +
                    curso.carga_horaria + " - " 
                );
            });
        }
        menu();
    });
}

// Menu principal
function menu() {

    console.log("\n===== CURSOS =====");
    console.log("1 - Cadastrar curso");
    console.log("2 - Listar cursos");
    console.log("3 - Excluir curso");
    console.log("4 - Atualizar curso");
    console.log("0 - Sair");

    const opcao = readline.questionInt("Escolha uma opcao: ");

    if (opcao === 1) {
        cadastrarCurso();
     } else if (opcao === 2){
        listarCurso();
    } else if (opcao === 3) {
        excluirCurso();
    } else if (opcao === 4) {
        atualizarCurso();
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
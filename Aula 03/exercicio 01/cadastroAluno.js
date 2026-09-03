const mysql = require("mysql2");
const readline = require("readline-sync")


// Conexão com o MySQL
const conexao = mysql.createConnection({
    host:"localhost",
    user: "root",
    password: "root",
    database: "escola"    
});

//Função para cadastrar aluno
function cadastrarAluno() {

    const nome = readline.question("Digite o nome do aluno: ");
    const email = readline.question("Digite o email do aluno: ");
    const endereco = readline.question("Digite o endereço: ")
    const matricula = readline.question("Digite a matricula: ")
    const curso = readline.question("Digite o nome do curso: ")
    const serie = readline.question("Digite a serie: ") 

    const insert = "INSERT INTO alunos2 (nome, email, endereco, matricula, curso, serie) VALUES (?,?,?,?,?,?)";

    conexao.query(insert,[nome, email, endereco, matricula, curso, serie], function (erro){

        if (erro) {
            console.log("Erro ao cadastrar.");
            console.log(erro);
        } else {
            console.log("Aluno cadastrado com sucesso!");
        }
         menu();
    });  
}

// Função atualizar Aluno

function atualizarAluno(){
     
    // ID que será atualizado
    const id = readline.questionInt("Digite o ID do aluno que deseja atualizar: ");
        
        console.log(`\nAtualizando dados `);

        const nome = readline.question("Digite o nome do aluno: ");
        const email = readline.question("Digite o email do aluno: ");
        const endereco = readline.question("Digite o endereço: ")
        const matricula = readline.question("Digite a matricula: ")
        const curso = readline.question("Digite o nome do curso: ")
        const serie = readline.question("Digite a serie: ") 

        const update = `
            UPDATE alunos2
            SET nome = ?, email = ?, endereco = ?, matricula = ?, curso = ?, serie = ? 
            WHERE id = ?
        `;
        conexao.query(update, [nome, email, endereco, matricula, curso, serie, id], function (erro, resultado) {
        
            if (erro) {
                console.log("Erro ao atualizar o aluno.");
                console.log(erro);
            } else if (resultado.affectedRows === 0) {
                console.log("Aluno não encontrado.");
            } else {
                console.log("Aluno atualizado com sucesso!");
            }
        menu();
        });
}

// Função para excluir 

function excluirAluno() {

    const id = readline.questionInt("Digite o ID do aluno: ");
    
    const sql = "SELECT * FROM alunos2 WHERE id = ?";

    conexao.query(sql, [id], function (erro, alunos2) {

        if (erro) {
            console.log("Erro ao buscar aluno.");
            menu();
        } 
        else if (alunos2.length === 0) {
            console.log("Aluno não encontrado.");
            menu();
        } 
        else {

            console.log("\nRegistro encontrado:");
            console.log("Nome:", alunos2[0].nome);
            console.log("Email:", alunos2[0].email);

            const confirmar = readline.question("Deseja excluir? (S/N): ");

            if (confirmar === "S" || confirmar === "s") {

                const deletar ="DELETE FROM alunos2 WHERE id = ?";
                
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
            } else if (confirmar === "N" || confirmar === "n") {
                console.log("Exclusão cancelada.");
            menu();
            } else {
                console.log("Opção inválida.");
            menu();
            }
        }
    });
}



// Função para listar alunos
function listarAlunos() {
    const sql = "SELECT * FROM alunos2";

    conexao.query(sql, function (erro, alunos2){
        if (erro) {
            console.log("Erro ao buscar alunos.");
        } else {
            console.log("\n--- ALUNOS ---");
            alunos2.forEach(function (aluno){
                console.log(
                    aluno.id + " - " +
                    aluno.nome + " - " +
                    aluno.email + " - " +
                    aluno.endereco + " - " +
                    aluno.matricula + " - " +
                    aluno.curso + " - " + 
                    aluno.serie + " - "
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
    console.log("4 - Atualizar aluno");
    console.log("0 - Sair");

    const opcao = readline.questionInt("Escolha uma opcao: ");

    if (opcao === 1) {
        cadastrarAluno();
    } else if (opcao === 2) {
        excluirAluno();
    } else if (opcao === 3){
        listarAlunos();
    } else if (opcao === 4){
        atualizarAluno();
    }else if (opcao === 0) {
        console.log("Programa encerrado");
        conexao.end();
    } else {
        console.log("Opção invalida");
        menu();
    }
}

// Inicia o programa
menu();

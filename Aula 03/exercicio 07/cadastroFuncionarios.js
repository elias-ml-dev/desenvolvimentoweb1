const mysql = require("mysql2");
const readline = require("readline-sync")


// Conexão com o MySQL
const conexao = mysql.createConnection({
    host:"localhost",
    user: "root",
    password: "root",
    database: "empresa"    
});

//Função para cadastrar 
function cadastrarFuncionario() {

    const nome = readline.question("Digite o nome: ")
    const cargo = readline.question("Digite o cargo: ")

    const insert = "INSERT INTO funcionarios (nome, cargo) VALUES (?,?)";

    conexao.query(insert,[nome, cargo], function (erro){

        if (erro) {
            console.log("Erro ao cadastrar.");
            console.log(erro);
        } else {
            console.log("Funcionário cadastrado com sucesso!");
        }
         menu();
    });  
}


//Função atualizar
function atualizarFuncionario(){
     
    // ID que será atualizado
    const id = readline.questionInt("Digite o ID do funcionário que deseja atualizar: ");
        
        console.log(`\nAtualizando dados `);

        const nome = readline.question("Digite o nome: ")
        const cargo = readline.question("Digite o cargo: ")

        const update = `
            UPDATE funcionarios
            SET nome = ?, cargo = ? 
            WHERE id = ?
        `;
        conexao.query(update, [nome, cargo, id], function (erro, resultado) {
        
            if (erro) {
                console.log("Erro ao atualizar o funcionário.");
                console.log(erro);
            } else if (resultado.affectedRows === 0) {
                console.log("Funcionário não encontrado.");
            } else {
                console.log("Funcionário atualizado com sucesso!");
            }
        menu();
        });
}

// Função para excluir 

function excluirFuncionario() {

    const id = readline.questionInt("Digite o ID do FUNCIONÁRIO: ");
    const sql = "SELECT * FROM funcionarios WHERE id = ?";

    conexao.query(sql,[id], function(erro, funcionarios){
        if(erro){
            console.log("Erro ao buscar funcionários.");
            console.log(erro)
            menu();
        } else if(funcionarios.length === 0){
            console.log("Funcionário não encontrado. ");
            menu();
        } else{
            console.log("\nFuncionário encontrado: ");
            console.log("Nome: ", funcionarios[0].nome);
            console.log("Cargo: ", funcionarios[0].cargo);

            const confirmar = readline.question("Deseja realmente excluir este funcionário? (S/N) ");

            if(confirmar === "S" || confirmar === "s"){
                const deletar = "DELETE FROM funcionarios WHERE id = ?";
                conexao.query(deletar,[id],function(erro,resultado){
                    if(erro){
                        console.log("Erro ao excluir funcionário.");
                        console.log(erro)
                    } else if(resultado.affectedRows === 0){
                        console.log("Funcionário não encontrado. ")
                    } else {
                        console.log("Funcionário excluido com sucesso! ")
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
function listarFuncionario() {
    const sql = "SELECT * FROM funcionarios";

    conexao.query(sql, function (erro, funcionarios){
        if (erro) {
            console.log("Erro ao buscar funcionario.");
        } else {
            console.log("\n--- FUNCIONÁRIOS ---");
            funcionarios.forEach(function (funcionario){
                console.log(
                    funcionario.id + " - " +
                    funcionario.nome + " - " +
                    funcionario.cargo + " - " 
                );
            });
        }
        menu();
    });
}

// Menu principal
function menu() {

    console.log("\n===== FUNCIONÁRIOS =====");
    console.log("1 - Cadastrar funcionário");
    console.log("2 - Listar funcionários");
    console.log("3 - Excluir funcionário");
    console.log("4 - Atualizar funcionário");
    console.log("0 - Sair");

    const opcao = readline.questionInt("Escolha uma opcao: ");

    if (opcao === 1) {
        cadastrarFuncionario();
     } else if (opcao === 2){
        listarFuncionario();
    } else if (opcao === 3) {
        excluirFuncionario();
    } else if (opcao === 4) {
        atualizarFuncionario();
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
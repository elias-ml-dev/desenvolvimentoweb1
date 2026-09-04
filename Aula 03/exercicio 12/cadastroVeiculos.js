const mysql = require("mysql2");
const readline = require("readline-sync")


// Conexão com o MySQL
const conexao = mysql.createConnection({
    host:"localhost",
    user: "root",
    password: "root",
    database: "sistema_veiculos"    
});

//Função para cadastrar 
function cadastrarVeiculo() {

    const modelo = readline.question("Digite o modelo do veiculo: ");
    const placa = readline.question("Digite a placa do veiculo: ");
    

    const insert = "INSERT INTO veiculos (modelo, placa) VALUES (?,?)";

    conexao.query(insert,[modelo, placa], function (erro){

        if (erro) {
            console.log("Erro ao cadastrar.");
            console.log(erro);
        } else {
            console.log("Veículo cadastrado com sucesso!");
        }
         menu();
    });  
}

//Função atualizar
function atualizarVeiculo(){
     
    // ID que será atualizado
    const id = readline.questionInt("Digite o ID do veiculo que deseja atualizar: ");
        
        console.log(`\nAtualizando dados `);

        const modelo = readline.question("Digite o modelo do veiculo: ");
        const placa = readline.question("Digite a placa do veiculo: ");

        const update = `
            UPDATE veiculos
            SET modelo = ?, placa = ? 
            WHERE id = ?
        `;
        conexao.query(update, [modelo, placa, id], function (erro, resultado) {
        
            if (erro) {
                console.log("Erro ao atualizar o veiculo.");
                console.log(erro);
            } else if (resultado.affectedRows === 0) {
                console.log("Veículo não encontrado.");
            } else {
                console.log("Veículo atualizado com sucesso!");
            }
        menu();
        });
}

// Função para excluir 

function excluirVeiculo() {

    const id = readline.questionInt("Digite o ID do VEICULO: ");
    const sql = "SELECT * FROM veiculos WHERE id = ?";

    conexao.query(sql,[id], function(erro, veiculos){
        if(erro){
            console.log("Erro ao buscar veiculo.");
            console.log(erro)
            menu();
        } else if(veiculos.length === 0){
            console.log("Veiculo não encontrado. ");
            menu();
        } else{
            console.log("\nVeiculo encontrado: ");
            console.log("Modelo: ", veiculos[0].modelo);
            console.log("Placa: ", veiculos[0].placa);

            const confirmar = readline.question("Deseja realmente excluir este Veículos? (S/N) ");

            if(confirmar === "S" || confirmar === "s"){
                const deletar = "DELETE FROM veiculos WHERE id = ?";
                conexao.query(deletar,[id],function(erro,resultado){
                    if(erro){
                        console.log("Erro ao excluir Veiculo.");
                        console.log(erro)
                    } else if(resultado.affectedRows === 0){
                        console.log("Veiculo não encontrado. ")
                    } else {
                        console.log("Veiculo excluido com sucesso! ")
                    }
                    menu();
                });
            } else if(confirmar === "N" || confirmar === "n"){
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
function listarVeiculo() {
    const sql = "SELECT * FROM veiculos";

    conexao.query(sql, function (erro, veiculos){
        if (erro) {
            console.log("Erro ao buscar veículos.");
        }else if (veiculos.length === 0) {
            console.log("\nNenhum veículo cadastrado.");
        }else {
            console.log("\n--- VEÍCULOS ---");
            veiculos.forEach(function (veiculo){
                console.log(
                    veiculo.id + " - " +
                    veiculo.modelo + " - " +
                    veiculo.placa + " - " 
                );
            });
        }
        menu();
    });
}

// Menu principal
function menu() {

    console.log("\n===== MENU =====");
    console.log("1 - Cadastrar veículo");
    console.log("2 - Listar veículos");
    console.log("3 - Excluir veículo");
    console.log("4 - Atualizar veículo");
    console.log("0 - Sair");

    const opcao = readline.questionInt("Escolha uma opcao: ");

    if (opcao === 1) {
        cadastrarVeiculo();
    } else if (opcao === 2) {
        listarVeiculo();
    } else if (opcao === 3){
        excluirVeiculo();
    } else if (opcao === 4){
        atualizarVeiculo();
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

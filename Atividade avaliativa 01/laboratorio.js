const mysql = require("mysql2");
const readline = require("readline-sync");

const conexao = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "root",
    database: "laboratorio_avaliacao"
});

function cadastrarComputador(){
    
    const patrimonio = readline.question("Digite o patrimonio: ");
    const localizacao = readline.question("Digite a localização: ");
    const responsavel = readline.question("Digite o nome do responsável: ");
    const situacao = readline.question("Digite a situacao: ");

    const insert = "INSERT INTO computadores (patrimonio, localizacao, responsavel, situacao) VALUES (?,?,?,?)";

    conexao.query(insert, [patrimonio, localizacao, responsavel, situacao], function(erro){
        if(erro){
            console.log("Erro ao cadastrar computador.");
            console.log(erro);
        } else{
            console.log("Computador cadastrado com sucesso!");
        }
        menu();
    });
}

function listarComputador(){
    const sql = "SELECT * FROM computadores";

    conexao.query(sql, function(erro, computadores){
        if(erro){
            console.log("Erro ao buscar computadores");
            console.log(erro);
        } else if(computadores.length === 0){
            console.log("Nenhum computador cadastrado. ");
        } else{
            console.log("\n==== COMPUTADORES CADASTRADOS ====");
            computadores.forEach(function(computador){
                console.log(
                    computador.id + " - " +
                    computador.patrimonio + " - " +
                    computador.localizacao + " - " +
                    computador.responsavel + " - " +
                    computador.situacao
                );
            });
        }
        menu();
    });
}

function atualizarComputador(){ 
    const id = readline.questionInt("Digite o ID do computador que deseja atualizar: "); 

    const sql = "SELECT * FROM computadores WHERE id = ?"; 

    conexao.query(sql, [id], function(erro, computadores){ 
        if(erro){ 
            console.log("Erro ao buscar computador."); 
            console.log(erro); 
            menu(); 
        } else if(computadores.length === 0){ 
            console.log("Computador não encontrado."); 
            menu(); 
        } else{ 
            console.log("\nComputador encontrado:"); 
            console.log("Patrimonio: " + computadores[0].patrimonio); 
            console.log("Localização: " + computadores[0].localizacao); 
            console.log("Responsável: " + computadores[0].responsavel); 
            console.log("Situação: " + computadores[0].situacao); 

            const patrimonio = readline.question("Digite o patrimonio: "); 
            const localizacao = readline.question("Digite a localização: "); 
            const responsavel = readline.question("Digite o nome do responsável: "); 
            const situacao = readline.question("Digite a situacao: "); 

            const update = `UPDATE computadores 
            SET patrimonio = ?, localizacao = ?, responsavel = ?, situacao = ? 
            WHERE id = ?`; 

            conexao.query(update, [patrimonio, localizacao, responsavel, situacao, id], function(erro, resultado){ 
                if(erro){ 
                    console.log("Erro ao atualizar computador."); 
                    console.log(erro); 
                } else if(resultado.affectedRows === 0){ 
                    console.log("Computador não encontrado."); 
                } else{ 
                    console.log("Computador atualizado com sucesso!"); 
                } 

                menu(); 
            }); 
        } 
    }); 
}


function excluirComputador(){
    const id = readline.questionInt("Digite o ID do computador que deseja excluir: ");

    const sql = "SELECT * FROM computadores WHERE id = ?";

    conexao.query(sql, [id], function(erro, computadores){
        if(erro){
            console.log("Erro ao buscar computador.");
            console.log(erro);
            menu();
        } else if(computadores.length === 0){
            console.log("Computador não encontrado.");
            menu();
        } else{
            console.log("\nComputador encontrado:");
            console.log("Patrimonio: " + computadores[0].patrimonio);
            console.log("Localização: " + computadores[0].localizacao);
            console.log("Responsável: " + computadores[0].responsavel);
            console.log("Situação: " + computadores[0].situacao);

            const confirmar = readline.question("Deseja realmente excluir? (S/N): ");
            
            if(confirmar === "S" || confirmar === "s"){
                
                const deletar = "DELETE FROM computadores WHERE id = ?";

                conexao.query(deletar, [id], function(erro, resultado){
                    if(erro){
                        console.log("Erro ao excluir computador.");
                        console.log(erro);
                    } else if(resultado.affectedRows === 0){
                        console.log("Computador não encontrado.");
                    } else{
                        console.log("Computador excluido com sucesso!");
                    }
                    menu();
                });

            } else if(confirmar === "N" || confirmar === "n"){
                console.log("Exclusão cancelada.");
                menu();
            } else{
                console.log("Opção inválida.");
                menu();
            }
        }
    });
}

function menu(){
    console.log("\n==== CONTROLE DE LABORATÓRIO ====");
    console.log("1 - Cadastrar computador.");
    console.log("2 - Listar computadores.");
    console.log("3 - Atualizar computador.");
    console.log("4 - Excluir computador.");
    console.log("0 - Sair.");

    const opcao = readline.questionInt("Escolha uma opção: ");

    if(opcao === 1){
        cadastrarComputador();
    } else if(opcao === 2){
        listarComputador();
    } else if(opcao === 3){
        atualizarComputador();
    } else if(opcao === 4){
        excluirComputador();
    } else if(opcao === 0){
        console.log("Encerrando o sistema...");
        conexao.end();
    } else{
        console.log("Opção inválida.");
        menu();
    }
}

menu();


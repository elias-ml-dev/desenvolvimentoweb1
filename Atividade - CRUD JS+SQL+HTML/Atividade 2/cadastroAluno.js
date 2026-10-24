const mysql = require('mysql2');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.urlencoded({extended: false}));

app.listen(8083, function(){
    console.log("Servidor rodando na url http://localhost:8083");
});

const connection = mysql.createConnection({
    host:'localhost',
    user: 'root',
    password: 'root',
    database: 'crud_alunos'
});

// TESTANDO A CONEXÃO.
function consultarBanco(){
    sql = "SELECT * FROM alunos";

    connection.query(sql,function(err, alunos){
        if(err){
            console.error("Erro listar dados. " + err);
        }else{
            console.log("\n==== ALUNOS ====")
            alunos.forEach(function (aluno){
                console.log(
                    aluno.id + " - " +
                    aluno.nome + " - " +
                    aluno.turma + " - " +
                    aluno.idade + " - " +
                    aluno.email
                );
            });
        }
    });
}
consultarBanco();


app.get("/", function(req,res){
    res.sendFile(__dirname + "/index.html");
});

app.get("/adicionar", function(req,res){
    res.sendFile(__dirname + "/cadastroAluno.html");
});

app.post("/adicionar", function(req, res){
    const nome = req.body.nome;
    const turma = req.body.turma;
    const idade = req.body.idade;
    const email = req.body.email;

    if(!nome || turma === "" || idade === "" || email === ""){
        return res.send("Erro: Existem dados faltando! Preencha todos os campos. <br><br> <a href='/adicionar'>Voltar</a> ");
    }
    if(idade <= 0){
        return res.send("Erro: Idade inválida! Favor insira uma idade real. <br><br> <a href='/adicionar'>Voltar</a>");
    }

    const values = [nome, turma, idade, email];
    const insert = "INSERT INTO alunos (nome, turma, idade, email) VALUES (?,?,?,?)";
    
    connection.query(insert,values, function(err, result){
        if(err){
            console.error("Dados não inseridos", err);
            res.send("Erro");
        }else{
            console.log("Dados inseridos com sucesso!");
            res.redirect("/listar");
        }
    });
});

app.get("/listar", function(req, res){
    const selectAll = "SELECT * FROM alunos";

    connection.query(selectAll, function(err,rows){
        if(!err){
            res.send(`
                <html>
                <head>
                    <title> Lista de alunos </title>
                </head>
                <body>
                    <h1> Lista de alunos</h1>
                    <table>
                    <tr>
                        <th>ID</th>
                        <th>Nome</th>
                        <th>Turma</th>
                        <th>Idade</th>
                        <th>Email</th>
                    </tr>
                    ${rows.map(row=>`
                    <tr>
                        <td>${row.id}</td>
                        <td>${row.nome}</td>
                        <td>${row.turma}</td>
                        <td>${row.idade}</td>
                        <td>${row.email}</td>
                        <td><a href="/deletar/${row.id}">Deletar</a></td>
                        <td><a href="/atualizar-form/${row.id}">Alterar</a></td>

                        </tr>`).join('')}
                </table>
                <br><br>
                        <a href="/">Inicio</a> 
                </body>

            </html>`);
        }else{
            console.error("Erro ao listar os produtos", err);
            res.status(500).send("Erro ao listar os alunos");
        }
    });
});

app.get("/pesquisar", function(req, res){
    res.sendFile(__dirname + "/pesquisarAluno.html");
});

app.post("/pesquisar", function(req, res){
    
    const id = req.body.id;
    const sql = "SELECT * FROM alunos WHERE id = ?";

    connection.query(sql,[id],function(err,result){
        if(err){
            console.error("Erro ao encontrar aluno", err);
            res.status(500).send("Erro no servidor. ");
        }else if(result.length === 0){
            res.send(`<h2>Aluno não encontrado</h2>
                     <a href="/">Voltar</a>`);
        }else{
            const aluno = result[0];
            res.send(`
                <h2>Dados do Aluno</h2>
                <p><strong>ID:</strong> ${aluno.id}</p>
                <p><strong>Nome:</strong> ${aluno.nome}</p>
                <p><strong>Turma:</strong> ${aluno.turma}</p>
                <p><strong>Idade:</strong> ${aluno.idade}</p>
                <p><strong>Email:</strong> ${aluno.email}</p>
                <br>
                <a href="/">Voltar</a>
            `);
        }
    });
});

// atualizar no listar
app.get("/atualizar-form/:id", function(req,res){
    const id = req.params.id;
    const selectAluno= "SELECT * FROM alunos WHERE id=?"

    connection.query(selectAluno, [id], function(err, result){
        if(!err && result.length > 0){
            const aluno = result[0];

            res.send(`
                <!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Atualizar Aluno</title>
</head>
<body>
    <h1>Atualizar Cadastro de Alunos</h1>

    <form action="/atualizar/${id}" method="POST">
        <label for="nome"> Nome do Aluno</label> <br>
        <input type="text" id="nome" name="nome" value="${aluno.nome}"required> <br>
        <br>
        <label for="quantidade"> Turma</label> <br>
        <input type="text" id="turma" name="turma" value="${aluno.turma}"required> <br>
        <br>
        <label for="preco"> Idade</label> <br>
        <input type="number" id="idade" name="idade" value="${aluno.idade}" required> <br>
        <br>
        <label for="email">Email</label> <br>
        <input type="email" id="email" name="email" value="${aluno.email}" required> <br><br>
        <input type="submit">
        <br>
        <a href="/listar">Listar alunos</a>

    </form>
</body>
</html>`)
        } else {
            console.log("Erro ao obter dados do aluno", err);
            res.status(500).send("Erro ao obter dados do aluno");
        }
    });
});

app.post("/atualizar/:id", (req,res) => {

    const update = "UPDATE alunos SET nome = ?, turma = ?, idade = ?, email = ? WHERE id =?";
    const nome = req.body.nome;    
    const turma = req.body.turma;
    const idade = req.body.idade;
    const email = req.body.email;
    const id = req.params.id;
    
    connection.query(update, [nome, turma, idade, email, id], 
    function(err, result){
        if(!err){
            console.log("Dados Atualizados com Sucesso!");
            res.send(`<h2>Dados atualizados com sucesso! </h2>
                          <a href="/">Inicio</a>`);
        } else {
            console.log("Erro ao atualizar ", err);
            res.status(500).send("Erro ao atualizar!");
        }
    });
});

// atualizando pelo menu inicial
app.get("/atualizar", function(req, res){
    res.sendFile(__dirname + "/atualizar.html");
});

app.post("/atualizar", (req,res) => {

    const update = "UPDATE alunos SET nome = ?, turma = ?, idade = ?, email = ? WHERE id =?";
    const nome = req.body.nome;    
    const turma = req.body.turma;
    const idade = req.body.idade;
    const email = req.body.email;
    const id = req.body.id;
    
    connection.query(update,[nome,turma, idade, email,id], function(err, result){
        if (err) {
        console.error("Erro ao atualizar:", err);
        return res.status(500).send("Erro ao atualizar!");
        }

        if (result.affectedRows > 0) {
            console.log("Dados atualizados com sucesso!");
           res.send(`<h2>Dados atualizados com sucesso! </h2>
                          <a href="/">Inicio</a>`);
        } else {
            return res.status(404).send(`<h2>Aluno não encontrado </h2>
                                          <a href="/atualizar">Voltar</a>`);
        }
    });
});

// deletar no listar
app.get("/deletar/:id", function(req,res){
    const idDoAluno = req.params.id;
    const deleteAluno = "DELETE FROM alunos WHERE id = ?";

    connection.query(deleteAluno, [idDoAluno], function(err, rows){
        if(!err){
            console.log("Aluno excluído com sucesso!");
            res.redirect("/listar");
        } else {
            console.error("Erro ao excluir aluno", err);
            res.status(500).send("Erro ao excluir aluno!");
        }
    });
});

// deletar aluno pelo menu inicial
app.get("/deletar", function(req, res){
    res.sendFile(__dirname + "/deletar.html");
});

app.post("/deletar", function(req, res){
    
    const id = req.body.id;
    const sql = "SELECT * FROM alunos WHERE id = ?";

    connection.query(sql,[id],function(err,result){
        if(err){
            console.error("Erro ao encontrar aluno", err);
            res.status(500).send("Erro no servidor. ");
        }else if(result.affectedRows === 0){
            res.send(`<h2>Aluno não encontrado</h2>
                     <a href="/">Voltar</a>`);
        }else{
            const aluno = result[0];
            res.send(`
                <h2>Dados do Aluno</h2>
                <p><strong>ID:</strong> ${aluno.id}</p>
                <p><strong>Nome:</strong> ${aluno.nome}</p>
                <p><strong>Turma:</strong> ${aluno.turma}</p>
                <p><strong>Idade:</strong> ${aluno.idade}</p>
                <p><strong>Email:</strong> ${aluno.email}</p>
                <br>
                <h2>Deseja realmente excluir este aluno? <h2>
                <form action="/confirmaDeletar" method="POST">
                <input type="hidden" name="id" value="${aluno.id}">
                <button type="submit">Confirmar exclusão</button>
                <a href="/">Cancelar</a>
                </form>
            `);
        }
    });
});

app.post("/confirmaDeletar", function(req,res){
    const id = req.body.id;
    const deleteAluno = "DELETE FROM alunos WHERE id = ?";

    connection.query(deleteAluno, [id], function(err, result){
        if(err){
            console.error("Erro ao excluir aluno", err);
            res.status(500).send("Erro ao excluir aluno!");
        }else if(result.length === 0){
            res.send(`
                <h2>Aluno não encontrado para a exclusão.</h2>
                <a href="/">Voltar ao início</a>
            `);
        }else{
            console.log("Aluno excluído com sucesso!");
            res.send(`
                <h2>Aluno excluído com sucesso!"</h2>
                <a href="/">Voltar ao inicio</a>
            `);
        }
            
    });
});
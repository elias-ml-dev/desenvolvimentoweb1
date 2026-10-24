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
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'crud_produtos'
});

// TESTANDO A CONEXÃO.
/*function consultarBanco(){
    sql = "SELECT * FROM produtos";

    connection.query(sql,function(err, produtos){
        if(err){
            console.error("Erro listar dados. " + err);
        }else{
            console.log("\n==== PRODUTOS ====")
            produtos.forEach(function (produto){
                console.log(
                    produto.id + " - " +
                    produto.nome + " - " +
                    produto.quantidade + " - " +
                    produto.preco
                );
            });
        }
    });
}
consultarBanco();*/

app.get("/", function(req, res){
    res.sendFile(__dirname + "/index.html");
});


app.get("/adicionar", function(req, res){
    res.sendFile(__dirname + "/cadastro.html");
});

app.post("/adicionar", function(req,res){
    const nome = req.body.nome;
    const quantidade = req.body.quantidade;
    const preco = req.body.preco;

    if(!nome || req.body.quantidade === "" || req.body.preco === ""){
        return res.send("Erro: Existem dados faltando! Preencha todos os campos. <br><br> <a href='/adicionar'>Voltar</a> ");
    }
    if(quantidade < 0){
        return res.send("Erro: Quantidade inválida! Não é permitido cadastrar uma quantidade negativa. <br><br> <a href='/adicionar'>Voltar</a>");
    }
    if(preco <= 0){
        return res.send("Erro: Preço inválido! O preço não pode ser igual ou menor que zero. <br><br> <a href='/adicionar'>Voltar</a>");
    }

    const values = [nome, quantidade, preco];
    const insert = "INSERT INTO produtos (nome, quantidade, preco) VALUES(?,?,?)";
    connection.query(insert,values,function(err,result){
        if(err){
            console.error("Dados não inseridos", err);
            res.send("Erro");
        }else{
            console.log("Dados inseridos com sucesso!");
            res.redirect("/listar");
        }
    });
});

app.get("/listar", function(req,res){
    const selectAll = "SELECT * FROM produtos";

    connection.query(selectAll, function(err,rows){
        if(!err){
            res.send(`<html>
                <head>
                    <title> Lista de produtos </title>  
                </head>
                <body>
                    <h1> Lista de produtos</h1>
                    <table>
                    <tr>
                        <th>ID</th>
                        <th>Nome</th>
                        <th>Quantidade</th>
                        <th>Preço</th>
                    </tr>
                    ${rows.map(row=>`
                    <tr>
                        <td>${row.id}</td>
                        <td>${row.nome}</td>
                        <td>${row.quantidade}</td>
                        <td>${row.preco}</td>
                        <td><a href="/deletar/${row.id}">Deletar</a></td>
                        <td><a href="/atualizar-form/${row.id}">Alterar</a></td>

                        </tr>`).join('')}
                </table>
                <br><br>
                        <a href="/">Inicio</a> 
                        <a href="/pesquisar">Pesquisar produto pelo código: </a>
                </body>

            </html>`)
        }else{
            console.error("Erro ao listar os produtos", err);
            res.status(500).send("Erro ao listar os dados");
        }
    });
});

// Pesquisar produto
app.get("/pesquisar", function(req, res){
    res.sendFile(__dirname + "/pesquisarProduto.html"); 
});
app.post("/pesquisar", function(req,res){
    
    const id = req.body.id;
    const sql = "SELECT * FROM produtos WHERE id = ?"

    connection.query(sql,[id],function(err,result){
        if(err){
            console.error("Erro ao encontrar Produto.", err);
            res.status(500).send("Erro no servidor. ");    
        }else if(result.length === 0){
            res.send(`<h2>Produto não encontrado. </h2>
                      <a href="/">Inicio</a>  
                <`)
        }else{
            const produto = result[0]; 
            res.send(`
                <h2>Dados do Produto</h2>
                <p><strong>ID:</strong> ${produto.id}</p>
                <p><strong>Nome:</strong> ${produto.nome}</p>
                <p><strong>Quantidade:</strong> ${produto.quantidade}</p>
                <p><strong>Preço:</strong> ${produto.preco}</p>
                <br>
                <a href="/">Voltar</a>
            `);
        }
    });
});

//atualizar pelo listar

app.get("/atualizar-form/:id", function(req,res){
    const id = req.params.id;
    const selectProduto= ("SELECT * FROM produtos WHERE id=?")

    connection.query(selectProduto, [id], function(err, result){
        if(!err && result.length >0){
            const produto = result[0];

            res.send(`
                <!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Atualizar Cadastro de Produtos</title>
</head>
<body>
    <h1>Atualizar Cadastro de Produtos</h1>

    <form action="/atualizar/${id}" method="POST">
        <label for="nome"> Nome do Produto</label> <br>
        <input type="text" id="nome" name="nome" required value="${produto.nome}"> <br>
        <br>
         <label for="quantidade"> Quantidade</label> <br>
        <input type="number" id="quantidade" name="quantidade" required value="${produto.quantidade}"> <br>
        <br>
         <label for="preco"> Preço</label> <br>
        <input type="number" id="preco" name="preco" required value="${produto.preco}"> <br>
        <input type="submit">
        <br>
        <a href="/listar">Listar produtos</a>

    </form>
</body>
</html>`)
        } else {
            console.log("Erro ao obter dados do produto", err);
            res.status(500).send("Erro ao obter dados do produto");
        }
    });
});

app.post("/atualizar/:id", (req,res) => {

    const update = "UPDATE produtos SET nome = ?, preco = ?, quantidade=? WHERE id =?";
    const nome = req.body.nome;
    const preco = req.body.preco;
    const quantidade = req.body.quantidade;
    const id = req.params.id;
    
    connection.query(update, [nome, preco, quantidade, id], 
        function(err, result){
            if(!err){
                console.log("Dados Atualizados com Sucesso!");
                res.send(`<h2>Dados atualizados com sucesso! </h2>
                          <a href="/">Inicio</a>`);
            } else {
                console.log("Erro ao atualizar ", err);
                res.status(500).send(`<h2>Erro ao atualizar produto! </h2>
                                      <a href="/">Inicio</a>`);
            }
        });
});

//atualizar pelo menu inicial
app.get("/atualizar-form", function(req, res){
    res.sendFile(__dirname + "/atualizarProduto.html");
});

app.post("/atualizar", (req,res) => {

    const update = "UPDATE produtos SET nome = ?, preco = ?, quantidade=? WHERE id =?";
    const nome = req.body.nome;
    const preco = req.body.preco;
    const quantidade = req.body.quantidade;
    const id = req.body.id;
    
    connection.query(update,[nome,preco, quantidade,id], function(err, result){
        if (err) {
        console.error("Erro ao atualizar:", err);
        return res.status(500).send("Erro ao atualizar!");
        }

        if (result.affectedRows > 0) {
            console.log("Dados atualizados com sucesso!");
           res.send(`<h2>Dados atualizados com sucesso! </h2>
                          <a href="/">Inicio</a>
                          <button> <a href="/listar">Listar Produtos</a> </button>`);
        } else {
            return res.status(404).send(`<h2>Produto não encontrado </h2>
                                          <button> <a href="/atualizar-form">Voltar</a> </button>
                                          <button> <a href="/"> Inicio </a> </button>`);
        }
    });
});

// deletar no listar
app.get("/deletar/:id", function(req, res){
    const idDoProduto = req.params.id;
    const deleteProduto = "DELETE FROM produtos WHERE id = ?";

    connection.query(deleteProduto, [idDoProduto], function(err, rows){
        if(!err){
            console.log("Produto excluído com sucesso pelo listar!");
            res.redirect("/listar");
        } else {
            console.error("Erro ao excluir produto", err);
            res.status(500).send("Erro ao excluir produto!");
        }
    });
});


// deletar produto no menu inicial
app.get("/deletar-form", function(req, res){
    res.sendFile(__dirname + "/deletarProduto.html");
});


app.post("/deletarProduto", function(req, res){
    const id = req.body.id;
    const deleteProduto = "SELECT * FROM produtos WHERE id = ?";

    connection.query(deleteProduto, [id], function(err, result){
        if(err){
            console.error("Erro ao encontrar produto", err);
            res.status(500).send("Erro no servidor. ");
        }else if(result.length === 0){
            res.send(`<h2>Produto não encontrado</h2>
                      <button> <a href="/">Voltar</a> </button>`);
        }else{
            const produto = result[0];
            res.send(`
                <h2>Dados do Produto</h2>
                <p><strong>ID:</strong> ${produto.id}</p>
                <p><strong>Nome:</strong> ${produto.nome}</p>
                <p><strong>Quantidade:</strong> ${produto.quantidade}</p>
                <p><strong>Preço:</strong> ${produto.preco}</p>
                <br>
                <h2>Deseja realmente excluir este produto? <h2>
                <form action="/confirmaDeletar" method="POST">
                <input type="hidden" name="id" value="${produto.id}">
                <button type="submit">Confirmar exclusão</button>
                <a href="/">Cancelar</a>
                </form>
            `);
        }
    });
});

app.post("/confirmaDeletar", function(req, res){
    const id = req.body.id;
    const deleteProduto = "DELETE FROM produtos WHERE id = ?";

    connection.query(deleteProduto,[id], function(err, result){
        if(err){
            console.error("Erro ao excluir produto", err);
            res.status(500).send("Erro ao excluir produto. ");
        }else if(result.length === 0){
            res.send(`
                <h2>Produto não encontrado para a exclusão.</h2>
                <a href="/">Voltar ao inicio</a>
            `);
        }else{
            console.log("Produto excluído com sucesso!");
            res.send(`
                <h2>Produto excluído com sucesso!"</h2>
                <a href="/">Voltar ao inicio</a>
            `);
        }
    });
});



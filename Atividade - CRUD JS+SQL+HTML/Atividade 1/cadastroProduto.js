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
                    <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f4f7f6;
                        color: #333;
                        margin: 0;
                        padding: 40px 20px;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                    }

                    h1 {
                        color: #2c3e50;
                        margin-bottom: 25px;
                    }

                    table {
                        background-color: #ffffff;
                        border-collapse: collapse;
                        width: 100%;
                        max-width: 700px;
                        border-radius: 8px;
                        overflow: hidden;
                        box-shadow: 0 4px 10px rgba(0,0,0,0.08);
                        margin-bottom: 20px;
                    }

                    th, td {
                        padding: 12px 15px;
                        text-align: left;
                        border-bottom: 1px solid #eee;
                    }

                    th {
                        background-color: #2c3e50;
                        color: white;
                        font-weight: bold;
                    }

                    tr:hover {
                        background-color: #f9f9f9;
                    }

                    td a {
                        text-decoration: none;
                        font-weight: bold;
                        padding: 6px 10px;
                        border-radius: 4px;
                        font-size: 13px;
                    }

                    td a[href*="deletar"] {
                        background-color: #ffebee;
                        color: #e74c3c;
                    }
                    td a[href*="deletar"]:hover {
                        background-color: #e74c3c;
                        color: white;
                    }

                    td a[href*="atualizar-form"] {
                        background-color: #e3f2fd;
                        color: #2980b9;
                    }
                    td a[href*="atualizar-form"]:hover {
                        background-color: #2980b9;
                        color: white;
                    }

                    /* Bloco único e correto para manter os links lado a lado */
                    .links-uteis {
                        margin-top: 20px;
                        text-align: center;
                        white-space: nowrap;
                    }

                    .links-uteis a {
                        color: #2980b9;
                        text-decoration: none;
                        font-weight: bold;
                        display: inline-block;
                        margin: 0 10px;
                    }

                    .links-uteis a:hover {
                        text-decoration: underline;
                    }
                </style>    
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
                        <td><a href="/atualizar-form?id=${row.id}">Alterar</a></td>

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
            res.send("Produto não encontrado. ")
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


app.post("/atualizar/:id",(req,res) => {
    const update = "UPDATE produtos SET nome = ?, quantidade = ?, preco = ? WHERE id = ?";

    const nome = req.body.nome;
    const quantidade = req.body.quantidade;
    const preco = req.body.preco;
    const id = req.params.id;

    connection.query(update,[nome, quantidade, preco, id], function(err, result){
        if (err) {
        console.error("Erro ao atualizar:", err);
        return res.status(500).send("Erro ao atualizar!");
        }

        if (result.affectedRows > 0) {
            console.log("Dados atualizados com sucesso!");
            return res.send(`
                <script>
                    alert("Produto atualizado com sucesso!");
                    window.location.href = "/listar";
                </script>
            `);
        } else {
            return res.status(404).send("Produto não encontrado!");
        }
    });
});

app.get("/atualizar-form", function(req, res) {
    res.sendFile(__dirname + "/atualizarProduto.html");
});


app.get("/deletar-form", function(req, res){
    res.sendFile(__dirname + "/deletarProduto.html");
});


app.post("/deletarProduto", function(req, res){
    const id = req.body.id;
    const deleteProduto = "DELETE FROM produtos WHERE id = ?";

    connection.query(deleteProduto, [id], function(err, result){
        if(err){
            console.error("Erro ao excluir produto", err);
            res.status(500).send("Erro ao excluir o produto!");
        } else {
            if(result.affectedRows === 0){
                res.send("Nenhum produto encontrado com este código para excluir. <br><br> <a href='/deletar-form'>Tentar novamente</a>");
            } else {
                console.log("Produto excluído com sucesso via formulário!");
                res.redirect("/listar");
            }
        }
    });
});


app.get("/deletar/:id", function(req, res){
    const idDoProduto = req.params.id;
    const deleteProduto = "DELETE FROM produtos WHERE id = ?";

    connection.query(deleteProduto, [idDoProduto], function(err, rows){
        if(!err){
            console.log("Produto excluído com sucesso via tabela!");
            res.redirect("/listar");
        } else {
            console.error("Erro ao excluir produto", err);
            res.status(500).send("Erro ao excluir produto!");
        }
    });
});
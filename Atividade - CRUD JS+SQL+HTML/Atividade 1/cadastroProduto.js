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

app.get("/", function(req,res){
    res.sendFile(__dirname + "/cadastro.html");
});

app.post("/adicionar", function(req,res){
    const nome = req.body.nome;
    const quantidade = req.body.quantidade;
    const preco = req.body.preco;

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
})

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
                        <td><a href="/atualizar-form">Alterar</a></td>

                        </tr>`).join('')}
                </table>
                <br><br>
                        <a href="/">Cadastrar novo produto</a>
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
            return res.send("Produto atualizado com sucesso!");
        } else {
            return res.status(404).send("Produto não encontrado!");
        }
    });
});

app.get("/atualizar-form", function(req, res) {
    res.sendFile(__dirname + "/atualizarProduto.html");
});
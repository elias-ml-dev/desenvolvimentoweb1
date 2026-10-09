const mysql = require('mysql2');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'crud'
});

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.urlencoded({extended: false}));

app.listen(8083, function(){
    console.log
    ("servidor rodando na url http://localhost:8083");
});

app.get("/" , function (req,res){
    res.sendFile(__dirname+"/cadProduto.html");
});

app.post("/adicionar", function(req, res){
    const nome = req.body.nome;
    const preco = req.body.preco;
    const quantidade = req.body.quantidade;
   
    const values = [nome, quantidade, preco];
    const insert =
    "INSERT INTO produtos (nome, quantidade, preco)  VALUES(?,?,?)";

    connection.query(insert,values,function(err,result){
        if(err){
            console.error("Dados não inseridos", err);
            res.send("Erro")
        }else {
            console.log("Dados inseridos com sucesso! ");
            res.redirect("/listar");
        }
    });
});

app.get("/listar", function(req,res){
    const selectAll = "SELECT * FROM produtos";

    connection.query(selectAll, function(err, rows){
        if(!err){
            res.send(`<html>
                    <head>
                        <title> Lista de produtos </title>
                    </head>
                    <body>
                        <h1> Lista de produtos</h1>
                        <table>
                        <tr>
                            <th>Nome</th>
                            <th>Quantidade</th>
                            <th>Preço</th>
                        </tr>
                        ${rows.map(row=>`
                        <tr>
                            <td>${row.nome}</td>
                            <td>${row.quantidade}</td>
                            <td>${row.preco}</td>
                            <td><a href="/deletar/${row.id}">Deletar</a></td>
                            <td><a href="/atualizar-form/${row.id}">Alterar</a></td>
 
                            </tr>`).join('')}
                    </table>
                    <br><br>
                         <a href="/">Cadastrar novo produto</a>
                    </body>
 
                </html>`)
        }else{
            console.error("Erro ao listar os produtos", err);
            res.status(500).send("Erro ao listar os dados");
        }
    });
});
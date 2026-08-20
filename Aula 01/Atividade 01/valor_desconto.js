/*8. Valor com desconto
Crie uma função chamada calcularDesconto que receba o preço de um produto e o valor do desconto em porcentagem. A função deve mostrar o preço final.

Exemplo: um produto de R$ 100,00 com 10% de desconto custa R$ 90,00.*/

function calcularDesconto(preco, valorDesconto){
    var desconto = preco * (valorDesconto/100)
    var precoFinal = preco - desconto
    console.log(precoFinal)
}

var preco = 250
var valorDesconto = 10

calcularDesconto(preco,valorDesconto)
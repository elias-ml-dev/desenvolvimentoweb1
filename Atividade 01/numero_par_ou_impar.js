/*10. Número par ou ímpar
Crie uma função chamada verificarNumero que receba um número e informe se ele é par ou ímpar.

Dica: utilize o operador % para verificar o resto da divisão por 2.*/

function  verificarNumero(n1){
    if (n1%2 === 0){
       console.log("Número Par: ", n1)
    } else{
        console.log("Número Ímpar: ", n1)
    }
}

var n1 = 15

verificarNumero(n1)
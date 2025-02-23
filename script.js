let valorFipe = null;
let estadoCep = null;

async function buscarCep() {
    const cep = document.getElementById("cep-input").value;
    const cepResult = document.getElementById("cep-result");

    if (cep.length !== 8 || isNaN(cep)) {
        cepResult.innerHTML = "CEP inválido! Insira um CEP com 8 dígitos numéricos.";
        return;
    }

    try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();

        if (data.erro) {
            cepResult.innerHTML = "CEP não encontrado!";
        } else {
            estadoCep = data.uf; 
            cepResult.innerHTML = `
                <strong>Endereço:</strong> ${data.logradouro}<br>
                <strong>Bairro:</strong> ${data.bairro}<br>
                <strong>Cidade:</strong> ${data.localidade} - ${data.uf}<br>
                <strong>CEP:</strong> ${data.cep}
            `;
        }
    } catch (error) {
        cepResult.innerHTML = "Erro ao buscar o endereço.";
    }
}

async function buscarFipePorCodigo() {
    const fipeCode = document.getElementById("fipe-code-input").value;
    const fipeResult = document.getElementById("fipe-result");

    if (!fipeCode) {
        fipeResult.innerHTML = "Digite um código FIPE!";
        return;
    }

    try {
        const response = await fetch(`https://brasilapi.com.br/api/fipe/preco/v1/${fipeCode}`);
        const data = await response.json();

        if (data && data[0]) {  
            valorFipe = parseFloat(data[0].valor.replace("R$", "").replace(".", "").replace(",", "."));  // Armazena o valor em formato numérico
            fipeResult.innerHTML = `Modelo: ${data[0].modelo} - Valor: R$ ${data[0].valor}`;
        } else {
            fipeResult.innerHTML = "Código FIPE não encontrado!";
        }
    } catch (error) {
        fipeResult.innerHTML = "Erro ao buscar o valor FIPE.";
    }
}

function simularSeguro() {
    const seguroResult = document.getElementById("seguro-result");

    if (valorFipe === null || estadoCep === null) {
        seguroResult.innerHTML = "Primeiro, consulte o valor FIPE e o CEP!";
        return;
    }

    if (valorFipe >= 30000 && estadoCep === "RJ") {
        seguroResult.innerHTML = "<strong>Seguro aprovado!</strong> O veículo está apto para receber o seguro.";
    } else {
        seguroResult.innerHTML = "<strong>Seguro negado!</strong> O veículo não atende aos requisitos para o seguro.";
    }
}

class Sistema {
    constructor() {

        this.lista = JSON.parse(localStorage.getItem('meusGastos')) || [];
        this.limite = parseFloat(localStorage.getItem('meuLimite')) || 0;

    }

    adicionar(desc, valor, cat, data) {
        let gasto = {
            descricao: desc,
            valor: valor,
            categoria: cat,
            data: data
        };

        this.lista.push(gasto);
        this.atualizar();
    }

    remover(posicao) {
        this.lista.splice(posicao, 1);
        this.atualizar();
    }

    atualizar() {

        localStorage.setItem('meusGastos', JSON.stringify(this.lista));
        localStorage.setItem('meuLimite', this.limite);

        let total = 0;
        let telaLista = document.getElementById('listaGastos');
        telaLista.innerHTML = "";

        for (let count = 0; count < this.lista.length; count++) {
            let item = this.lista[count];

            total += item.valor;

            telaLista.innerHTML += `
                <li>
                    ${item.descricao} - R$ ${item.valor} (${item.categoria} | ${item.data})
                    <button class="btn-excluir" onclick="excluirGasto(${count})">Excluir</button>
                </li>
            `;
        }

        let saldo = this.limite - total;

        document.getElementById('limiteAtual').innerText = "R$ " + this.limite;
        document.getElementById('totalGasto').innerText = "R$ " + total;
        document.getElementById('saldoDisponivel').innerText = "R$ " + saldo;


        let divAviso = document.getElementById('avisoLimite');

        if (this.limite > 0 && total > this.limite) {
            divAviso.innerText = "⚠️ Aviso: Você ultrapassou o seu limite mensal!";
            divAviso.style.display = "block";
        } else {
            divAviso.style.display = "none";
        }
    }
}

let app = new Sistema();
app.atualizar();

function definirLimite() {
    let valorLimite = parseFloat(document.getElementById('limiteInput').value);

    if (isNaN(valorLimite) || valorLimite <= 0) {
        alert("Por favor, insira um limite válido e maior que zero.");
        return;
    }

    app.limite = valorLimite;
    app.atualizar();
}

function adicionarGasto() {
    let descricao = document.getElementById('descInput').value;
    let valor = parseFloat(document.getElementById('valorInput').value);
    let categoria = document.getElementById('catInput').value;
    let data = document.getElementById('dataInput').value;

    if (descricao.trim() === "") {
        alert("Por favor, preencha a descrição.");
        return;
    }
    if (isNaN(valor) || valor <= 0) {
        alert("Por favor, insira um valor válido e maior que zero.");
        return;
    }
    if (categoria === "") {
        alert("Por favor, selecione uma categoria.");
        return;
    }
    if (data === "") {
        alert("Por favor, informe a data.");
        return;
    }

    app.adicionar(descricao, valor, categoria, data);
}

function excluirGasto(posicao) {
    app.remover(posicao);
}
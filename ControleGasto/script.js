
class Sistema {
    constructor() {
        this.lista = [];
        this.limite = 0;
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
    }
}


let app = new Sistema();

function definirLimite() {
    app.limite = parseFloat(document.getElementById('limiteInput').value);
    app.atualizar();
}

function adicionarGasto() {
    let descricao = document.getElementById('descInput').value;
    let valor = parseFloat(document.getElementById('valorInput').value);
    let categoria = document.getElementById('catInput').value;
    let data = document.getElementById('dataInput').value;

    app.adicionar(descricao, valor, categoria, data);
}


function excluirGasto(posicao) {
    app.remover(posicao);
}
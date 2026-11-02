const menu = document.getElementById("menu")
const btn = document.getElementById("menu-btn")
const overlay = document.getElementById("overlay")

const formCadastro = document.querySelector('#tela-cadastro form')

formCadastro.addEventListener('submit', async(evento) => {
    evento.preventDefault()

    const nomeCompleto = document.getElementById('nomeCompleto').value
    const email = document.getElementById('cadastroEmail').value
    const telefone = document.getElementById('numTel').value
    const senha = document.getElementById('cadastroSenha').value
    const confirmarSenha = document.getElementById('confirmarSenha').value

    if (senha !== confirmarSenha) {
        alert('As senhas não conferem, tente novamente...')
        return
    }

    const dadosUsuario = { nomeCompleto, email, telefone, senha };

    try {
        const resposta = await fetch('http://localhost:3000/usuarios', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dadosUsuario)
        })

        if (resposta.ok) {
            alert('Cadastro realizado com sucesso!')
            formCadastro.reset()
        } else {
            alert('Erro ao realizar cadastro.')
        }
    } catch (erro) {
        console.error('Erro:', erro)
        alert('Não foi possível conectar ao servidor.')
    }
})


btn.addEventListener("click", () => {
    menu.classList.toggle("active")
    overlay.classList.toggle("active")
})

overlay.addEventListener("click", () => {
    menu.classList.remove("active")
    overlay.classList.remove("active")
})



function mudarPagina(id) {
    document.querySelectorAll(".pagina").forEach((pagina) => {
        pagina.classList.remove("ativa")
    })

    const paginaAlvo = document.getElementById(id)
    if (paginaAlvo) {
        paginaAlvo.classList.add("ativa")
    }

    menu.classList.remove("active")
    overlay.classList.remove("active")

}


function selecionarOpcao(botao) {
    const botoesDoGrupo = botao.parentElement.querySelectorAll(".opcao")

    botoesDoGrupo.forEach((b) => {
        b.classList.remove("selecionado")
    })

    botao.classList.add("selecionado")
}



const modalElement = document.getElementById("modalNotaFiscal");

function Modal() {
    modalElement.style.display = "flex"
}

function fecharModal() {
    modalElement.style.display = "none"
}

window.onclick = function(event) {
    if (event.target === modalElement) {
        fecharModal()
    }
}

function confirmarCompra() {
    alert("Pagamento de R$ 200,00 processado com sucesso! Obrigado por ajudar o Chinego e apoiar nossa plataforma.")
    fecharModal()

}
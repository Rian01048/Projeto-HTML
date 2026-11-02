const menu = document.getElementById("menu")
const btn = document.getElementById("menu-btn")
const overlay = document.getElementById("overlay")

const formCadastro = document.getElementById('form-cadastro')
const formLogin = document.getElementById('form-login')
const formPet = document.getElementById('form-publicar-pet')

let listaDePets = []
let valorAtualCompra = 0


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

// ==========================================
// USUÁRIO: CADASTRO E LOGIN
// ==========================================
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

    const dadosUsuario = { nomeCompleto, email, telefone, senha }

    try {
        const resposta = await fetch('http://localhost:3000/usuarios', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dadosUsuario)
        })

        if (resposta.ok) {
            alert('Cadastro realizado com sucesso!')
            formCadastro.reset()
            mudarPagina('tela-login')
        } else {
            alert('Erro ao realizar cadastro.')
        }
    } catch (erro) {
        console.error('Erro:', erro)
        alert('Não foi possível conectar ao servidor.')
    }
})

formLogin.addEventListener('submit', async(evento) => {
    evento.preventDefault()
    const email = document.getElementById('loginEmail').value
    const senha = document.getElementById('loginSenha').value

    try {
        const resposta = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, senha })
        })

        if (resposta.ok) {
            alert("Login realizado com sucesso!")
            formLogin.reset()
            mudarPagina('tela-inicio')
        } else {
            const dadosErro = await resposta.json()
            alert(dadosErro.erro)
        }
    } catch (erro) {
        console.error('Erro:', erro)
        alert('Não foi possível conectar ao servidor.')
    }
})

function selecionarOpcao(botao, inputId, valor) {
    const botoesDoGrupo = botao.parentElement.querySelectorAll(".opcao")
    botoesDoGrupo.forEach((b) => b.classList.remove("selecionado"))
    botao.classList.add("selecionado")
    document.getElementById(inputId).value = valor

    if (inputId === 'input-situacao') {
        const containerPreco = document.getElementById('container-preco')
        if (valor === 'Para adoção') {
            containerPreco.style.display = 'block'
        } else {
            containerPreco.style.display = 'none'
            document.getElementById('precoPet').value = ''
        }
    }
}

formPet.addEventListener('submit', async(evento) => {
    evento.preventDefault()
    const especie = document.getElementById('input-especie').value
    const situacao = document.getElementById('input-situacao').value

    if (!especie || !situacao) {
        alert('Por favor, selecione a Espécie e a Situação do animal.')
        return
    }

    const formData = new FormData()
    formData.append('foto', document.getElementById('fotoAnimal').files[0])
    formData.append('nome', document.getElementById('nomeAnimal').value)
    formData.append('especie', especie)
    formData.append('situacao', situacao)

    const preco = document.getElementById('precoPet').value
    formData.append('preco', preco ? preco : 0)

    formData.append('bairro', document.getElementById('bairroPet').value)
    formData.append('cidade', document.getElementById('cidadePet').value)
    formData.append('telefone', document.getElementById('telPet').value)

    try {
        const resposta = await fetch('http://localhost:3000/pets', {
            method: 'POST',
            body: formData
        })

        if (resposta.ok) {
            alert('Pet publicado com sucesso!')
            formPet.reset()

            document.querySelectorAll('.opcao').forEach((b) => b.classList.remove('selecionado'))
            document.getElementById('input-especie').value = ''
            document.getElementById('input-situacao').value = ''
            document.getElementById('container-preco').style.display = 'none'

            await carregarPets()
            mudarPagina('tela-inicio')
        } else {
            alert('Erro ao publicar pet.')
        }
    } catch (erro) {
        console.error('Erro:', erro)
        alert('Falha na comunicação com o servidor.')
    }
})


async function carregarPets() {
    try {
        const resposta = await fetch('http://localhost:3000/pets')
        listaDePets = await resposta.json()

        console.log("Pets carregados do banco de dados:", listaDePets)

        const containerAdocao = document.getElementById('container-cards-adocao')
        const containerPerdidos = document.getElementById('container-cards-perdidos')

        if (containerAdocao) containerAdocao.innerHTML = ''
        if (containerPerdidos) containerPerdidos.innerHTML = ''

        listaDePets.forEach((pet, index) => {
            const imageUrl = pet.foto ? `http://localhost:3000${pet.foto}` : 'assets/placeholder-pet.jpg'

            const situacaoDoBanco = (pet.situacao || '').toLowerCase().trim()
            const isAdocao = situacaoDoBanco.includes('ado')
            const isPerdido = situacaoDoBanco.includes('perdid')

            const classeTexto = isPerdido ? 'perdido-texto' : 'adocao-texto'
            const classeBtn = isPerdido ? 'perdido-btn' : 'adocao-btn'

            const cardHTML = `
                <div class="card-pet">
                    <img src="${imageUrl}" alt="${pet.nome}">
                    <div class="info-pet">
                        <h3>${pet.nome || 'Sem nome'}</h3>
                        <p>${pet.especie} <span class="status ${classeTexto}">• ${pet.situacao}</span></p>
                        <p class="bairro">Bairro: ${pet.bairro}</p>
                    </div>
                    <button class="ver-info ${classeBtn}" onclick="abrirInfoPet(${index})">Ver informações</button>
                </div>
            `

            if (isAdocao && containerAdocao) {
                containerAdocao.innerHTML += cardHTML
            } else if (isPerdido && containerPerdidos) {
                containerPerdidos.innerHTML += cardHTML
            }
        })
    } catch (erro) {
        console.error('Erro ao buscar pets:', erro)
    }
}


function abrirInfoPet(index) {
    const pet = listaDePets[index]
    const imageUrl = pet.foto ? `http://localhost:3000${pet.foto}` : 'assets/placeholder-pet.jpg'

    const situacaoDoBanco = (pet.situacao || '').toLowerCase().trim()
    const isPerdido = situacaoDoBanco.includes('perdid')
    const isAdocao = situacaoDoBanco.includes('ado')
    const classeTexto = isPerdido ? 'perdido-texto' : 'adocao-texto'

    let areaCompraHTML = ''
    const precoPet = parseFloat(pet.preco || 0)

    if (isAdocao && precoPet > 0) {
        const precoFormatado = precoPet.toFixed(2).replace('.', ',')
        areaCompraHTML = `
            <div class="preco">
                <p>Taxa de Adoção (VIP)</p>
                <strong>R$ ${precoFormatado}</strong>
            </div>
            <button class="contato" style="background-color: #28a745; margin-bottom: 10px;" onclick="abrirModalCompra(${precoPet})">🛒 Comprar agora!</button>
        `
    }

    const idDoBanco = pet.id || pet.ID || pet.id_pet

    const containerInfo = document.getElementById('conteudo-info-pet')
    containerInfo.innerHTML = `
        <div class="card info-animal">
            <h1>Informações do animal</h1>
            <img src="${imageUrl}" alt="${pet.nome}">
            <h2 class="nome-animal ${classeTexto}">${pet.nome || 'Sem nome'}</h2>

            <div class="dados">
                <p><strong>Espécie:</strong> ${pet.especie}</p>
                <p><strong>Situação:</strong> <span class="${classeTexto}">${pet.situacao}</span></p>
                <p><strong>Bairro:</strong> ${pet.bairro}</p>
                <p><strong>Cidade:</strong> ${pet.cidade}</p>
                <p><strong>Contato:</strong> ${pet.telefone}</p>
            </div>

            ${areaCompraHTML}

            <button class="contato" onclick="alert('Funcionalidade de contato em breve!')">🐾 Entrar em contato</button>

            <div class="acoes">
                <button class="excluir" onclick="excluirPet(${idDoBanco})">Excluir</button>
                <button class="editar" onclick="alert('Em breve: Editar')">Editar</button>
            </div>
        </div>
    `

    mudarPagina('tela-info-pet')
}


async function excluirPet(id) {
    if (!id) {
        alert("Erro: ID do animal não encontrado. Verifique sua tabela no banco de dados.")
        return
    }

    const confirmacao = confirm("Tem certeza que deseja excluir este pet?")
    if (confirmacao) {
        try {
            const resposta = await fetch(`http://localhost:3000/pets/${id}`, { method: 'DELETE' })
            if (resposta.ok) {
                alert('Pet excluído com sucesso!')
                await carregarPets()
                mudarPagina('tela-inicio')
            } else {
                alert('Erro ao excluir o pet.')
            }
        } catch (erro) {
            console.error('Erro:', erro)
            alert('Falha na comunicação com o servidor.')
        }
    }
}

function abrirModalCompra(valor) {
    valorAtualCompra = valor
    const repasse = valor * 0.92
    const taxa = valor * 0.08
    const formataMoeda = (num) => 'R$ ' + num.toFixed(2).replace('.', ',')

    document.getElementById('modal-valor-base').innerText = formataMoeda(valor)
    document.getElementById('modal-valor-repasse').innerText = formataMoeda(repasse)
    document.getElementById('modal-valor-taxa').innerText = formataMoeda(taxa)
    document.getElementById('modal-valor-total').innerText = formataMoeda(valor)

    document.getElementById("modalNotaFiscal").style.display = "flex"
}

function fecharModal() {
    document.getElementById("modalNotaFiscal").style.display = "none"
}

function confirmarCompra() {
    alert(`Pagamento de R$ ${valorAtualCompra.toFixed(2).replace('.', ',')} processado com sucesso! Obrigado por apoiar nossa plataforma.`)
    fecharModal()
}

window.addEventListener('DOMContentLoaded', carregarPets)
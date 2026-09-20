const HTTPS = "https://"
const DNS = "pokeapi.co/api/v2/"
const ROUTE = "pokemon?limit=200"
const URL_API = `${HTTPS}${DNS}${ROUTE}`

let pokemon = []

// Definindo uma função onde vai aparecer por um instante a tela de carregamento enquanto a lista dos pokemons não é mostrada
function mostrarLoading() {
    document.querySelector("#loading").classList.remove("escondido")
    document.querySelector("#card-Pokemon").innerHTML = ""
}

// Função de esconder
function esconderLoading() {
    document.querySelector("#loading").classList.add("escondido")
}

async function carregarPokemon() {
    mostrarLoading() //Carregamento
    try {
        const resposta = await fetch(URL_API)
        const dados = await resposta.json()
        pokemon = dados.results
        mostrarPokemon(pokemon)
    } catch (erro) {
        console.error(erro)
    } finally { //Após a execução do codigo, vai chamar a função de esconder o carregamento
        esconderLoading()
    }
}

function mostrarPokemon(lista) {
    const area = document.querySelector("#card-Pokemon")
    area.innerHTML = ""

    lista.forEach((pokemon) => {
        const id = pokemon.url.split('/')[6] //Um identificador, ele está pegando o site API e fazendo a contagem de 1 ate o limite de lista de pokémon
        const imagem = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png` // Imagem do pokémon

        area.innerHTML += `
        <div class="pokemon">
            <img src="${imagem}">
            <h2>${pokemon.name.toUpperCase()}</h2>
            <button onclick="verInformacao(${id})">Informação</button>
        </div>
        `
    })
}

// Repetindo a mesma estrutura acima para informações
async function verInformacao(id) {
    mostrarLoading()

    try {
        const site = `https://pokeapi.co/api/v2/pokemon/${id}/`
        const resposta = await fetch(site)
        const dados = await resposta.json()

        const imagem = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`
        const tipos = dados.types.map(tipo => tipo.type.name).join(', ') //Mapeando o API recebido dentro da variavel site para obter um certo dado

        const area = document.querySelector("#card-Pokemon")

        // // Esses / 10 estamos convertendo para altura e peso, na API o número é diferente
        area.innerHTML = `
        <div class="pokemon pokemon-detalhe">
            <button onclick="mostrarPokemon(pokemon)">Voltar</button>
            <br>
            <img src="${imagem}">
            <h2>${dados.name.toUpperCase()}</h2>
            <p>Altura: ${dados.height / 10}m</p> 
            <p>Peso: ${dados.weight / 10}kg</p> 
            <p>Tipo: ${tipos.toUpperCase()}</p>
        </div>
        `
    } catch (erro) {
        console.error(erro)
    } finally {
        esconderLoading()
    }
}

function buscarPokemon() {
    const texto = document.querySelector("#campoBusca").value.trim().toLowerCase()

    const resultado = pokemon.filter((pokemon) => {
        return pokemon.name.toLowerCase().includes(texto)
    })

    mostrarPokemon(resultado)
}

carregarPokemon()
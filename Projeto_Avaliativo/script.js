const HTTPS = "https://"
const DNS = "pokeapi.co/api/v2/"
const ROUTE = "pokemon?limit=200"
const URL_API = `${HTTPS}${DNS}${ROUTE}`

let pokemon = []

async function carregarPokemon() {
    try {
        const resposta = await fetch(URL_API)
        const dados = await resposta.json()
        pokemon = dados.results
        mostrarPokemon(pokemon)
    } catch (erro) {
        console.error(erro)
    }
}

function mostrarPokemon(lista) {
    const area = document.querySelector("#card-Pokemon")
    area.innerHTML = ""

    lista.forEach((pokemon) => {
        const id = pokemon.url.split('/')[6] //Um identificador, 
        const imagem = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`

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
    const area = document.querySelector("#card-Pokemon")
    area.innerHTML = ""

    try {
        const site = `https://pokeapi.co/api/v2/pokemon/${id}/`
        const resposta = await fetch(site)
        const dados = await resposta.json()

        const imagem = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png` // Imagem do pokémon

        const tipos = dados.types.map(tipo => tipo.type.name).join(', '); //Mapeando o API recebido dentro da variavel site para obter um certo dado


        // Esses / 10 estamos convertendo para altura e peso, na API o número é diferente
        area.innerHTML = `
        <div class="pokemon">
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
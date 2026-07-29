// ==========================================
// 1. VARIÁVEIS GERAIS
// ==========================================
// Uma lista com os nomes exatos (IDs) de todas as telas principais do site
var listaDeTelas = ['tela-login', 'tela-cadastro', 'tela-inicio', 'tela-anuncio', 'tela-cadastro_pet'];

// ==========================================
// 2. FUNÇÕES DE NAVEGAÇÃO BÁSICA
// ==========================================

// Função para esconder todas as telas e mostrar apenas a tela que queremos
function mostrarTela(idDaTela) {
    // Passo A: Um laço de repetição (for) para esconder TODAS as telas
    for (var i = 0; i < listaDeTelas.length; i++) {
        var nomeDaTela = listaDeTelas[i];
        var tela = document.getElementById(nomeDaTela);
        
        if (tela !== null) {
            tela.classList.remove('ativa'); // Remove a classe que deixa a tela visível
        }
    }

    // Passo B: Mostrar apenas a tela escolhida
    var telaEscolhida = document.getElementById(idDaTela);
    if (telaEscolhida !== null) {
        telaEscolhida.classList.add('ativa'); // Coloca a classe que deixa visível
    }
}

// Função para limpar a tela de anúncios (esconde os detalhes e mostra a lista de pets)
function resetarAnuncios() {
    var telaAnuncio = document.getElementById("tela-anuncio");
    if (telaAnuncio !== null) {
        telaAnuncio.classList.remove("show-info");
    }

    // Esconde os detalhes do gato
    document.getElementById("info-gato").style.display = "none";
    // Esconde os detalhes do cachorro perdido
    document.getElementById("info-dog-comum").style.display = "none";
    // Esconde os detalhes do cachorro pra adoção (premium)
    document.getElementById("info-dog-premium").style.display = "none";
    // Esconde a caixa principal de cachorros
    document.getElementById("info-dog").style.display = "none";
}

// Função para mostrar os detalhes de um animal específico e esconder a lista
function verAnimal(idPrincipal, idSecundario) {
    resetarAnuncios(); // Limpa a tela primeiro por garantia

    var telaAnuncio = document.getElementById("tela-anuncio");
    if (telaAnuncio !== null) {
        telaAnuncio.classList.add("show-info"); // Esconde a barra de pesquisa e a lista
    }

    // Mostra a caixa principal (ex: info-gato ou info-dog)
    if (idPrincipal !== null) {
        document.getElementById(idPrincipal).style.display = "block";
    }

    // Se tiver uma caixa interna (ex: cachorro comum ou cachorro premium), mostra ela também
    if (idSecundario !== null) {
        document.getElementById(idSecundario).style.display = "block";
    }

    mostrarTela("tela-anuncio"); // Garante que a gente está na aba de anúncios
}

// ==========================================
// 3. FUNÇÕES LIGADAS AOS BOTÕES DO SEU HTML (onclick="")
// ==========================================

// ==========================================
// 3. FUNÇÕES LIGADAS AOS BOTÕES DO SEU HTML
// ==========================================

function queroAdotar() {
    resetarAnuncios();
    mostrarTela("tela-anuncio");
}

function animaisPerdidos() {
    resetarAnuncios();
    mostrarTela("tela-anuncio");
}

function publicarAnimal() {
    resetarAnuncios(); // <-- Limpeza garantida
    mostrarTela("tela-cadastro_pet");
}

function Login() {
    resetarAnuncios(); // <-- Limpeza garantida
    mostrarTela("tela-login");
}

function Cadastro() {
    resetarAnuncios(); // <-- Limpeza garantida
    mostrarTela("tela-cadastro");
}

// ==========================================
// 4. PREPARANDO A PÁGINA QUANDO ELA CARREGA
// ==========================================
// window.onload significa: "Só execute esses comandos depois que o HTML carregar inteiro"
window.onload = function() {

    // A) Fazer o botão "Início" do menu lateral funcionar
    var botaoInicio = document.querySelector("header.menu nav .rightside button");
    if (botaoInicio !== null) {
        botaoInicio.onclick = function() {
            resetarAnuncios();
            mostrarTela("tela-inicio");
        };
    }

    // B) Injetar os botões de "Voltar" direto no HTML das telas de detalhes
    var htmlDoBotaoVoltar = '<button class="btn-voltar" onclick="voltarParaLista()">← Voltar aos Anúncios</button>';

    document.querySelector("#info-gato .container").innerHTML = htmlDoBotaoVoltar + document.querySelector("#info-gato .container").innerHTML;
    document.querySelector("#info-dog-comum .container").innerHTML = htmlDoBotaoVoltar + document.querySelector("#info-dog-comum .container").innerHTML;
    document.querySelector("#info-dog-premium").innerHTML = htmlDoBotaoVoltar + document.querySelector("#info-dog-premium").innerHTML;

    // C) Ligar os botões "Ver informação" da lista com as telas certas
    var botoesAdocao = document.querySelectorAll("#tela-anuncio_adocao button");
    if (botoesAdocao.length >= 2) {
        botoesAdocao[0].onclick = function() { verAnimal("info-gato", null); }; // 1º botão: Gato (Mel)
        botoesAdocao[1].onclick = function() { verAnimal("info-dog", "info-dog-premium"); }; // 2º botão: Cachorro (Chinego)
    }

    var botoesPerdido = document.querySelectorAll("#tela-anuncio_perdido button");
    if (botoesPerdido.length >= 1) {
        botoesPerdido[0].onclick = function() { verAnimal("info-dog", "info-dog-comum"); }; // 1º botão: Cachorro (Bitelo)
    }

    // D) Impedir que a página recarregue (pisque) ao tentar enviar os formulários
    var formularios = document.querySelectorAll("form");
    for (var contador = 0; contador < formularios.length; contador++) {
        formularios[contador].onsubmit = function(evento) {
            evento.preventDefault(); // Trava a atualização da página
        };
    }
};
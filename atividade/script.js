/* =========================================
   SISTEMA DE NAVEGAÇÃO (SPA)
========================================= */

// Função mestre: limpa a tela de todas as seções e reseta os cards
function esconderTudo() {
    // Tira a classe 'ativa' de todas as sections principais
    document.querySelectorAll('body > section').forEach(sec => {
        sec.classList.remove('ativa');
    });

    // Oculta as telas de detalhes dos animais e volta a mostrar os cards
    document.querySelectorAll('.animais').forEach(el => el.classList.remove('ativa-info'));
    
    const adocao = document.getElementById('tela-anuncio_adocao');
    const perdido = document.getElementById('tela-anuncio_perdido');
    const search = document.querySelector('.search');
    
    if (adocao) adocao.style.display = 'inline-flex';
    if (perdido) perdido.style.display = 'inline-flex';
    if (search) search.style.display = 'block';
}

// Funções chamadas pelos botões do menu e da tela inicial
function irParaInicio() {
    esconderTudo();
    document.getElementById('tela-inicio').classList.add('ativa');
}

function Login() {
    esconderTudo();
    document.getElementById('tela-login').classList.add('ativa');
}

function Cadastro() {
    esconderTudo();
    document.getElementById('tela-cadastro').classList.add('ativa');
}

function queroAdotar() {
    esconderTudo();
    document.getElementById('tela-anuncio').classList.add('ativa');
}

function animaisPerdidos() {
    // Utiliza a mesma tela de anúncios
    queroAdotar();
}

function publicarAnimal() {
    esconderTudo();
    document.getElementById('tela-cadastro_pet').classList.add('ativa');
}

// Função para exibir detalhes do animal e ocultar os outros cards
function abrirDetalhesAnimal(idCardInfo) {
    document.getElementById('tela-anuncio_adocao').style.display = 'none';
    document.getElementById('tela-anuncio_perdido').style.display = 'none';
    document.querySelector('.search').style.display = 'none';
    
    document.getElementById(idCardInfo).classList.add('ativa-info');
}

/* =========================================
   INICIALIZAÇÃO QUANDO A PÁGINA CARREGA
========================================= */
document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Bloqueia o "refresh" da página ao clicar nos botões de formulário
    const formularios = document.querySelectorAll('form');
    formularios.forEach(form => {
        form.addEventListener('submit', (evento) => {
            evento.preventDefault(); 
            console.log("Formulário protegido de refresh.");
        });
    });

    // 2. Preenche dinamicamente os onclicks vazios do HTML
    
    // Botão 'Inicio' no menu superior
    const btnInicio = document.querySelector('.rightside button:nth-child(1)');
    if(btnInicio) {
        btnInicio.onclick = irParaInicio;
    }

    // Botões de "Ver informação" nos cards de pet
    const btnVerGato = document.querySelector('#tela-anuncio_adocao button');
    if(btnVerGato) {
        btnVerGato.onclick = function() { abrirDetalhesAnimal('info-gato'); };
    }

    const btnVerCachorro = document.querySelector('#tela-anuncio_perdido button');
    if(btnVerCachorro) {
        btnVerCachorro.onclick = function() { abrirDetalhesAnimal('info-dog'); };
    }
});
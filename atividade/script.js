// Função chamada pelos botões do seu <header>
function mudarTela(idDaTela) {
    
    // Passo 1: Pega todas as seções que têm a classe 'tela'
    const todasAsTelas = document.querySelectorAll('.tela');

    // Passo 2: Remove a classe 'active' de todas (escondendo todas)
    todasAsTelas.forEach(function(tela) {
        tela.classList.remove('active');
    });

    // Passo 3: Pega a tela exata que tem o ID que o botão enviou
    const telaEscolhida = document.getElementById(idDaTela);

    // Passo 4: Se a tela existir, adiciona a classe 'active' para ela aparecer
    if (telaEscolhida) {
        telaEscolhida.classList.add('active');
    }
}

// ---------------------------------------------------------
// Faz a Tela de Login aparecer sozinha quando a página carregar
// ---------------------------------------------------------
document.addEventListener("DOMContentLoaded", function() {
    mudarTela('tela-login'); 
    
    // (Opcional) Evita que a página recarregue ao clicar em "Entrar" no login
    const formulario = document.querySelector('form');
    if (formulario) {
        formulario.addEventListener('submit', function(evento) {
            evento.preventDefault();
        });
    }
});

// ==========================================================
// 1. ATALHOS DOS SEUS BOTÕES DO HTML
// ==========================================================
// Permite que os botões com nomes diferentes funcionem chamando a mesma função
const queroAdotar = mudarTela;
const animaisPerdidos = mudarTela;
const publicarAnimal = mudarTela;

// ==========================================================
// 2. FUNÇÃO PRINCIPAL (ESCONDE TUDO E MOSTRA O ALVO)
// ==========================================================
function mudarTela(idDaSecao) {
    
    // Passo 1: Pega TODAS as tags <section> da página e esconde
    const todasAsSecoes = document.querySelectorAll('section');
    todasAsSecoes.forEach(function(secao) {
        secao.style.display = 'none'; 
    });

    // Passo 2: Pega a seção exata que o botão mandou abrir
    let secaoEscolhida = document.getElementById(idDaSecao);

    // Passo 3: Mostra a seção clicada E as seções "mães" dela (se houver)
    while (secaoEscolhida && secaoEscolhida.tagName === 'SECTION') {
        
        secaoEscolhida.style.display = 'block'; 
        
        // Pula para a próxima seção "mãe" que estiver em volta dela
        secaoEscolhida = secaoEscolhida.parentElement.closest('section'); 
    }
}

// ==========================================================
// 3. EVENTOS QUANDO A PÁGINA CARREGA
// ==========================================================
document.addEventListener("DOMContentLoaded", function() {
    
    // Inicia o site direto na tela inicial
    mudarTela('tela-inicio'); 
    
    // (Opcional) Evita que a página recarregue ao clicar nos botões dentro dos <form>
    const formularios = document.querySelectorAll('form');
    formularios.forEach(function(formulario) {
        formulario.addEventListener('submit', function(evento) {
            evento.preventDefault();
        });
    });
});
// ==========================================================
// 1. FUNÇÃO PRINCIPAL DE NAVEGAÇÃO
// ==========================================================
function mudarTela(idDoAlvo) {
    
    // Passo 1: Seleciona todas as telas principais e sub-telas (sections e divs)
    // Esse seletor abrange as classes e estruturas do seu HTML
    const todasAsTelas = document.querySelectorAll('.tela, .pagina, #tela-anuncio section, #info-dog > div');
    
    // Esconde todas as telas
    todasAsTelas.forEach(function(tela) {
        tela.style.display = 'none';
    });

    // Passo 2: Pega o elemento exato que o botão mandou abrir
    let elementoAtual = document.getElementById(idDoAlvo);

    // Passo 3: Mostra o elemento clicado E vai subindo para mostrar as tags "mães" dele
    while (elementoAtual && elementoAtual.tagName !== 'BODY') {
        
        // Deixar o display como string vazia faz o CSS original reassumir o controle.
        // Isso é fundamental para não quebrar o "display: grid" dos anúncios!
        elementoAtual.style.display = ''; 
        
        // Pula para a tag "mãe" que está envolvendo o elemento atual
        elementoAtual = elementoAtual.parentElement;
    }
}

// ==========================================================
// 2. ATALHOS DOS SEUS BOTÕES DO HTML
// ==========================================================
// Permite que os botões com nomes diferentes funcionem chamando a função principal
const queroAdotar = mudarTela;
const animaisPerdidos = mudarTela;
const publicarAnimal = mudarTela;

// ==========================================================
// 3. EVENTOS QUANDO A PÁGINA CARREGA
// ==========================================================
document.addEventListener("DOMContentLoaded", function() {
    
    // Inicia o site direto na tela inicial
    mudarTela('tela-inicio'); 
    
    // Evita que a página recarregue ao clicar nos botões dos formulários (Login/Cadastro)
    const formularios = document.querySelectorAll('form');
    
    formularios.forEach(function(formulario) {
        formulario.addEventListener('submit', function(evento) {
            evento.preventDefault();
            // No futuro, a lógica para salvar no banco de dados ou validar senhas entra aqui
        });
    });
});


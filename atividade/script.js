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
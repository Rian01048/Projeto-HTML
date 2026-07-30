// Mostra a tela escolhida e esconde as outras
function mudarTela(idDoAlvo) {
    // Esconde tudo de uma vez
    document.querySelectorAll('.tela, .pagina, #tela-anuncio section, #info-dog > div')
            .forEach(tela => tela.style.display = 'none');

    // Pega a tela certa e vai subindo para mostrar os "pais" dela
    let elemento = document.getElementById(idDoAlvo);
    while (elemento && elemento.tagName !== 'BODY') {
        elemento.style.display = '';
        elemento = elemento.parentElement;
    }
}

// Atalhos diretos para os botões do seu HTML
const queroAdotar = mudarTela;
const animaisPerdidos = mudarTela;
const publicarAnimal = mudarTela;

// Configurações ao carregar a página
document.addEventListener("DOMContentLoaded", () => {
    
    mudarTela('tela-inicio'); // Inicia na tela principal

    // Impede a página de recarregar quando clica no botão do formulário
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', e => e.preventDefault());
    });
});
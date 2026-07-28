// Espera todo o HTML carregar antes de executar o script
document.addEventListener('DOMContentLoaded', () => {

    // 1. Lógica para os botões de Espécie (Cachorro / Gato)
    const botoesAnimal = document.querySelectorAll('.btn-animal button');
    
    botoesAnimal.forEach(botao => {
        botao.addEventListener('click', function(event) {
            event.preventDefault(); // Evita que o formulário recarregue a página sem querer
            
            // Remove a classe 'ativo' de todos os botões de espécie
            botoesAnimal.forEach(b => b.classList.remove('ativo'));
            
            // Adiciona a classe 'ativo' apenas no botão que foi clicado
            this.classList.add('ativo');
        });
    });

    // 2. Lógica para os botões de Situação (Para adoção / Perdido)
    const botoesSituacao = document.querySelectorAll('.btn-situacao button');
    
    botoesSituacao.forEach(botao => {
        botao.addEventListener('click', function(event) {
            event.preventDefault();
            
            // Remove a classe 'ativo' de todos os botões de situação
            botoesSituacao.forEach(b => b.classList.remove('ativo'));
            
            // Adiciona a classe 'ativo' no botão clicado
            this.classList.add('ativo');
        });
    });

});
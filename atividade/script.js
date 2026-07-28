// Remove a classe 'ativa' de todas as seções principais
function resetarTelas() {
    document.getElementById('tela-inicio').classList.remove('ativa');
    document.getElementById('tela-anuncio').classList.remove('ativa');
    document.getElementById('tela-cadastro_pet').classList.remove('ativa');
    
    // Oculta as telas de detalhes dos animais também
    document.getElementById('info-gato').classList.remove('ativa-info');
    document.getElementById('info-dog').classList.remove('ativa-info');
    
    // Garante que a lista de cards apareça ao abrir a tela de anúncios
    const cards = document.querySelectorAll('#tela-anuncio main .container > section:not(.animais)');
    cards.forEach(card => card.style.display = 'inline-block');
}

// Funções chamadas pelos botões no HTML
function irParaInicio() {
    resetarTelas();
    document.getElementById('tela-inicio').classList.add('ativa');
}

function queroAdotar() {
    resetarTelas();
    document.getElementById('tela-anuncio').classList.add('ativa');
}

function animaisPerdidos() {
    resetarTelas();
    document.getElementById('tela-anuncio').classList.add('ativa');
}

function publicarAnimal() {
    resetarTelas();
    document.getElementById('tela-cadastro_pet').classList.add('ativa');
}

// Função para abrir os detalhes de um animal específico e esconder os outros cards
function abrirDetalhesAnimal(idCardInfo) {
    // Esconde os cards normais
    const cards = document.querySelectorAll('#tela-anuncio main .container > section:not(.animais)');
    cards.forEach(card => card.style.display = 'none');
    
    // Mostra o card de detalhes desejado
    document.getElementById(idCardInfo).classList.add('ativa-info');
}

// Como no HTML os onclicks de voltar e ver detalhes estavam vazios (onclick=""), 
// nós os preenchemos dinamicamente via JS assim que a página carrega:
document.addEventListener("DOMContentLoaded", () => {
    
    // Configura o botão "Inicio" do Header
    const botoesHeader = document.querySelectorAll('.rightside button');
    if(botoesHeader.length > 0) {
        botoesHeader[0].onclick = irParaInicio; // O primeiro botão é o "Inicio"
    }

    // Pega todos os botões "Ver informação" da tela de anúncio
    const botoesVerInfo = document.querySelectorAll('#tela-anuncio main .container > section:not(.animais) button');
    
    if(botoesVerInfo.length >= 2) {
        // O primeiro card é o gato Mel
        botoesVerInfo[0].onclick = function() {
            abrirDetalhesAnimal('info-gato');
        };
        
        // O segundo card é o cachorro Bitelo (Perdido)
        botoesVerInfo[1].onclick = function() {
            abrirDetalhesAnimal('info-dog');
        };
    }
    
    // Evita que o form recarregue a página ao clicar em botões dentro do cadastro
    const botoesForm = document.querySelectorAll('#tela-cadastro_pet button');
    botoesForm.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault(); // Impede o envio real do formulário para testes
        });
    });
});
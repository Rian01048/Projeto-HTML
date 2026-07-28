document.addEventListener("DOMContentLoaded", () => {

    // 1. Funções globais vinculadas ao HTML
    window.queroAdotar = function() {
        alternarTela('tela-anuncio');
    };

    window.animaisPerdidos = function() {
        alternarTela('tela-anuncio');
    };

    window.publicarAnimal = function() {
        alternarTela('tela-cadastro_pet');
    };

    // 2. Ação do botão "Voltar" no cabeçalho superior
    const linkVoltar = document.querySelector('.leftside a');
    if (linkVoltar) {
        linkVoltar.addEventListener('click', (e) => {
            e.preventDefault();
            alternarTela('tela-inicio');
        });
    }

    // 3. Ações dos botões de navegação do menu superior ("Inicio" e "Anúncio")
    const botoesMenu = document.querySelectorAll('header.menu button');
    botoesMenu.forEach(btn => {
        const texto = btn.textContent.trim().toLowerCase();
        
        if (texto === 'inicio') {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                alternarTela('tela-inicio');
            });
        } else if (texto === 'anúncio' || texto === 'anuncio') {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                alternarTela('tela-anuncio');
            });
        }
    });

    // 4. Mapeamento dos botões "Ver informação"
    const cardsAnuncios = document.querySelectorAll('#tela-anuncio > main > .container > section:not(.animais)');
    cardsAnuncios.forEach(card => {
        const btnVerInfo = card.querySelector('button');
        const nomeAnimal = card.querySelector('.nome h2')?.textContent.trim().toLowerCase();

        if (btnVerInfo) {
            btnVerInfo.addEventListener('click', (e) => {
                e.preventDefault();
                if (nomeAnimal === 'mel') {
                    exibirDetalhes('info-gato');
                } else if (nomeAnimal === 'bitelo') {
                    exibirDetalhes('info-dog');
                }
            });
        }
    });

    // 5. Filtro de pesquisa em tempo real por bairro ou cidade
    const campoBusca = document.getElementById('search-pets');
    if (campoBusca) {
        campoBusca.addEventListener('input', (e) => {
            const termo = e.target.value.toLowerCase().trim();
            cardsAnuncios.forEach(card => {
                const textoCard = card.textContent.toLowerCase();
                card.style.display = textoCard.includes(termo) ? 'flex' : 'none';
            });
        });
    }

    // 6. Seleção de opções (Tipo de animal e Situação) no formulário
    const gruposBotoes = document.querySelectorAll('.btn-animal, .btn-situacao');
    gruposBotoes.forEach(grupo => {
        const botoes = grupo.querySelectorAll('button');
        botoes.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                botoes.forEach(b => b.classList.remove('selecionado'));
                btn.classList.add('selecionado');
            });
        });
    });

    // 7. Processamento e envio do formulário de cadastro
    const formCadastro = document.querySelector('#tela-cadastro_pet form');
    if (formCadastro) {
        formCadastro.addEventListener('submit', (e) => {
            e.preventDefault();
            alert("Animal publicado com sucesso!");
            formCadastro.reset();
            document.querySelectorAll('.btn-animal button, .btn-situacao button').forEach(b => b.classList.remove('selecionado'));
            alternarTela('tela-anuncio');
        });

        // Garante que o botão de "Publicar" dentro do form dispare o submit
        const btnSubmit = formCadastro.querySelector('button:not([type="button"])');
        if (btnSubmit && !btnSubmit.parentElement.classList.contains('btn-animal') && !btnSubmit.parentElement.classList.contains('btn-situacao')) {
            btnSubmit.addEventListener('click', (e) => {
                e.preventDefault();
                formCadastro.dispatchEvent(new Event('submit'));
            });
        }
    }
});

// Transição entre as telas principais
function alternarTela(idTelaDesejada) {
    const telaAnuncio = document.getElementById('tela-anuncio');
    
    if (telaAnuncio) {
        telaAnuncio.classList.remove('modo-detalhes');
    }
    document.querySelectorAll('.animais').forEach(el => el.classList.remove('ativa-detalhe'));

    const telas = document.querySelectorAll('body > section');
    telas.forEach(tela => tela.classList.remove('ativa'));

    const telaAlvo = document.getElementById(idTelaDesejada);
    if (telaAlvo) {
        telaAlvo.classList.add('ativa');
    }
}

// Exibe a tela detalhada de um animal específico
function exibirDetalhes(idDetalhe) {
    const telaAnuncio = document.getElementById('tela-anuncio');
    if (!telaAnuncio) return;

    telaAnuncio.classList.add('modo-detalhes');
    
    document.querySelectorAll('.animais').forEach(el => el.classList.remove('ativa-detalhe'));

    const detalheAlvo = document.getElementById(idDetalhe);
    if (detalheAlvo) {
        detalheAlvo.classList.add('ativa-detalhe');
    }
}
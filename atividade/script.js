// ===================== CONTROLE DO MENU LATERAL =====================
const menu = document.getElementById("menu");
const btn = document.getElementById("menu-btn");
const overlay = document.getElementById("overlay");

// Abre e fecha o menu ao clicar no botão hambúrguer
btn.addEventListener("click", () => {
    menu.classList.toggle("active");
    overlay.classList.toggle("active");
});

// Fecha o menu ao clicar fora dele (no fundo escuro)
overlay.addEventListener("click", () => {
    menu.classList.remove("active");
    overlay.classList.remove("active");
});


// ===================== NAVEGAÇÃO ENTRE TELAS =====================

// Função principal que esconde todas as seções e mostra apenas a desejada
function mudarPagina(id) {
    // 1. Remove a classe 'ativa' de TODAS as páginas
    document.querySelectorAll(".pagina").forEach((pagina) => {
        pagina.classList.remove("ativa");
    });

    // 2. Adiciona a classe 'ativa' apenas na página que tem o ID recebido
    const paginaAlvo = document.getElementById(id);
    if (paginaAlvo) {
        paginaAlvo.classList.add("ativa");
    }

    // 3. Fecha o menu lateral automaticamente ao trocar de página
    menu.classList.remove("active");
    overlay.classList.remove("active");
    
}


// ===================== FORMULÁRIO (CADASTRO DE PET) =====================

// Marca como selecionado o botão clicado dentro do grupo (Espécie ou Situação)
function selecionarOpcao(botao) {
    // Encontra a "div" pai que engloba os botões
    const botoesDoGrupo = botao.parentElement.querySelectorAll(".opcao");

    // Remove a classe "selecionado" de todos os botões irmãos
    botoesDoGrupo.forEach((b) => {
        b.classList.remove("selecionado");
    });

    // Adiciona a classe "selecionado" apenas no botão que foi clicado
    botao.classList.add("selecionado");
}


// ===================== MODAL (NOTA FISCAL) =====================

// Captura o elemento principal do modal
const modalElement = document.getElementById("modalNotaFiscal");

// Função chamada pelo botão "Compre agora!!" na tela do Chinego
function Modal() {
    modalElement.style.display = "flex"; 
}

// Função para fechar o modal ao clicar no "x"
function fecharModal() {
    modalElement.style.display = "none";
}

// Fecha o modal caso o usuário clique na área escura (fora da caixinha branca)
window.onclick = function(event) {
    if (event.target === modalElement) {
        fecharModal();
    }
}

// Função simulando a confirmação do pagamento
function confirmarCompra() {
    alert("Pagamento de R$ 200,00 processado com sucesso! Obrigado por ajudar o Chinego e apoiar nossa plataforma.");
    fecharModal();

}
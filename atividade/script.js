const menu = document.getElementById("menu");
const btn = document.getElementById("menu-btn");
const overlay = document.getElementById("overgay"); // id corrigido (era "overlay", mas no HTML é "overgay")

btn.addEventListener("click", () => {
    menu.classList.toggle("active");
    overlay.classList.toggle("active");
});

overlay.addEventListener("click", () => {
    menu.classList.remove("active");
    overlay.classList.remove("active");
});


// ===================== TROCA DE PÁGINA =====================

// Esconde todas as páginas e mostra só a que foi escolhida
function mostrarPagina(id){
    document.querySelectorAll(".pagina").forEach((pagina) => {
        pagina.classList.remove("ativa");
    });

    document.getElementById(id).classList.add("ativa");

    // fecha o menu lateral, caso esteja aberto
    menu.classList.remove("active");
    overlay.classList.remove("active");

}


// ===================== BOTÕES DO MENU LATERAL =====================

function verInicio(){
    mostrarPagina("tela-inicio");
}

function verLogin(){
    mostrarPagina("tela-login");
}

function verCadastro(){
    mostrarPagina("tela-cadastro");
}


// ===================== BOTÕES DA TELA INÍCIO =====================

function queroAdotar(){
    mostrarPagina("tela-anuncio_adocao");
}

function animaisPerdidos(){
    mostrarPagina("tela-anuncio_perdido");
}

function publicarAnimal(){
    mostrarPagina("tela-cadastro_pet");
}


// ===================== BOTÕES "VER INFORMAÇÕES" DOS ANÚNCIOS =====================

function verMel(){
    mostrarPagina("info-gato");
}

function verChinego(){
    mostrarPagina("info-dog-premium");
}

function verBitelo(){
    mostrarPagina("info-dog-comum");
}


// ===================== FORMULÁRIO DE PUBLICAR ANIMAL =====================

// Marca como selecionado o botão clicado dentro do grupo (Espécie ou Situação)
function selecionarOpcao(botao){
    const botoesDoGrupo = botao.parentElement.querySelectorAll(".opcao");

    botoesDoGrupo.forEach((b) => {
        b.classList.remove("selecionado");
    });

    botao.classList.add("selecionado");
}

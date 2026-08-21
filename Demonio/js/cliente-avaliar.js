(() => {
    const usuario = AUTH.exigirSessao('cliente');
    if (!usuario) return;

    const DOM = { conteudo: document.getElementById('conteudo') };
    const textoSeguro = (valor, fallback = '—') => UI.escapeHtml(valor || fallback);

    // 1. CAPTURA E SELEÇÃO DA SOLICITAÇÃO
    let solicitacaoId = UI.queryParam('id');
    if (!solicitacaoId) {
        solicitacaoId = DB.getSolicitacoesDoCliente(usuario.id)
            .find(s => s.status === 'concluida' && !s.avaliada) ? .id || null;
    }

    const solicitacao = solicitacaoId ? DB.getSolicitacaoPorId(solicitacaoId) : null;

    // 2. FUNÇÃO AUXILIAR PARA TELAS DE ESTADO VAZIO / BLOQUEIO
    function renderEstadoVazio(mensagem, textoBotao, linkBotao) {
        DOM.conteudo.innerHTML = `
      <div class="empty-state">
        <p>${mensagem}</p>
        <a class="btn btn-outline" href="${linkBotao}">${textoBotao}</a>
      </div>`;
    }

    // 3. VALIDAÇÕES DE ACESSO (Early Returns)
    if (!solicitacao || solicitacao.clienteId !== usuario.id) {
        return renderEstadoVazio('Não há nenhum serviço concluído aguardando avaliação.', 'Voltar ao início', 'cliente-home.html');
    }

    if (!solicitacao.recebimento) {
        DOM.conteudo.innerHTML = `
      <span class="eyebrow">RF-17 · Pré-requisito</span>
      <p>A avaliação só é liberada depois da confirmação assinada de recebimento.</p>
      <a class="btn btn-primary" href="cliente-recebimento.html?id=${encodeURIComponent(solicitacao.id)}">Confirmar recebimento</a>`;
        return;
    }

    if (solicitacao.avaliada) {
        return renderEstadoVazio('Você já avaliou este serviço. Obrigado pelo feedback.', 'Ver comprovante da corrida', `cliente-acompanhar.html?id=${encodeURIComponent(solicitacao.id)}`);
    }

    const motorista = DB.getUsuarioPorId(solicitacao.motoristaAceitoId);
    if (!motorista) {
        DOM.conteudo.innerHTML = '<p>Transportador não encontrado.</p>';
        return;
    }

    // 4. PREPARAÇÃO DOS DADOS DA TELA
    const nomeMotorista = textoSeguro(motorista.nome);
    const iniciaisMotorista = textoSeguro(AUTH.iniciais(motorista.nome));
    const origemResumo = textoSeguro(UI.resumoEndereco(solicitacao.origem));
    const destinoResumo = textoSeguro(UI.resumoEndereco(solicitacao.destino));

    const destaques = ['Pontualidade', 'Cuidado com a carga', 'Educação', 'Preço justo'];

    const estrelasHtml = [1, 2, 3, 4, 5].map(valor => `
    <button type="button" class="star-button" data-v="${valor}" aria-label="${valor} estrela${valor > 1 ? 's' : ''}">★</button>
  `).join('');

    const chipsHtml = destaques.map((item, index) => `
    <button type="button" class="chip ${index === 0 ? 'active' : ''}" data-destaque="${textoSeguro(item)}">${textoSeguro(item)}</button>
  `).join('');

    // 5. MONTAGEM DO HTML PRINCIPAL
    DOM.conteudo.innerHTML = `
    <span class="eyebrow">RF-10 · Avaliação do serviço</span>
    
    <div class="card center profile-hero">
      <div class="avatar avatar-large">${iniciaisMotorista}</div>
      <h2>Como foi com ${nomeMotorista}?</h2>
      <p>Carreto concluído · ${origemResumo} → ${destinoResumo}</p>
    </div>

    <label class="form-label">Sua nota</label>
    <div class="star-picker" id="stars" role="radiogroup" aria-label="Nota de 1 a 5 estrelas">
      ${estrelasHtml}
    </div>

    <fieldset>
      <legend>O que se destacou?</legend>
      <div class="chip-group" id="destaqueChips">
        ${chipsHtml}
      </div>
    </fieldset>

    <div class="field">
      <label for="comentario">Comentário (opcional)</label>
      <textarea id="comentario" placeholder="Conte como foi sua experiência"></textarea>
    </div>

    <div id="erroAvaliacao" class="form-error" hidden></div>
    <button class="btn btn-primary" id="btnEnviarAvaliacao" type="button">Enviar avaliação</button>`;

    // 6. ESTADOS E EVENTOS DE INTERAÇÃO
    let notaSelecionada = 0;
    let destaqueSelecionado = 'Pontualidade';

    const estrelasEl = document.querySelectorAll('.star-button');
    estrelasEl.forEach(estrela => {
        estrela.addEventListener('click', () => {
            notaSelecionada = Number(estrela.dataset.v);
            estrelasEl.forEach(item => {
                const valorEstrela = Number(item.dataset.v);
                item.classList.toggle('filled', valorEstrela <= notaSelecionada);
            });
        });
    });

    const chipsEl = document.querySelectorAll('#destaqueChips .chip');
    chipsEl.forEach(chip => {
        chip.addEventListener('click', () => {
            chipsEl.forEach(item => item.classList.remove('active'));
            chip.classList.add('active');
            destaqueSelecionado = chip.dataset.destaque;
        });
    });

    // 7. ENVIO DA AVALIAÇÃO
    document.getElementById('btnEnviarAvaliacao').addEventListener('click', () => {
        const erroEl = document.getElementById('erroAvaliacao');
        UI.limparErro(erroEl);

        if (!notaSelecionada) {
            return UI.mostrarErro(erroEl, 'Escolha uma nota de 1 a 5 estrelas antes de enviar.');
        }

        const resultado = DB.criarAvaliacao({
            solicitacaoId: solicitacao.id,
            avaliadorId: usuario.id,
            avaliadorNome: usuario.nome,
            avaliadoId: motorista.id,
            nota: notaSelecionada,
            destaque: destaqueSelecionado,
            comentario: document.getElementById('comentario').value.trim()
        });

        if (resultado.erro) {
            return UI.mostrarErro(erroEl, resultado.erro);
        }

        window.location.href = `cliente-acompanhar.html?id=${encodeURIComponent(solicitacao.id)}`;
    });
})();
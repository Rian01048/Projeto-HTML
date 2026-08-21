(() => {
    const usuario = AUTH.exigirSessao('motorista');
    if (!usuario) return;

    const DOM = {
        conteudo: document.getElementById('conteudo')
    };

    const solicitacaoId = UI.queryParam('id');
    const solicitacao = solicitacaoId ? DB.getSolicitacaoPorId(solicitacaoId) : null;

    // 1. FUNÇÃO AJUDANTE PARA TELAS DE BLOQUEIO (Evita repetição de código)
    function mostrarTelaBloqueio(mensagem, textoBotao, linkBotao) {
        DOM.conteudo.innerHTML = `
      <div class="empty-state">
        <p>${mensagem}</p>
        <a class="btn btn-outline" href="${linkBotao}">${textoBotao}</a>
      </div>`;
    }

    // 2. VALIDAÇÕES DE ACESSO (Usando Return Antecipado com a função acima)
    if (!solicitacao) {
        return mostrarTelaBloqueio('Solicitação não encontrada ou não está mais disponível.', 'Voltar', 'motorista-home.html');
    }

    if (solicitacao.motoristaAceitoId || !['aberta', 'orcamentos_recebidos'].includes(solicitacao.status)) {
        return mostrarTelaBloqueio('Esta solicitação já foi fechada e não aceita novas propostas.', 'Voltar', 'motorista-home.html');
    }

    if (DB.motoristaJaOrcou(solicitacao.id, usuario.id)) {
        return mostrarTelaBloqueio('Você já enviou um orçamento para esta solicitação.', 'Voltar', 'motorista-home.html');
    }

    if (solicitacao.necessitaMontador && !usuario.ofereceMontagem) {
        return mostrarTelaBloqueio('Esta solicitação exige serviço de montagem. Habilite essa opção no seu perfil para poder enviar orçamento.', 'Ir para perfil', 'motorista-perfil.html');
    }

    // 3. PREPARAÇÃO DE DADOS PARA A TELA
    const cliente = DB.getUsuarioPorId(solicitacao.clienteId) || {};

    function renderizarResumo() {
        // Extraindo a lógica de formatação do meio do HTML
        const montagemTexto = solicitacao.necessitaMontador ? 'Obrigatória' : 'Não solicitada';
        const seguroTexto = solicitacao.seguro ?
            `${UI.escapeHtml(solicitacao.seguro.nome)} · cobertura ${UI.dinheiro(solicitacao.seguro.limite)}` :
            'Sem seguro';
        const observacoesHtml = solicitacao.observacoes ?
            `<div class="request-notes"><span>Observações</span><p>${UI.escapeHtml(solicitacao.observacoes)}</p></div>` :
            '';

        return `
      <span class="eyebrow">RF-03/11 · Solicitação de ${UI.escapeHtml(UI.primeiroNome(cliente.nome))}</span>
      <div class="card request-summary">
        <div class="info-row"><span>Origem</span><strong>${UI.escapeHtml(solicitacao.origem)}</strong></div>
        <div class="info-row"><span>Destino</span><strong>${UI.escapeHtml(solicitacao.destino)}</strong></div>
        <div class="info-row"><span>Carga</span><strong>${UI.escapeHtml(solicitacao.tipoCarga)}</strong></div>
        <div class="info-row"><span>Volume</span><strong>${UI.escapeHtml(solicitacao.volume)}</strong></div>
        <div class="info-row"><span>Modalidade</span><strong>${UI.modalidadeLabel(solicitacao)}</strong></div>
        <div class="info-row"><span>Montagem</span><strong>${montagemTexto}</strong></div>
        <div class="info-row"><span>Seguro</span><strong>${seguroTexto}</strong></div>
        ${observacoesHtml}
      </div>
      <div class="divider"></div>`;
    }

    function renderizarFormulario() {
        return `
      <span class="eyebrow">RF-07 · Enviar orçamento</span>
      <p>Informe o valor e o prazo estimado. O cliente poderá ordenar e comparar sua proposta com outras.</p>

      <div id="erroOrcar" class="form-error" hidden></div>

      <div class="field">
        <label for="valor">Valor do frete (R$)</label>
        <input type="number" min="1" step="0.01" id="valor" inputmode="decimal" placeholder="85,00">
      </div>
      <div class="field">
        <label for="prazo">Tempo estimado até a coleta</label>
        <select id="prazo">
          <option>Até 10 minutos</option>
          <option>10 a 20 minutos</option>
          <option>20 a 30 minutos</option>
          <option>Mais de 30 minutos</option>
        </select>
      </div>
      <div class="field">
        <label for="msg">Mensagem para o cliente (opcional)</label>
        <textarea id="msg" placeholder="Ex: Posso levar um ajudante sem custo extra"></textarea>
      </div>

      <button type="button" class="btn btn-primary" id="btnEnviarOrcamento">Enviar orçamento</button>`;
    }

    // 4. INJEÇÃO NA TELA
    DOM.conteudo.innerHTML = renderizarResumo() + renderizarFormulario();

    // 5. EVENTO DE ENVIO (Só existe após a tela ser renderizada)
    const btnEnviar = document.getElementById('btnEnviarOrcamento');
    const containerErro = document.getElementById('erroOrcar');

    btnEnviar.addEventListener('click', () => {
        UI.limparErro(containerErro);

        const valor = Number(document.getElementById('valor').value);

        // Validação com Early Return
        if (!Number.isFinite(valor) || valor <= 0) {
            return UI.mostrarErro(containerErro, 'Informe um valor válido para o frete.');
        }

        const resultado = DB.criarOrcamento({
            solicitacaoId: solicitacao.id,
            motoristaId: usuario.id,
            valor,
            prazo: document.getElementById('prazo').value,
            mensagem: document.getElementById('msg').value.trim()
        });

        if (resultado.erro) {
            return UI.mostrarErro(containerErro, resultado.erro);
        }

        // Sucesso: Manda o motorista pra home
        window.location.href = 'motorista-home.html';
    });
})();
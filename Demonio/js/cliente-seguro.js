(() => {
  const usuario = AUTH.exigirSessao('cliente');
  if (!usuario) return;

  const solicitacaoId = UI.queryParam('id');
  const solicitacao = solicitacaoId ? DB.getSolicitacaoPorId(solicitacaoId) : null;
  const conteudo = document.getElementById('conteudo');

  if (!solicitacao || solicitacao.clienteId !== usuario.id) {
    conteudo.innerHTML = `
      <div class="empty-state">
        <p>Solicitação não encontrada.</p>
        <a class="btn btn-outline" href="cliente-home.html">Voltar ao início</a>
      </div>`;
    return;
  }

  const planos = DB.getPlanosSeguro();
  const planoSelecionado = solicitacao.seguro?.id || (solicitacao.seguroDefinido ? 'nenhum' : 'intermediario');

  conteudo.innerHTML = `
    <span class="eyebrow">RF-12 · Proteção da carga</span>
    <h2>Seguro de carga</h2>
    <p>Escolha uma cobertura para danos durante carregamento, transporte e descarga, ou prossiga sem seguro.</p>

    <div class="card request-summary">
      <div class="info-row"><span>Origem</span><strong>${UI.resumoEndereco(solicitacao.origem)}</strong></div>
      <div class="info-row"><span>Destino</span><strong>${UI.resumoEndereco(solicitacao.destino)}</strong></div>
      <div class="info-row"><span>Modalidade</span><strong>${UI.modalidadeLabel(solicitacao)}</strong></div>
    </div>

    <div class="stack" id="planos">
      ${planos.map(plano => `
        <label class="insurance-card ${plano.id === 'intermediario' ? 'featured' : ''}">
          <input type="radio" name="plano" value="${plano.id}" ${planoSelecionado === plano.id ? 'checked' : ''}>
          <div>
            <strong>${UI.escapeHtml(plano.nome)}</strong>
            <span>Cobertura de até ${UI.dinheiro(plano.limite)}</span>
          </div>
          <b>+ ${UI.dinheiro(plano.valor)}</b>
        </label>`).join('')}

      <label class="insurance-card">
        <input type="radio" name="plano" value="nenhum" ${planoSelecionado === 'nenhum' ? 'checked' : ''}>
        <div>
          <strong>Sem seguro</strong>
          <span>Continuar sem cobertura adicional</span>
        </div>
        <b>${UI.dinheiro(0)}</b>
      </label>
    </div>

    <div class="card notice-card">
      <small class="small-print">Neste MVP, o seguro é uma simulação registrada no localStorage. Em produção, será necessária integração com seguradora, termos de contratação e pagamento.</small>
    </div>

    <div id="erroSeguro" class="form-error" hidden></div>
    <button class="btn btn-primary" id="continuar">Confirmar e buscar transportadores</button>`;

  document.getElementById('continuar').addEventListener('click', () => {
    const selecionado = document.querySelector('input[name="plano"]:checked');
    if (!selecionado) {
      UI.mostrarErro(document.getElementById('erroSeguro'), 'Selecione um plano ou a opção sem seguro.');
      return;
    }

    const atualizada = DB.definirSeguro(solicitacao.id, selecionado.value);
    if (!atualizada) {
      UI.mostrarErro(document.getElementById('erroSeguro'), 'Não foi possível salvar a opção de seguro.');
      return;
    }

    window.location.href = `cliente-busca.html?id=${encodeURIComponent(solicitacao.id)}`;
  });
})();

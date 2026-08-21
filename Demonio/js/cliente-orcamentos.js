(() => {
        const usuario = AUTH.exigirSessao('cliente');
        if (!usuario) return;

        const conteudo = document.getElementById('conteudo');
        let solicitacaoId = UI.queryParam('id');
        let criterio = 'valor';
        const selecionados = new Set();

        if (!solicitacaoId) {
            const solicitacoes = DB.getSolicitacoesDoCliente(usuario.id);
            const preferida = solicitacoes.find(s => ['orcamentos_recebidos', 'aberta'].includes(s.status));
            solicitacaoId = preferida ? .id || solicitacoes[0] ? .id || null;
        }

        function obterSolicitacao() {
            const solicitacao = solicitacaoId ? DB.getSolicitacaoPorId(solicitacaoId) : null;
            return solicitacao ? .clienteId === usuario.id ? solicitacao : null;
        }

        function aceitar(orcamentoId, solicitacao) {
            const resultado = DB.aceitarOrcamento(orcamentoId);
            if (!resultado) {
                window.alert('Esta proposta não está mais disponível. Atualize a lista de orçamentos.');
                render();
                return;
            }
            window.location.href = `cliente-acompanhar.html?id=${encodeURIComponent(solicitacao.id)}`;
        }

        function render() {
            const solicitacao = obterSolicitacao();
            if (!solicitacao) {
                conteudo.innerHTML = `
        <div class="empty-state">
          <p>Você ainda não tem uma solicitação disponível para consultar.</p>
          <a class="btn btn-primary" href="cliente-solicitar.html">Solicitar um carreto</a>
        </div>`;
                return;
            }

            if (solicitacao.motoristaAceitoId) {
                const motorista = DB.getUsuarioPorId(solicitacao.motoristaAceitoId);
                conteudo.innerHTML = `
        <span class="eyebrow">RF-08 · Orçamento aceito</span>
        <div class="card request-summary">
          <div class="info-row"><span>Modalidade</span><strong>${UI.modalidadeLabel(solicitacao)}</strong></div>
          <div class="info-row"><span>Seguro</span><strong>${solicitacao.seguro ? `${UI.escapeHtml(solicitacao.seguro.nome)} · ${UI.dinheiro(solicitacao.seguro.valor)}` : 'Não contratado'}</strong></div>
        </div>
        <div class="card driver-card">
          <div class="avatar">${UI.escapeHtml(AUTH.iniciais(motorista?.nome || ''))}</div>
          <div class="driver-info">
            <div class="name">${UI.escapeHtml(motorista?.nome || 'Transportador')}</div>
            <div class="meta">${UI.escapeHtml(motorista?.veiculoTipo || 'Veículo')} · ${UI.dinheiro(solicitacao.valorAceito)}</div>
          </div>
          <span class="badge badge-success">Confirmado</span>
        </div>
        <a class="btn btn-primary" href="cliente-acompanhar.html?id=${encodeURIComponent(solicitacao.id)}">Acompanhar corrida</a>`;
      return;
    }

    const orcamentos = DB.getOrcamentosOrdenados(solicitacao.id, criterio);
    const idsDisponiveis = new Set(orcamentos.map(o => o.id));
    [...selecionados].forEach(id => {
      if (!idsDisponiveis.has(id)) selecionados.delete(id);
    });

    if (!orcamentos.length) {
      conteudo.innerHTML = `
        <span class="eyebrow">RF-07 · Propostas</span>
        <div class="card request-summary">
          <div class="info-row"><span>Modalidade</span><strong>${UI.modalidadeLabel(solicitacao)}</strong></div>
          <div class="info-row"><span>Montagem</span><strong>${solicitacao.necessitaMontador ? 'Solicitada' : 'Não solicitada'}</strong></div>
        </div>
        <p>Ainda não chegou nenhum orçamento para esta solicitação.</p>
        <a class="btn btn-outline" href="cliente-busca.html?id=${encodeURIComponent(solicitacao.id)}">Ver transportadores compatíveis</a>`;
      return;
    }

    conteudo.innerHTML = `
      <span class="eyebrow">RF-14/15 · Orçamentos</span>
      <div class="section-title">
        <h2>${orcamentos.length} proposta${orcamentos.length === 1 ? '' : 's'}</h2>
        <span class="badge badge-neutral">${UI.escapeHtml(solicitacao.tipoCarga)}</span>
      </div>

      <div class="card request-summary compact-summary">
        <div class="info-row"><span>Modalidade</span><strong>${UI.modalidadeLabel(solicitacao)}</strong></div>
        <div class="info-row"><span>Seguro</span><strong>${solicitacao.seguro ? `${UI.escapeHtml(solicitacao.seguro.nome)} · ${UI.dinheiro(solicitacao.seguro.valor)}` : 'Não contratado'}</strong></div>
        <div class="info-row"><span>Montagem</span><strong>${solicitacao.necessitaMontador ? 'Obrigatória' : 'Não solicitada'}</strong></div>
      </div>

      <div class="field">
        <label for="ordenacao">Ordenar por</label>
        <select id="ordenacao">
          <option value="valor">Menor valor</option>
          <option value="avaliacao">Melhor avaliação</option>
          <option value="prazo">Menor prazo até coleta</option>
          <option value="recente">Proposta mais recente</option>
        </select>
      </div>

      <div class="stack">
        ${orcamentos.map(orcamento => {
          const motorista = DB.getUsuarioPorId(orcamento.motoristaId) || {};
          return `
            <article class="card budget-card">
              <div class="budget-card-head">
                <label class="compare-check">
                  <input type="checkbox" data-select="${orcamento.id}" ${selecionados.has(orcamento.id) ? 'checked' : ''}>
                  Comparar
                </label>
                <span class="badge badge-neutral">${UI.escapeHtml(UI.dataHora(orcamento.criadoEm))}</span>
              </div>

              <div class="driver-card budget-driver">
                <div class="avatar">${UI.escapeHtml(AUTH.iniciais(motorista.nome || ''))}</div>
                <div class="driver-info">
                  <div class="name">${UI.escapeHtml(motorista.nome || 'Transportador')}</div>
                  <div class="meta">${UI.escapeHtml(motorista.veiculoTipo || 'Veículo não informado')} · ★ ${Number(motorista.avaliacaoMedia || 0).toFixed(1)} · ${Number(motorista.totalCorridas || 0)} corridas</div>
                </div>
              </div>

              <div class="budget-meta">
                <span>⏱ ${UI.escapeHtml(orcamento.prazo)}</span>
                <span>${motorista.ofereceMontagem ? '🛠 Montador disponível' : 'Sem montagem'}</span>
              </div>

              ${orcamento.mensagem ? `<p class="small-print budget-message">“${UI.escapeHtml(orcamento.mensagem)}”</p>` : ''}

              <div class="budget-actions">
                <span class="price-tag">${UI.dinheiro(orcamento.valor)}</span>
                <button class="btn btn-success btn-sm" type="button" data-accept="${orcamento.id}">Aceitar</button>
              </div>
            </article>`;
        }).join('')}
      </div>

      <button class="btn btn-outline" id="compararBtn" type="button" ${selecionados.size < 2 ? 'disabled' : ''}>
        Comparar selecionados (${selecionados.size})
      </button>
      <p class="small-print center compare-hint">Selecione pelo menos duas propostas para comparar lado a lado.</p>`;

    const ordenacao = document.getElementById('ordenacao');
    ordenacao.value = criterio;
    ordenacao.addEventListener('change', () => {
      criterio = ordenacao.value;
      render();
    });

    document.querySelectorAll('[data-select]').forEach(checkbox => {
      checkbox.addEventListener('change', () => {
        if (checkbox.checked) selecionados.add(checkbox.dataset.select);
        else selecionados.delete(checkbox.dataset.select);
        render();
      });
    });

    document.querySelectorAll('[data-accept]').forEach(button => {
      button.addEventListener('click', () => aceitar(button.dataset.accept, solicitacao));
    });

    document.getElementById('compararBtn').addEventListener('click', () => {
      if (selecionados.size < 2) return;
      const ids = [...selecionados].map(encodeURIComponent).join(',');
      window.location.href = `cliente-comparar-orcamentos.html?id=${encodeURIComponent(solicitacao.id)}&orcamentos=${ids}`;
    });
  }

  render();
})();
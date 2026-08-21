(() => {
    const usuario = AUTH.exigirSessao('cliente');
    if (!usuario) return;

    const DOM = { conteudo: document.getElementById('conteudo') };
    const textoSeguro = (valor, fallback = '—') => UI.escapeHtml(valor || fallback);

    // 1. CAPTURA E PREPARAÇÃO DOS DADOS
    const solicitacaoId = UI.queryParam('id');
    const ids = (UI.queryParam('orcamentos') || '').split(',').filter(Boolean);
    const solicitacao = solicitacaoId ? DB.getSolicitacaoPorId(solicitacaoId) : null;

    const orcamentos = ids
        .map(id => DB.getOrcamentoPorId(id))
        .filter(orcamento => orcamento && orcamento.solicitacaoId === solicitacaoId);

    // 2. VALIDAÇÕES (Early Returns limpos)
    if (!solicitacao || solicitacao.clienteId !== usuario.id || orcamentos.length < 2) {
        const linkVoltar = solicitacaoId ? `?id=${encodeURIComponent(solicitacaoId)}` : '';
        DOM.conteudo.innerHTML = `
      <div class="empty-state">
        <p>Selecione pelo menos duas propostas válidas para comparar.</p>
        <a class="btn btn-outline" href="cliente-orcamentos.html${linkVoltar}">Voltar aos orçamentos</a>
      </div>`;
        return;
    }

    if (solicitacao.motoristaAceitoId) {
        window.location.href = `cliente-acompanhar.html?id=${encodeURIComponent(solicitacao.id)}`;
        return;
    }

    // 3. REGRAS DE NEGÓCIO ISOLADAS
    function pontuarVeiculo(tipoVeiculo, volume) {
        const tipo = String(tipoVeiculo || '').toLowerCase();
        const volumeTexto = String(volume || '').toLowerCase();

        let capacidade = 1;
        if (tipo.includes('pickup')) capacidade = 2;
        if (tipo.includes('van') || tipo.includes('furg')) capacidade = 3;
        if (tipo.includes('caminh')) capacidade = 4;

        const alvo = volumeTexto.includes('grande') ? 4 : (volumeTexto.includes('médio') || volumeTexto.includes('medio') ? 3 : 1);
        return capacidade >= alvo ? 100 - (capacidade - alvo) : 50 - ((alvo - capacidade) * 10);
    }

    // Monta o array enriquecido
    const dados = orcamentos.map(orcamento => {
        const motorista = DB.getUsuarioPorId(orcamento.motoristaId) || {};
        return {
            orcamento,
            motorista,
            veiculoScore: pontuarVeiculo(motorista.veiculoTipo, solicitacao.volume),
            mensagemScore: String(orcamento.mensagem || '').trim().length
        };
    });

    // O "Placar Ideal" - Agrupa todos os recordes em um lugar só
    const recordes = {
        menorValor: Math.min(...dados.map(d => Number(d.orcamento.valor || 0))),
        melhorAvaliacao: Math.max(...dados.map(d => Number(d.motorista.avaliacaoMedia || 0))),
        menorPrazo: Math.min(...dados.map(d => DB.prazoEmMinutos(d.orcamento.prazo))),
        maisCorridas: Math.max(...dados.map(d => Number(d.motorista.totalCorridas || 0))),
        melhorVeiculo: Math.max(...dados.map(d => d.veiculoScore)),
        maiorMensagem: Math.max(...dados.map(d => d.mensagemScore)),
        temMontadorGeral: dados.some(d => d.motorista.ofereceMontagem)
    };

    // 4. CONSTRUTORES DE COMPONENTES VISUAIS
    function renderColunaComparacao(dado) {
        const { orcamento, motorista, veiculoScore, mensagemScore } = dado;

        // Convertendo valores para facilitar a comparação
        const valor = Number(orcamento.valor || 0);
        const avaliacao = Number(motorista.avaliacaoMedia || 0);
        const prazo = DB.prazoEmMinutos(orcamento.prazo);
        const corridas = Number(motorista.totalCorridas || 0);

        // Calculando quem ganha o selo "best" (CSS) antes de montar o HTML
        const classeValor = valor === recordes.menorValor ? 'best' : '';
        const classeAvaliacao = avaliacao === recordes.melhorAvaliacao ? 'best' : '';
        const classePrazo = prazo === recordes.menorPrazo ? 'best' : '';
        const classeVeiculo = veiculoScore === recordes.melhorVeiculo ? 'best' : '';
        const classeCorridas = corridas === recordes.maisCorridas ? 'best' : '';
        const classeMontagem = (recordes.temMontadorGeral && motorista.ofereceMontagem) ? 'best' : '';
        const classeMsg = (recordes.maiorMensagem > 0 && mensagemScore === recordes.maiorMensagem) ? 'best' : '';

        return `
      <div class="compare-column">
        <article class="card compare-card">
          <div class="center compare-driver">
            <div class="avatar avatar-large">${textoSeguro(AUTH.iniciais(motorista.nome))}</div>
            <h3>${textoSeguro(motorista.nome, 'Transportador')}</h3>
          </div>

          <div class="compare-item ${classeValor}"><small>Valor</small><strong>${UI.dinheiro(valor)}</strong></div>
          <div class="compare-item ${classeAvaliacao}"><small>Avaliação</small><strong>★ ${avaliacao.toFixed(1)}</strong></div>
          <div class="compare-item ${classePrazo}"><small>Prazo até coleta</small><strong>${textoSeguro(orcamento.prazo)}</strong></div>
          <div class="compare-item ${classeVeiculo}"><small>Tipo de veículo</small><strong>${textoSeguro(motorista.veiculoTipo)}</strong></div>
          <div class="compare-item ${classeCorridas}"><small>Corridas realizadas</small><strong>${corridas}</strong></div>
          <div class="compare-item ${classeMontagem}"><small>Montador</small><strong>${motorista.ofereceMontagem ? 'Disponível' : 'Não disponível'}</strong></div>
          
          <div class="compare-item compare-message ${classeMsg}">
            <small>Mensagem</small>
            <span>${orcamento.mensagem ? textoSeguro(orcamento.mensagem) : '—'}</span>
          </div>

          <button class="btn btn-success" type="button" data-accept="${orcamento.id}">Aceitar esta proposta</button>
        </article>
      </div>`;
    }

    function renderTelaPrincipal() {
        const seguroTexto = solicitacao.seguro ?
            `${textoSeguro(solicitacao.seguro.nome)} · ${UI.dinheiro(solicitacao.seguro.valor)}` :
            'Não contratado';
        const montagemTexto = solicitacao.necessitaMontador ? 'Sim' : 'Não';
        const urlVoltar = `cliente-orcamentos.html?id=${encodeURIComponent(solicitacao.id)}`;

        DOM.conteudo.innerHTML = `
      <span class="eyebrow">RF-15 · Comparação lado a lado</span>
      <div class="section-title compare-title">
        <h2>Compare ${dados.length} propostas</h2>
        <a class="text-link" href="${urlVoltar}">Alterar seleção</a>
      </div>

      <div class="card request-summary compact-summary">
        <div class="info-row"><span>Frete</span><strong>${UI.modalidadeLabel(solicitacao)}</strong></div>
        <div class="info-row"><span>Seguro</span><strong>${seguroTexto}</strong></div>
        <div class="info-row"><span>Montagem exigida</span><strong>${montagemTexto}</strong></div>
      </div>

      <div class="compare-grid">
        ${dados.map(renderColunaComparacao).join('')}
      </div>

      <p class="small-print center compare-hint">O destaque indica a melhor opção do critério. Para veículo, considera-se a adequação ao volume informado; para mensagem, a proposta mais detalhada. Empates também são destacados.</p>`;
    }

    // 5. EXECUÇÃO
    renderTelaPrincipal();

    // 6. EVENTOS
    document.querySelectorAll('[data-accept]').forEach(button => {
        button.addEventListener('click', () => {
            const resultado = DB.aceitarOrcamento(button.dataset.accept);
            if (!resultado) {
                window.alert('Esta proposta não está mais disponível.');
                window.location.href = `cliente-orcamentos.html?id=${encodeURIComponent(solicitacao.id)}`;
                return;
            }
            window.location.href = `cliente-acompanhar.html?id=${encodeURIComponent(solicitacao.id)}`;
        });
    });
})();
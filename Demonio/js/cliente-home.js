(() => {
    const usuario = AUTH.exigirSessao('cliente');
    if (!usuario) return;

    document.getElementById('saudacao').textContent = `Olá, ${UI.primeiroNome(usuario.nome)}`;

    // 1. DICIONÁRIO DE STATUS (Acaba com os ternários infinitos)
    const STATUS_CORRIDA = [
        'A caminho da coleta', // etapaCorrida: 0
        'Carga coletada', // etapaCorrida: 1
        'Em trânsito', // etapaCorrida: 2
        'Entregue' // etapaCorrida: 3
    ];

    // 2. BUSCA E FILTRAGEM DOS DADOS
    const solicitacoes = DB.getSolicitacoesDoCliente(usuario.id);
    const ativa = solicitacoes.find(s => ['aceita', 'em_andamento'].includes(s.status));
    const abertas = solicitacoes.filter(s => ['aberta', 'orcamentos_recebidos'].includes(s.status));
    const concluidas = solicitacoes.filter(s => s.status === 'concluida');

    // 3. FUNÇÕES "CONSTRUTORAS" DE TELA (Componentes)

    function renderizarCorridaAtiva(solicitacao) {
        const box = document.getElementById('corridaAtivaBox');
        if (!box || !solicitacao) return;

        const motorista = DB.getUsuarioPorId(solicitacao.motoristaAceitoId) || {};
        const status = STATUS_CORRIDA[solicitacao.etapaCorrida] || 'Status desconhecido';

        // Pequenos blocos condicionais limpos
        const modalidadeHtml = solicitacao.modalidade === 'agendada' ?
            `<div class="schedule-line">${UI.modalidadeLabel(solicitacao)}</div>` : '';

        box.innerHTML = `
      <a href="cliente-acompanhar.html?id=${encodeURIComponent(solicitacao.id)}">
        <div class="card driver-card clickable-card">
          <div class="avatar">${UI.escapeHtml(AUTH.iniciais(motorista.nome || ''))}</div>
          <div class="driver-info">
            <div class="name">${UI.escapeHtml(motorista.nome || 'Transportador')}</div>
            <div class="meta">${UI.escapeHtml(motorista.veiculoTipo || 'Veículo')} · ${status}</div>
            ${modalidadeHtml}
          </div>
          <span class="badge badge-success">Ativo</span>
        </div>
      </a>`;
    }

    function renderizarAbertas(lista) {
        const box = document.getElementById('solicitacoesAbertasBox');
        if (!box) return;

        if (!lista.length) {
            box.innerHTML = '<p class="small-print">Nenhuma solicitação aguardando orçamento.</p>';
            return;
        }

        box.innerHTML = lista.map(solicitacao => {
            const qtd = DB.getOrcamentosDaSolicitacao(solicitacao.id).length;

            const badgeHtml = qtd ?
                `<span class="badge badge-success">${qtd} orçamento${qtd > 1 ? 's' : ''}</span>` :
                `<span class="badge badge-pending">Aguardando</span>`;

            const montadorHtml = solicitacao.necessitaMontador ?
                '<div class="schedule-line">🛠 Montagem solicitada</div>' : '';

            return `
        <a href="cliente-orcamentos.html?id=${encodeURIComponent(solicitacao.id)}">
          <div class="card clickable-card">
            <div class="card-row-between">
              <div>
                <div class="card-title">${UI.escapeHtml(solicitacao.tipoCarga)} · ${UI.resumoEndereco(solicitacao.origem)} → ${UI.resumoEndereco(solicitacao.destino)}</div>
                <div class="small-print">${UI.modalidadeLabel(solicitacao)}</div>
                ${montadorHtml}
              </div>
              ${badgeHtml}
            </div>
          </div>
        </a>`;
        }).join('');
    }

    function renderizarHistorico(lista) {
        const box = document.getElementById('historicoBox');
        if (!box || !lista.length) return;

        box.innerHTML = lista.map(solicitacao => {
            const assinaturaHtml = solicitacao.recebimento ?
                '<div class="schedule-line">✓ Comprovante assinado disponível</div>' :
                '<div class="schedule-line warning-text">Assinatura de recebimento pendente</div>';

            const avaliacaoBadge = solicitacao.avaliada ?
                '<span class="badge badge-neutral">Avaliado</span>' :
                '<span class="badge badge-pending">Avaliar</span>';

            return `
        <a href="cliente-acompanhar.html?id=${encodeURIComponent(solicitacao.id)}">
          <div class="card clickable-card">
            <div class="card-row-between">
              <div>
                <div class="card-title">${UI.escapeHtml(solicitacao.tipoCarga)} · ${UI.resumoEndereco(solicitacao.origem)} → ${UI.resumoEndereco(solicitacao.destino)}</div>
                <div class="small-print">${UI.escapeHtml(UI.data(solicitacao.criadaEm))} · Concluído</div>
                ${assinaturaHtml}
              </div>
              ${avaliacaoBadge}
            </div>
          </div>
        </a>`;
        }).join('');
    }

    // 4. EXECUÇÃO PRINCIPAL LIMPA (O maestro da tela)
    renderizarCorridaAtiva(ativa);
    renderizarAbertas(abertas);
    renderizarHistorico(concluidas);
})();
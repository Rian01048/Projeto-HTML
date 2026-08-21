(() => {
    const usuario = AUTH.exigirSessao('motorista');
    if (!usuario) return;

    // 1. MAPEAMENTO DO DOM (Tirando a sujeira do meio do código)
    const DOM = {
        saudacao: document.getElementById('saudacao'),
        toggle: document.getElementById('toggleOnline'),
        statusTexto: document.getElementById('statusTexto'),
        lista: document.getElementById('listaSolicitacoes'),
        corridaAtiva: document.getElementById('corridaAtivaBox')
    };

    // Inicialização básica
    DOM.saudacao.textContent = `Olá, ${UI.primeiroNome(usuario.nome)}`;
    DOM.toggle.checked = !!usuario.online;

    // 2. COMPONENTES E ATUALIZAÇÕES DE TELA
    function atualizarTextoStatus() {
        DOM.statusTexto.textContent = DOM.toggle.checked ?
            'Disponível para corridas' :
            'Indisponível no momento';
    }

    function renderizarSolicitacoes() {
        // Early return se estiver offline
        if (!DOM.toggle.checked) {
            DOM.lista.innerHTML = '<p class="small-print">Fique disponível para ver novas solicitações.</p>';
            return;
        }

        const abertas = DB.getSolicitacoesAbertas(usuario.id)
            .filter(solicitacao => !DB.motoristaJaOrcou(solicitacao.id, usuario.id));

        // Early return se não tiver corrida
        if (!abertas.length) {
            DOM.lista.innerHTML = '<p class="small-print">Nenhuma solicitação nova compatível no momento.</p>';
            return;
        }

        // Renderização limpa extraindo lógica do HTML
        DOM.lista.innerHTML = abertas.map(solicitacao => {
            const volumeFormatado = UI.escapeHtml(String(solicitacao.volume || '').split('—')[0].trim().toLowerCase());

            const badgeAgendamento = solicitacao.modalidade === 'agendada' ?
                '<span class="badge badge-neutral">Agendada</span>' :
                '<span class="badge badge-pending">Nova</span>';

            const montadorHtml = solicitacao.necessitaMontador ?
                '<div class="schedule-line">🛠 Requer montagem de móveis</div>' :
                '';

            const seguroHtml = solicitacao.seguro ?
                `<div class="schedule-line">🛡 Seguro ${UI.escapeHtml(solicitacao.seguro.nome)} · cobertura ${UI.dinheiro(solicitacao.seguro.limite)}</div>` :
                '<div class="schedule-line">Sem seguro de carga</div>';

            return `
        <article class="card request-card">
          <div class="card-row-between align-start">
            <div>
              <div class="card-title">${UI.escapeHtml(solicitacao.tipoCarga)}</div>
              <div class="small-print">${UI.resumoEndereco(solicitacao.origem)} → ${UI.resumoEndereco(solicitacao.destino)} · ${volumeFormatado}</div>
              <div class="schedule-line">${UI.modalidadeLabel(solicitacao)}</div>
              ${montadorHtml}
              ${seguroHtml}
            </div>
            ${badgeAgendamento}
          </div>
          <a class="btn btn-primary btn-sm request-action" href="motorista-orcar.html?id=${encodeURIComponent(solicitacao.id)}">Ver e enviar orçamento</a>
        </article>`;
        }).join('');
    }

    function renderizarCorridaAtiva() {
        const ativa = DB.getSolicitacaoAtivaDoMotorista(usuario.id);

        if (!ativa) {
            DOM.corridaAtiva.innerHTML = '<p class="small-print">Nenhuma corrida ativa no momento.</p>';
            return;
        }

        const cliente = DB.getUsuarioPorId(ativa.clienteId) || {};

        // Preparando as variáveis antes de injetar no HTML
        const iniciaisCliente = UI.escapeHtml(AUTH.iniciais(cliente.nome || ''));
        const nomeCliente = UI.escapeHtml(cliente.nome || 'Cliente');
        const modalidadeHtml = ativa.modalidade === 'agendada' ?
            `<div class="schedule-line">${UI.modalidadeLabel(ativa)}</div>` :
            '';

        DOM.corridaAtiva.innerHTML = `
      <a href="motorista-corrida.html?id=${encodeURIComponent(ativa.id)}">
        <div class="card driver-card clickable-card">
          <div class="avatar">${iniciaisCliente}</div>
          <div class="driver-info">
            <div class="name">${nomeCliente}</div>
            <div class="meta">Orçamento aceito · ${UI.dinheiro(ativa.valorAceito)}</div>
            ${modalidadeHtml}
          </div>
          <span class="badge badge-success">Ativo</span>
        </div>
      </a>`;
    }

    // 3. OUVINTES DE EVENTOS (O que o usuário faz)
    DOM.toggle.addEventListener('change', () => {
        // Atualiza o "banco de dados" e a sessão atual
        const atualizado = DB.atualizarUsuario(usuario.id, { online: DOM.toggle.checked });
        if (atualizado) Object.assign(usuario, atualizado);

        // Reflete na tela
        atualizarTextoStatus();
        renderizarSolicitacoes();
    });

    // 4. START (O maestro que puxa a orquestra quando a página carrega)
    atualizarTextoStatus();
    renderizarSolicitacoes();
    renderizarCorridaAtiva();
})();
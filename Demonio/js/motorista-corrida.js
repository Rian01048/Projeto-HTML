(() => {
    const usuario = AUTH.exigirSessao('motorista');
    if (!usuario) return;

    const DOM = { conteudo: document.getElementById('conteudo') };
    const textoSeguro = (valor, fallback = '—') => UI.escapeHtml(valor || fallback);

    let solicitacaoId = UI.queryParam('id');
    if (!solicitacaoId) {
        solicitacaoId = DB.getSolicitacaoAtivaDoMotorista(usuario.id) ? .id || null;
    }

    const ETAPAS = [
        { pct: 20, label: 'A caminho da coleta' },
        { pct: 50, label: 'Carga coletada' },
        { pct: 80, label: 'Em trânsito' },
        { pct: 100, label: 'Entregue' }
    ];

    // 1. COMPONENTE DE ESTADO VAZIO
    function renderEstadoVazio() {
        DOM.conteudo.innerHTML = `
      <div class="empty-state">
        <p>Nenhuma corrida ativa no momento. Envie orçamentos na tela inicial para receber novas corridas.</p>
        <a class="btn btn-outline" href="motorista-home.html">Ver solicitações</a>
      </div>`;
    }

    // 2. RENDERIZADOR PRINCIPAL
    function render() {
        const solicitacao = solicitacaoId ? DB.getSolicitacaoPorId(solicitacaoId) : null;

        if (!solicitacao || solicitacao.motoristaAceitoId !== usuario.id) {
            return renderEstadoVazio();
        }

        // Preparação de dados
        const cliente = DB.getUsuarioPorId(solicitacao.clienteId) || {};
        const indiceEtapa = Math.max(0, Math.min(Number(solicitacao.etapaCorrida || 0), ETAPAS.length - 1));
        const statusEtapa = ETAPAS[indiceEtapa];
        const concluida = solicitacao.status === 'concluida';

        const enderecoAlternativo = solicitacao.enderecoAlternativoId ?
            DB.getEnderecoConfiancaPorId(solicitacao.enderecoAlternativoId) :
            null;

        const destinoFinal = enderecoAlternativo ? .endereco || solicitacao.destino;
        const resumoDestino = UI.resumoEndereco(destinoFinal);

        // Blocos condicionais isolados
        const agendamentoHtml = (solicitacao.modalidade === 'agendada' && solicitacao.agendadoPara) ?
            `<div class="card schedule-card">
           <strong>🗓 Frete agendado</strong>
           <span>${textoSeguro(UI.dataHora(solicitacao.agendadoPara, { dateStyle: 'full' }))}</span>
         </div>` :
            '';

        const responsavelHtml = enderecoAlternativo ?
            `<div class="info-row"><span>Responsável</span><strong>${textoSeguro(enderecoAlternativo.responsavel)}</strong></div>` :
            '';

        const seguroTexto = solicitacao.seguro ?
            `${textoSeguro(solicitacao.seguro.nome)} · cobertura ${UI.dinheiro(solicitacao.seguro.limite)}` :
            'Sem seguro';

        const acaoRodapeHtml = concluida ?
            `<div class="card receipt-ok">
           <strong>Entrega marcada como concluída</strong>
           <p class="small-print receipt-destination">A avaliação do cliente será liberada após a assinatura do recebimento.</p>
         </div>
         <a class="btn btn-outline" href="motorista-home.html">Voltar ao início</a>` :
            `<button class="btn btn-primary" id="avancarBtn" type="button">Simular avanço da corrida</button>`;

        const labelStatus = concluida ? 'Entrega concluída' : textoSeguro(statusEtapa.label);

        // Injeção do HTML
        DOM.conteudo.innerHTML = `
      <span class="eyebrow">RF-08 · Corrida aceita</span>

      <div class="map-box">
        <span class="pin pin-you">🚚</span>
        <span class="pin pin-driver2">📍</span>
        <span class="label">${labelStatus}</span>
      </div>

      <div class="route-track">
        <div class="fill" style="width:${statusEtapa.pct}%;"></div>
        <div class="truck" style="left:${statusEtapa.pct}%;">🚚</div>
      </div>
      
      <div class="route-labels">
        <span class="done">Aceito</span>
        <span class="${statusEtapa.pct >= 50 ? 'done' : ''}">Coleta</span>
        <span class="${statusEtapa.pct >= 80 ? 'done' : ''}">Em trânsito</span>
        <span class="${statusEtapa.pct >= 100 ? 'done' : ''}">Entrega</span>
      </div>

      ${agendamentoHtml}

      <div class="card">
        <div class="info-row"><span>Seguro</span><strong>${seguroTexto}</strong></div>
        <div class="info-row"><span>Montagem</span><strong>${solicitacao.necessitaMontador ? 'Solicitada' : 'Não solicitada'}</strong></div>
        <div class="info-row"><span>Destino final</span><strong>${textoSeguro(destinoFinal)}</strong></div>
        ${responsavelHtml}
      </div>

      <div class="card driver-card">
        <div class="avatar">${textoSeguro(AUTH.iniciais(cliente.nome))}</div>
        <div class="driver-info">
          <div class="name">${textoSeguro(cliente.nome, 'Cliente')}</div>
          <div class="meta">${UI.resumoEndereco(solicitacao.origem)} → ${resumoDestino} · ${UI.dinheiro(solicitacao.valorAceito)}</div>
        </div>
      </div>

      <div class="field-row action-row">
        <a class="flex-action" href="motorista-chat.html?solicitacaoId=${encodeURIComponent(solicitacao.id)}"><span class="btn btn-outline">💬 Chat</span></a>
        <a class="flex-action" href="tel:+5571988888888"><span class="btn btn-outline">📞 Ligar</span></a>
      </div>

      ${acaoRodapeHtml}`;

        // --- VINCULAÇÃO DE EVENTOS ---
        const btnAvancar = document.getElementById('avancarBtn');
        if (btnAvancar) {
            btnAvancar.addEventListener('click', () => {
                DB.avancarEtapaCorrida(solicitacao.id);
                render(); // Atualiza a tela com o próximo estágio da entrega
            });
        }
    }

    // Inicialização
    render();
})();
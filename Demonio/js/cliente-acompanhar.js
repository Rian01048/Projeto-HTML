(() => {
    const usuario = AUTH.exigirSessao('cliente');
    if (!usuario) return;

    const DOM = { conteudo: document.getElementById('conteudo') };
    const textoSeguro = (valor, fallback = '—') => UI.escapeHtml(valor || fallback);

    let solicitacaoId = UI.queryParam('id');
    if (!solicitacaoId) {
        solicitacaoId = DB.getSolicitacaoAtivaDoCliente(usuario.id) ? .id || null;
    }

    const ETAPAS = [
        { pct: 20, label: 'A caminho da coleta' },
        { pct: 50, label: 'Carga coletada' },
        { pct: 80, label: 'Em trânsito' },
        { pct: 100, label: 'Entregue' }
    ];


    // ==========================================
    // COMPONENTES DE TELA (Fatiando o monstro)
    // ==========================================

    function renderComprovante(solicitacao) {
        if (!solicitacao.recebimento) return '';
        const r = solicitacao.recebimento;
        const tipoRecebedor = r.tipoRecebedor === 'alternativo' ? 'Ponto alternativo' : 'Solicitante';
        const local = r.enderecoRecebimento || solicitacao.destino;

        return `
      <section class="card receipt-ok receipt-card">
        <div class="section-title receipt-title">
          <h3>✓ Recebimento confirmado</h3>
          <span class="badge badge-success">RF-17</span>
        </div>
        <div class="info-row"><span>Recebedor</span><strong>${textoSeguro(r.nomeRecebedor)}</strong></div>
        <div class="info-row"><span>Tipo</span><strong>${tipoRecebedor}</strong></div>
        <div class="info-row"><span>Local</span><strong>${textoSeguro(local)}</strong></div>
        <div class="info-row"><span>Registrado em</span><strong>${textoSeguro(UI.dataHora(r.registradoEm))}</strong></div>
        <div class="receipt-signature-wrap">
          <span class="small-print">Assinatura registrada</span>
          <img class="receipt-signature" src="${r.assinaturaDataUrl}" alt="Assinatura de ${textoSeguro(r.nomeRecebedor)}">
        </div>
      </section>`;
    }

    function renderSecaoEnderecoAlternativo(solicitacao) {
        const enderecos = DB.getEnderecosConfianca(usuario.id);

        if (!enderecos.length) {
            return `
        <fieldset>
          <legend>RF-16 · Ponto de entrega alternativo</legend>
          <p class="small-print">Cadastre um endereço de confiança no seu perfil para usar esta opção.</p>
          <a class="btn btn-outline btn-sm" href="cliente-perfil.html">Cadastrar endereço</a>
        </fieldset>`;
        }

        const opcoesHtml = enderecos.map(e => `
      <option value="${e.id}" ${solicitacao.enderecoAlternativoId === e.id ? 'selected' : ''}>
        ${textoSeguro(e.apelido)} — ${textoSeguro(e.responsavel)}
      </option>`).join('');

        return `
      <fieldset>
        <legend>RF-16 · Ponto de entrega alternativo</legend>
        <div class="field">
          <label for="enderecoAlternativo">Destino desta entrega</label>
          <select id="enderecoAlternativo">
            <option value="">Endereço original — ${textoSeguro(solicitacao.destino)}</option>
            ${opcoesHtml}
          </select>
        </div>
        <button class="btn btn-outline btn-sm" id="salvarAlternativo" type="button">Salvar destino de recebimento</button>
        <div id="statusAlternativo" class="small-print inline-status" aria-live="polite"></div>
      </fieldset>`;
    }

    function renderDestinoConcluido(solicitacao) {
        const altId = solicitacao.enderecoAlternativoId;
        const enderecoAlternativo = altId ? DB.getEnderecoConfiancaPorId(altId) : null;

        const textoDestino = enderecoAlternativo ?
            `${textoSeguro(enderecoAlternativo.apelido)} — ${textoSeguro(enderecoAlternativo.responsavel)}<br>${textoSeguro(enderecoAlternativo.endereco)}` :
            `Endereço original — ${textoSeguro(solicitacao.destino)}`;

        return `
      <div class="card">
        <strong>Destino de recebimento</strong>
        <p class="receipt-destination">${textoDestino}</p>
      </div>`;
    }

    function renderAcoesFinais(solicitacao) {
        if (!solicitacao.recebimento) {
            return `<a class="btn btn-primary" href="cliente-recebimento.html?id=${encodeURIComponent(solicitacao.id)}">Assinar confirmação de recebimento</a>`;
        }
        const textoBotao = solicitacao.avaliada ? 'Ver status da avaliação' : 'Ir para avaliação';
        return `<a class="btn btn-primary" href="cliente-avaliar.html?id=${encodeURIComponent(solicitacao.id)}">${textoBotao}</a>`;
    }


    // ==========================================
    // RENDERIZADOR PRINCIPAL
    // ==========================================
    function render() {
        const solicitacao = solicitacaoId ? DB.getSolicitacaoPorId(solicitacaoId) : null;

        // Early Return se a solicitação não for válida
        if (!solicitacao || solicitacao.clienteId !== usuario.id || !solicitacao.motoristaAceitoId) {
            DOM.conteudo.innerHTML = `
        <div class="empty-state">
          <p>Você não tem nenhuma corrida para acompanhar no momento.</p>
          <a class="btn btn-primary" href="cliente-solicitar.html">Solicitar um carreto</a>
        </div>`;
            return;
        }

        // Preparação dos dados
        const motorista = DB.getUsuarioPorId(solicitacao.motoristaAceitoId) || {};
        const indiceEtapa = Math.max(0, Math.min(Number(solicitacao.etapaCorrida || 0), ETAPAS.length - 1));
        const statusEtapa = ETAPAS[indiceEtapa];
        const concluida = solicitacao.status === 'concluida';

        // Blocos condicionais isolados
        const agendamentoHtml = (solicitacao.modalidade === 'agendada' && solicitacao.agendadoPara) ?
            `<div class="card schedule-card">
           <strong>🗓 Frete agendado</strong>
           <span>${textoSeguro(UI.dataHora(solicitacao.agendadoPara, { dateStyle: 'full' }))}</span>
         </div>` :
            '';

        const segHtml = solicitacao.seguro ?
            `${textoSeguro(solicitacao.seguro.nome)} · ${UI.dinheiro(solicitacao.seguro.valor)}` :
            'Não contratado';

        const secaoDinamicaHtml = concluida ?
            renderDestinoConcluido(solicitacao) :
            renderSecaoEnderecoAlternativo(solicitacao);

        const rodapeAcaoHtml = concluida ?
            `${renderComprovante(solicitacao)}${renderAcoesFinais(solicitacao)}` :
            '<button class="btn btn-primary" id="avancarBtn" type="button">Simular avanço da corrida</button>';

        // Injeção do HTML limpo
        DOM.conteudo.innerHTML = `
      <span class="eyebrow">Rastreamento da corrida</span>
      ${agendamentoHtml}

      <div class="map-box">
        <span class="pin pin-you">📍</span>
        <span class="pin pin-driver1">🚚</span>
        <span class="label">${textoSeguro(UI.primeiroNome(motorista.nome))} ${concluida ? 'chegou ao destino' : 'está a caminho'}</span>
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

      <div class="card driver-card">
        <div class="avatar">${textoSeguro(AUTH.iniciais(motorista.nome))}</div>
        <div class="driver-info">
          <div class="name">${textoSeguro(motorista.nome, 'Transportador')}</div>
          <div class="meta">${textoSeguro(motorista.veiculoTipo, 'Veículo')} · ${textoSeguro(motorista.veiculoPlaca, 'Placa não informada')} · ★ ${Number(motorista.avaliacaoMedia || 0).toFixed(1)}</div>
        </div>
        <span class="badge badge-success">${textoSeguro(statusEtapa.label)}</span>
      </div>

      <div class="card">
        <div class="info-row"><span>Valor do frete</span><strong>${UI.dinheiro(solicitacao.valorAceito)}</strong></div>
        <div class="info-row"><span>Seguro</span><strong>${segHtml}</strong></div>
        <div class="info-row"><span>Montagem</span><strong>${solicitacao.necessitaMontador ? 'Solicitada' : 'Não solicitada'}</strong></div>
      </div>

      ${secaoDinamicaHtml}

      <div class="field-row action-row">
        <a class="flex-action" href="cliente-chat.html?motoristaId=${encodeURIComponent(motorista.id || '')}&solicitacaoId=${encodeURIComponent(solicitacao.id)}"><span class="btn btn-outline">💬 Chat</span></a>
        <a class="flex-action" href="tel:+5571999999999"><span class="btn btn-outline">📞 Ligar</span></a>
      </div>

      ${rodapeAcaoHtml}`;

        // --- VINCULAÇÃO DE EVENTOS ---
        if (!concluida) {
            const btnSalvarAlt = document.getElementById('salvarAlternativo');
            if (btnSalvarAlt) {
                btnSalvarAlt.addEventListener('click', () => {
                    const enderecoId = document.getElementById('enderecoAlternativo').value || null;
                    const resultado = DB.definirEnderecoAlternativo(solicitacao.id, enderecoId);
                    const statusEl = document.getElementById('statusAlternativo');
                    statusEl.textContent = resultado ? 'Destino de recebimento atualizado.' : 'Não foi possível atualizar o destino.';
                });
            }

            document.getElementById('avancarBtn') ? .addEventListener('click', () => {
                DB.avancarEtapaCorrida(solicitacao.id);
                render(); // Atualiza a tela para o próximo passo da corrida
            });
        }
    }

    // Inicialização
    render();
})();
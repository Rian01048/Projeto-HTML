(() => {
    const usuario = AUTH.exigirSessao('cliente');
    if (!usuario) return;

    const DOM = { conteudo: document.getElementById('conteudo') };
    const textoSeguro = (valor, fallback = '—') => UI.escapeHtml(valor || fallback);

    // 1. CAPTURA E VALIDAÇÃO INICIAL
    const solicitacaoId = UI.queryParam('id');
    const solicitacao = solicitacaoId ? DB.getSolicitacaoPorId(solicitacaoId) : null;

    if (!solicitacao || solicitacao.clienteId !== usuario.id || solicitacao.status !== 'concluida') {
        DOM.conteudo.innerHTML = `
      <div class="empty-state">
        <p>A confirmação de recebimento só fica disponível após a entrega ser concluída.</p>
        <a class="btn btn-outline" href="cliente-home.html">Voltar ao início</a>
      </div>`;
        return;
    }

    if (solicitacao.recebimento) {
        window.location.href = `cliente-acompanhar.html?id=${encodeURIComponent(solicitacao.id)}`;
        return;
    }

    // 2. PREPARAÇÃO DOS DADOS DA TELA
    const enderecoAlternativo = solicitacao.enderecoAlternativoId ?
        DB.getEnderecoConfiancaPorId(solicitacao.enderecoAlternativoId) :
        null;

    const nomePadrao = enderecoAlternativo ? .responsavel || usuario.nome;
    const enderecoRecebimento = enderecoAlternativo ? .endereco || solicitacao.destino;

    // Textos dinâmicos extraídos do HTML
    const tipoRecebedorTexto = enderecoAlternativo ? 'Ponto alternativo' : 'Solicitante';
    const descricaoTexto = enderecoAlternativo ?
        'O responsável pelo ponto de entrega alternativo deve preencher e assinar abaixo.' :
        'Confirme quem recebeu a encomenda e registre a assinatura.';

    // 3. MONTAGEM DO HTML
    DOM.conteudo.innerHTML = `
    <span class="eyebrow">RF-17 · Assinatura de recebimento</span>
    <h2>Comprovante de entrega</h2>
    <p>${descricaoTexto}</p>

    <div class="card request-summary">
      <div class="info-row"><span>Local de recebimento</span><strong>${textoSeguro(enderecoRecebimento)}</strong></div>
      <div class="info-row"><span>Tipo de recebedor</span><strong>${tipoRecebedorTexto}</strong></div>
    </div>

    <div class="field">
      <label for="nomeRecebedor">Nome completo de quem recebeu</label>
      <input id="nomeRecebedor" autocomplete="name" value="${textoSeguro(nomePadrao, '')}">
    </div>

    <div class="field">
      <label for="assinatura">Assinatura manuscrita</label>
      <canvas id="assinatura" class="signature-pad" width="900" height="360" aria-label="Área para assinatura manuscrita"></canvas>
      <div class="signature-actions">
        <span class="small-print">Use o mouse, caneta ou toque para assinar.</span>
        <button class="btn btn-ghost btn-sm" id="limpar" type="button">Limpar</button>
      </div>
    </div>

    <label class="toggle-option receipt-confirm">
      <input type="checkbox" id="confirmo">
      <span>
        <strong>Confirmo o recebimento da encomenda</strong>
        <small>Declaro que os itens foram entregues no local indicado.</small>
      </span>
    </label>

    <div id="erroRecebimento" class="form-error" hidden></div>
    <button class="btn btn-primary" id="salvar" type="button">Registrar recebimento</button>`;

    // 4. LÓGICA DO CANVAS E ASSINATURA
    const canvas = document.getElementById('assinatura');
    const contexto = canvas.getContext('2d');
    let desenhando = false;
    let assinou = false;

    contexto.lineWidth = 5;
    contexto.lineCap = 'round';
    contexto.lineJoin = 'round';
    contexto.strokeStyle = '#F7F4EC';

    function obterPosicao(evento) {
        const rect = canvas.getBoundingClientRect();
        return {
            x: (evento.clientX - rect.left) * (canvas.width / rect.width),
            y: (evento.clientY - rect.top) * (canvas.height / rect.height)
        };
    }

    function iniciarAssinatura(evento) {
        desenhando = true;
        assinou = true;
        canvas.setPointerCapture ? .(evento.pointerId);
        const ponto = obterPosicao(evento);
        contexto.beginPath();
        contexto.moveTo(ponto.x, ponto.y);
    }

    function desenharAssinatura(evento) {
        if (!desenhando) return;
        const ponto = obterPosicao(evento);
        contexto.lineTo(ponto.x, ponto.y);
        contexto.stroke();
    }

    function finalizarAssinatura(evento) {
        desenhando = false;
        if (evento ? .pointerId != null && canvas.hasPointerCapture ? .(evento.pointerId)) {
            canvas.releasePointerCapture(evento.pointerId);
        }
    }

    canvas.addEventListener('pointerdown', iniciarAssinatura);
    canvas.addEventListener('pointermove', desenharAssinatura);
    canvas.addEventListener('pointerup', finalizarAssinatura);
    canvas.addEventListener('pointercancel', finalizarAssinatura);
    canvas.addEventListener('pointerleave', evento => {
        if (evento.buttons === 0) finalizarAssinatura(evento);
    });

    document.getElementById('limpar').addEventListener('click', () => {
        contexto.clearRect(0, 0, canvas.width, canvas.height);
        assinou = false;
    });

    // 5. EVENTO DE SALVAR E REGISTRAR
    document.getElementById('salvar').addEventListener('click', () => {
        const erroEl = document.getElementById('erroRecebimento');
        UI.limparErro(erroEl);

        const nomeRecebedor = document.getElementById('nomeRecebedor').value.trim();
        const confirmou = document.getElementById('confirmo').checked;

        if (!nomeRecebedor || !assinou || !confirmou) {
            return UI.mostrarErro(erroEl, 'Informe o nome, faça a assinatura e confirme o recebimento.');
        }

        const recebimento = DB.registrarRecebimento(solicitacao.id, {
            nomeRecebedor,
            tipoRecebedor: enderecoAlternativo ? 'alternativo' : 'solicitante',
            enderecoRecebimento,
            assinaturaDataUrl: canvas.toDataURL('image/png')
        });

        if (!recebimento) {
            return UI.mostrarErro(erroEl, 'Não foi possível registrar o comprovante. Verifique o status da corrida.');
        }

        window.location.href = `cliente-acompanhar.html?id=${encodeURIComponent(solicitacao.id)}`;
    });
})();
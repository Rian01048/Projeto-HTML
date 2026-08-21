(() => {
    const usuario = AUTH.exigirSessao('motorista');
    if (!usuario) return;

    const DOM = {
        conteudo: document.getElementById('conteudo')
    };

    // Ajuda a evitar repetição de código no HTML
    const textoSeguro = (valor, fallback = '—') => UI.escapeHtml(valor || fallback);

    // ==========================================
    // TELA 1: VISUALIZAÇÃO DO PERFIL
    // ==========================================
    function renderVisualizacao() {
        // 1. Preparação das variáveis (Tirando a lógica do HTML)
        const nota = Number(usuario.avaliacaoMedia || 0).toFixed(1);
        const corridas = Number(usuario.totalCorridas || 0);
        const iniciais = textoSeguro(AUTH.iniciais(usuario.nome));

        const badgeVerificacao = usuario.verificado ?
            '<span class="badge badge-success profile-badge">Documentação verificada</span>' :
            '<span class="badge badge-pending profile-badge">Verificação pendente</span>';

        const classeMontagem = usuario.ofereceMontagem ? 'enabled' : '';
        const tituloMontagem = usuario.ofereceMontagem ?
            'Montagem de móveis habilitada' :
            'Montagem de móveis desabilitada';
        const descMontagem = usuario.ofereceMontagem ?
            'Você pode receber solicitações que exigem serviço de montagem.' :
            'Ative para receber solicitações de clientes que precisam de montagem.';

        // 2. Montagem limpa do HTML
        DOM.conteudo.innerHTML = `
      <span class="eyebrow">RF-02/13 · Dados do transportador</span>
      
      <div class="card center profile-hero">
        <div class="avatar avatar-profile">${iniciais}</div>
        <h2>${textoSeguro(usuario.nome)}</h2>
        <div class="rating">★★★★★ ${nota} · ${corridas} corridas</div>
        ${badgeVerificacao}
      </div>

      <div class="card">
        <div class="card-label">Documentação</div>
        <div class="field-row profile-data-row">
          <div class="field">
            <label>CNH</label>
            <div class="field-value">Categoria ${textoSeguro(usuario.cnhCategoria)}</div>
          </div>
          <div class="field">
            <label>Número</label>
            <div class="field-value">${textoSeguro(usuario.cnhNumero)}</div>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-label">Veículo cadastrado</div>
        <div class="field-row profile-data-row">
          <div class="field">
            <label>Modelo</label>
            <div class="field-value">${textoSeguro(usuario.veiculoModelo)} · ${textoSeguro(usuario.veiculoTipo)}</div>
          </div>
          <div class="field">
            <label>Placa</label>
            <div class="field-value">${textoSeguro(usuario.veiculoPlaca)}</div>
          </div>
        </div>
      </div>

      <div class="card service-card">
        <div class="card-label">RF-13 · Serviços adicionais</div>
        <div class="service-status ${classeMontagem}">
          <span class="service-icon">🛠</span>
          <div>
            <strong>${tituloMontagem}</strong>
            <p>${descMontagem}</p>
          </div>
        </div>
      </div>

      <div class="stack profile-actions">
        <button class="btn btn-outline" id="btnEditar" type="button">Editar dados e serviços</button>
        <button class="btn btn-ghost" id="btnSair" type="button">Sair da conta</button>
      </div>`;

        // 3. Eventos da Tela 1
        document.getElementById('btnEditar').addEventListener('click', renderEdicao);
        document.getElementById('btnSair').addEventListener('click', () => {
            AUTH.logout();
            window.location.href = 'index.html';
        });
    }


    // ==========================================
    // TELA 2: MODO EDIÇÃO
    // ==========================================
    function renderEdicao() {
        // 1. Preparação de variáveis
        const checkMontagem = usuario.ofereceMontagem ? 'checked' : '';

        // 2. Montagem do HTML
        DOM.conteudo.innerHTML = `
      <span class="eyebrow">RF-02/13 · Editar transportador</span>
      
      <div class="field">
        <label for="editNome">Nome completo</label>
        <input type="text" id="editNome" value="${textoSeguro(usuario.nome, '')}">
      </div>

      <fieldset>
        <legend>Veículo</legend>
        <div class="field">
          <label for="editModelo">Modelo</label>
          <input type="text" id="editModelo" value="${textoSeguro(usuario.veiculoModelo, '')}">
        </div>
        <div class="field-row">
          <div class="field">
            <label for="editPlaca">Placa</label>
            <input type="text" id="editPlaca" value="${textoSeguro(usuario.veiculoPlaca, '')}">
          </div>
          <div class="field">
            <label for="editAno">Ano</label>
            <input type="text" id="editAno" value="${textoSeguro(usuario.veiculoAno, '')}">
          </div>
        </div>
      </fieldset>

      <fieldset>
        <legend>RF-13 · Serviços adicionais</legend>
        <label class="toggle-option">
          <input type="checkbox" id="editMontagem" ${checkMontagem}>
          <span>
            <strong>Ofereço montagem de móveis</strong>
            <small>Ao ativar, você passa a ser compatível com solicitações que exigem montador.</small>
          </span>
        </label>
      </fieldset>

      <div class="stack">
        <button class="btn btn-primary" id="btnSalvar" type="button">Salvar alterações</button>
        <button class="btn btn-ghost" id="btnCancelar" type="button">Cancelar</button>
      </div>`;

        // 3. Eventos da Tela 2
        document.getElementById('btnSalvar').addEventListener('click', () => {
            const patch = {
                nome: document.getElementById('editNome').value.trim() || usuario.nome,
                veiculoModelo: document.getElementById('editModelo').value.trim(),
                veiculoPlaca: document.getElementById('editPlaca').value.trim().toUpperCase(),
                veiculoAno: document.getElementById('editAno').value.trim(),
                ofereceMontagem: document.getElementById('editMontagem').checked
            };

            const atualizado = DB.atualizarUsuario(usuario.id, patch);
            if (atualizado) Object.assign(usuario, atualizado);

            // Volta para a tela de visualização após salvar
            renderVisualizacao();
        });

        document.getElementById('btnCancelar').addEventListener('click', renderVisualizacao);
    }

    // Inicializa o fluxo renderizando a tela de visualização primeiro
    renderVisualizacao();
})();
(() => {
  const usuario = AUTH.exigirSessao('cliente');
  if (!usuario) return;

  const solicitacaoId = UI.queryParam('id');
  const solicitacao = solicitacaoId ? DB.getSolicitacaoPorId(solicitacaoId) : null;
  const lista = document.getElementById('listaMotoristas');
  const resumoBusca = document.getElementById('resumoBusca');
  const resumoSolicitacao = document.getElementById('resumoSolicitacao');

  if (!solicitacao || solicitacao.clienteId !== usuario.id) {
    resumoBusca.textContent = 'Solicitação não encontrada.';
    lista.innerHTML = '<a class="btn btn-outline" href="cliente-home.html">Voltar ao início</a>';
    if (resumoSolicitacao) resumoSolicitacao.hidden = true;
    return;
  }

  resumoBusca.textContent = solicitacao.necessitaMontador
    ? `Buscando transportadores disponíveis e habilitados para montagem de móveis.`
    : `Buscando transportadores compatíveis com ${solicitacao.tipoCarga.toLowerCase()} perto de você.`;

  if (resumoSolicitacao) {
    resumoSolicitacao.innerHTML = `
      <div class="info-row"><span>Modalidade</span><strong>${UI.modalidadeLabel(solicitacao)}</strong></div>
      <div class="info-row"><span>Seguro</span><strong>${solicitacao.seguro ? `${UI.escapeHtml(solicitacao.seguro.nome)} · ${UI.dinheiro(solicitacao.seguro.valor)}` : 'Não contratado'}</strong></div>
      <div class="info-row"><span>Montagem</span><strong>${solicitacao.necessitaMontador ? 'Obrigatória' : 'Não solicitada'}</strong></div>`;
  }

  const motoristas = DB.listarMotoristas({
    somenteOnline: true,
    ofereceMontagem: solicitacao.necessitaMontador ? true : null
  });
  const distancias = ['1,2 km', '2,0 km', '2,6 km', '3,1 km'];
  const chegadas = ['6 min', '9 min', '11 min', '14 min'];

  if (!motoristas.length) {
    lista.innerHTML = `
      <div class="card empty-state">
        <p>Nenhum transportador compatível está disponível no momento.</p>
        <a class="btn btn-outline" href="cliente-orcamentos.html?id=${encodeURIComponent(solicitacao.id)}">Ver orçamentos</a>
      </div>`;
    return;
  }

  lista.innerHTML = motoristas.map((motorista, index) => `
    <a href="cliente-perfil-motorista.html?motoristaId=${encodeURIComponent(motorista.id)}&solicitacaoId=${encodeURIComponent(solicitacao.id)}">
      <div class="card driver-card clickable-card">
        <div class="avatar">${UI.escapeHtml(AUTH.iniciais(motorista.nome))}</div>
        <div class="driver-info">
          <div class="name">${UI.escapeHtml(motorista.nome)}</div>
          <div class="meta">${UI.escapeHtml(motorista.veiculoTipo || 'Veículo não informado')} · ${distancias[index % distancias.length]} · chega em ${chegadas[index % chegadas.length]}</div>
          ${motorista.ofereceMontagem ? '<div class="schedule-line">🛠 Montagem disponível</div>' : ''}
        </div>
        <div class="rating">★ ${Number(motorista.avaliacaoMedia || 0).toFixed(1)}</div>
      </div>
    </a>`).join('');
})();

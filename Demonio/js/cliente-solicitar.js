(() => {
  const usuario = AUTH.exigirSessao('cliente');
  if (!usuario) return;

  // 1. MAPEAMENTO DE TELA (Guardamos todos os elementos HTML em um lugar só)
  const DOM = {
    erro: document.getElementById('erroForm'),
    agendamentoBox: document.getElementById('agendamentoBox'),
    data: document.getElementById('dataAgendada'),
    hora: document.getElementById('horaAgendada'),
    origem: document.getElementById('origem'),
    destino: document.getElementById('destino'),
    volume: document.getElementById('volume'),
    obs: document.getElementById('obs'),
    montador: document.getElementById('necessitaMontador'),
    btnBuscar: document.getElementById('btnBuscar'),
    chips: document.querySelectorAll('#cargaChips .chip'),
    radios: document.querySelectorAll('input[name="modalidade"]')
  };

  let cargaSelecionada = 'Móveis';
  DOM.data.min = UI.hojeMaisDias(0);

  // 2. COMPORTAMENTOS DA INTERFACE (Visuais)
  function alternarModalidade() {
    const isAgendada = document.querySelector('input[name="modalidade"]:checked')?.value === 'agendada';
    
    // Mostra ou esconde a caixa de data/hora
    DOM.agendamentoBox.hidden = !isAgendada;
    DOM.agendamentoBox.style.display = isAgendada ? 'flex' : 'none';
    
    // Atualiza o visual dos botões de agendamento (classe active)
    DOM.radios.forEach(radio => {
      radio.closest('.choice-card')?.classList.toggle('active', radio.checked);
    });
  }

  // Eventos de clique nos Chips de Carga
  DOM.chips.forEach(chip => {
    chip.addEventListener('click', () => {
      DOM.chips.forEach(c => c.classList.remove('active')); // Limpa todos
      chip.classList.add('active');                         // Ativa o clicado
      cargaSelecionada = chip.dataset.carga;                // Salva o valor
    });
  });

  // Escuta as mudanças entre "Imediata" e "Agendada"
  DOM.radios.forEach(radio => radio.addEventListener('change', alternarModalidade));

  // 3. AÇÃO PRINCIPAL: ENVIO DO FORMULÁRIO
  DOM.btnBuscar.addEventListener('click', () => {
    UI.limparErro(DOM.erro);

    const origem = DOM.origem.value.trim();
    const destino = DOM.destino.value.trim();
    const modalidade = document.querySelector('input[name="modalidade"]:checked')?.value || 'imediata';

    // Validações usando "Return Antecipado" (Early Return)
    if (!origem || !destino) {
      return UI.mostrarErro(DOM.erro, 'Preencha o endereço de coleta e de entrega para continuar.');
    }

    let agendadoPara = null;
    if (modalidade === 'agendada') {
      if (!DOM.data.value || !DOM.hora.value) {
        return UI.mostrarErro(DOM.erro, 'Informe a data e o horário do agendamento.');
      }

      agendadoPara = new Date(`${DOM.data.value}T${DOM.hora.value}:00`).getTime();
      
      if (!agendadoPara || agendadoPara <= Date.now()) {
        return UI.mostrarErro(DOM.erro, 'Escolha uma data e um horário futuros.');
      }
    }

    // Criação da requisição
    const solicitacao = DB.criarSolicitacao({
      clienteId: usuario.id,
      origem,
      destino,
      tipoCarga: cargaSelecionada,
      volume: DOM.volume.value,
      observacoes: DOM.obs.value.trim(),
      modalidade,
      agendadoPara,
      necessitaMontador: DOM.montador.checked
    });

    if (solicitacao.erro) {
      return UI.mostrarErro(DOM.erro, solicitacao.erro);
    }

    // Sucesso: Redireciona
    window.location.href = `cliente-seguro.html?id=${encodeURIComponent(solicitacao.id)}`;
  });

  // Inicializa a tela com o visual correto
  alternarModalidade();
})();
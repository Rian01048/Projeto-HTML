(() => {
    const usuario = AUTH.exigirSessao('cliente');
    if (!usuario) return;

    const DOM = { conteudo: document.getElementById('conteudo') };
    const textoSeguro = (valor, fallback = '—') => UI.escapeHtml(valor || fallback);


    // ==========================================
    // COMPONENTE: LISTA DE ENDEREÇOS
    // ==========================================
    function atualizarListaEnderecos() {
        const box = document.getElementById('enderecosBox');
        if (!box) return;

        const enderecos = DB.getEnderecosConfianca(usuario.id);

        // Early return para lista vazia
        if (!enderecos.length) {
            box.innerHTML = '<p class="small-print">Nenhum endereço de confiança cadastrado.</p>';
            return;
        }

        box.innerHTML = enderecos.map(endereco => `
      <article class="card trusted-address-card">
        <div class="trusted-address-content">
          <div>
            <strong>${textoSeguro(endereco.apelido)}</strong>
            <div class="small-print">Responsável: ${textoSeguro(endereco.responsavel)}</div>
            <div class="trusted-address-text">${textoSeguro(endereco.endereco)}</div>
          </div>
          <button class="btn btn-ghost btn-sm" type="button" data-remover="${endereco.id}">Remover</button>
        </div>
      </article>`).join('');

        // Eventos de remoção de endereço
        box.querySelectorAll('[data-remover]').forEach(button => {
            button.addEventListener('click', () => {
                const removido = DB.removerEnderecoConfianca(button.dataset.remover, usuario.id);

                if (!removido) {
                    return window.alert('Este endereço está sendo usado em uma corrida ativa e não pode ser removido agora.');
                }

                // Atualiza apenas a lista, sem piscar a página toda
                atualizarListaEnderecos();
            });
        });
    }


    // ==========================================
    // TELA 1: VISUALIZAR PERFIL (Home)
    // ==========================================
    function renderPerfil() {
        // 1. Preparação dos dados (limpa o HTML final)
        const iniciais = textoSeguro(AUTH.iniciais(usuario.nome));
        const nome = textoSeguro(usuario.nome);
        const email = textoSeguro(usuario.email);
        const idade = textoSeguro(usuario.idade);
        const nacionalidade = textoSeguro(usuario.nacionalidade);
        const cpf = textoSeguro(usuario.cpf);

        // 2. Montagem
        DOM.conteudo.innerHTML = `
      <span class="eyebrow">RF-01 · Dados pessoais</span>
      <div class="card center profile-hero">
        <div class="avatar avatar-profile">${iniciais}</div>
        <h2>${nome}</h2>
        <p>${email}</p>
      </div>

      <div class="card">
        <div class="field-row profile-data-row">
          <div class="field">
            <label>Idade</label>
            <div class="field-value">${idade}</div>
          </div>
          <div class="field">
            <label>Nacionalidade</label>
            <div class="field-value">${nacionalidade}</div>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="field profile-data-field">
          <label>CPF</label>
          <div class="field-value">${cpf}</div>
        </div>
      </div>

      <div class="divider"></div>
      
      <div class="section-title">
        <div>
          <span class="eyebrow">RF-16</span>
          <h2>Endereços de confiança</h2>
        </div>
        <button class="btn btn-outline btn-sm" id="btnNovoEndereco" type="button">Adicionar</button>
      </div>
      <p class="small-print">Cadastre vizinho, porteiro ou familiar que possa receber uma entrega no seu lugar.</p>
      
      <div id="enderecosBox" class="stack"></div>

      <div class="stack profile-actions">
        <button class="btn btn-outline" id="btnEditar" type="button">Editar dados</button>
        <button class="btn btn-ghost" id="btnSair" type="button">Sair da conta</button>
      </div>`;

        // 3. Injeta a lista dinâmica e ativa eventos
        atualizarListaEnderecos();

        document.getElementById('btnNovoEndereco').addEventListener('click', renderNovoEndereco);
        document.getElementById('btnEditar').addEventListener('click', renderEdicao);
        document.getElementById('btnSair').addEventListener('click', () => {
            AUTH.logout();
            window.location.href = 'index.html';
        });
    }


    // ==========================================
    // TELA 2: NOVO ENDEREÇO
    // ==========================================
    function renderNovoEndereco() {
        DOM.conteudo.innerHTML = `
      <span class="eyebrow">RF-16 · Novo ponto de entrega alternativo</span>
      <h2>Adicionar endereço de confiança</h2>
      <p>Este endereço poderá ser escolhido durante uma corrida em andamento.</p>

      <div class="field">
        <label for="endApelido">Identificação</label>
        <input id="endApelido" placeholder="Ex: Porteiro, Vizinha, Mãe">
      </div>
      <div class="field">
        <label for="endResponsavel">Nome do responsável</label>
        <input id="endResponsavel" placeholder="Nome completo de quem poderá receber">
      </div>
      <div class="field">
        <label for="endEndereco">Endereço completo</label>
        <textarea id="endEndereco" placeholder="Rua, número, complemento, bairro, cidade"></textarea>
      </div>
      
      <div id="erroEndereco" class="form-error" hidden></div>
      
      <button class="btn btn-primary" id="salvarEndereco" type="button">Salvar endereço de confiança</button>
      <button class="btn btn-ghost" id="cancelarEndereco" type="button">Cancelar</button>`;

        document.getElementById('salvarEndereco').addEventListener('click', () => {
            const containerErro = document.getElementById('erroEndereco');
            UI.limparErro(containerErro);

            const apelido = document.getElementById('endApelido').value.trim();
            const responsavel = document.getElementById('endResponsavel').value.trim();
            const endereco = document.getElementById('endEndereco').value.trim();

            if (!apelido || !responsavel || !endereco) {
                return UI.mostrarErro(containerErro, 'Preencha identificação, responsável e endereço.');
            }

            const criado = DB.criarEnderecoConfianca({ clienteId: usuario.id, apelido, responsavel, endereco });

            if (!criado) {
                return UI.mostrarErro(containerErro, 'Não foi possível cadastrar o endereço.');
            }

            // Sucesso: volta pro perfil
            renderPerfil();
        });

        document.getElementById('cancelarEndereco').addEventListener('click', renderPerfil);
    }


    // ==========================================
    // TELA 3: EDITAR PERFIL
    // ==========================================
    function renderEdicao() {
        DOM.conteudo.innerHTML = `
      <span class="eyebrow">RF-01 · Editar dados pessoais</span>
      
      <div class="field">
        <label for="editNome">Nome completo</label>
        <input type="text" id="editNome" value="${textoSeguro(usuario.nome, '')}">
      </div>
      
      <div class="field-row">
        <div class="field">
          <label for="editIdade">Idade</label>
          <input type="number" min="18" id="editIdade" value="${textoSeguro(usuario.idade, '')}">
        </div>
        <div class="field">
          <label for="editCpf">CPF</label>
          <input type="text" id="editCpf" value="${textoSeguro(usuario.cpf, '')}">
        </div>
      </div>
      
      <div class="field">
        <label for="editNacionalidade">Nacionalidade</label>
        <input type="text" id="editNacionalidade" value="${textoSeguro(usuario.nacionalidade, '')}">
      </div>
      
      <div class="stack">
        <button class="btn btn-primary" id="btnSalvar" type="button">Salvar alterações</button>
        <button class="btn btn-ghost" id="btnCancelar" type="button">Cancelar</button>
      </div>`;

        document.getElementById('btnSalvar').addEventListener('click', () => {
            const patch = {
                nome: document.getElementById('editNome').value.trim() || usuario.nome,
                idade: Number.parseInt(document.getElementById('editIdade').value, 10) || usuario.idade,
                cpf: document.getElementById('editCpf').value.trim() || usuario.cpf,
                nacionalidade: document.getElementById('editNacionalidade').value.trim() || usuario.nacionalidade
            };

            Object.assign(usuario, DB.atualizarUsuario(usuario.id, patch));

            // Volta pro perfil com dados atualizados
            renderPerfil();
        });

        document.getElementById('btnCancelar').addEventListener('click', renderPerfil);
    }

    // EXECUÇÃO INICIAL
    renderPerfil();
})();
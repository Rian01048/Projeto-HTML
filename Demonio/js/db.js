/* ============================================================
   CarretoUber — Persistência local e regras de negócio do MVP
   Dados salvos em localStorage sob a chave "carretouber_db".
   ============================================================ */

const DB_KEY = 'carretouber_db';
const DB_SCHEMA_VERSION = 2;

const DB = (() => {
  const PLANOS_SEGURO = Object.freeze([
    Object.freeze({ id: 'basico', nome: 'Básico', valor: 9.90, limite: 1000 }),
    Object.freeze({ id: 'intermediario', nome: 'Intermediário', valor: 19.90, limite: 3000 }),
    Object.freeze({ id: 'premium', nome: 'Premium', valor: 34.90, limite: 7000 })
  ]);

  function uid(prefix) {
    return `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;
  }

  function seed() {
    const now = Date.now();

    return {
      meta: { schemaVersion: DB_SCHEMA_VERSION },
      usuarios: [
        {
          id: 'u_cliente_demo',
          tipo: 'cliente',
          nome: 'Maria Eduarda Souza',
          email: 'maria@exemplo.com',
          senha: '123456',
          idade: 27,
          nacionalidade: 'Brasileira',
          cpf: '123.456.789-00'
        },
        {
          id: 'u_motorista_demo',
          tipo: 'motorista',
          nome: 'João Pereira',
          email: 'joao@exemplo.com',
          senha: '123456',
          idade: 34,
          nacionalidade: 'Brasileiro',
          cpf: '987.654.321-00',
          cnhNumero: '02345678990',
          cnhCategoria: 'D',
          cnhValidade: '03/2029',
          veiculoTipo: 'Van / furgão',
          veiculoModelo: 'Fiorino',
          veiculoPlaca: 'ABC1D23',
          veiculoAno: '2020',
          online: true,
          avaliacaoMedia: 4.9,
          totalCorridas: 128,
          verificado: true,
          pendenteValidacao: false,
          ofereceMontagem: true
        },
        {
          id: 'u_admin_demo',
          tipo: 'admin',
          nome: 'Equipe CarretoUber',
          email: 'admin@carretouber.com',
          senha: '123456'
        },
        {
          id: 'u_motorista_demo2',
          tipo: 'motorista',
          nome: 'Carlos Reis',
          email: 'carlos@exemplo.com',
          senha: '123456',
          idade: 41,
          nacionalidade: 'Brasileiro',
          cpf: '111.222.333-44',
          cnhNumero: '01122334455',
          cnhCategoria: 'C',
          cnhValidade: '11/2027',
          veiculoTipo: 'Caminhão 3/4',
          veiculoModelo: 'HR',
          veiculoPlaca: 'XYZ9K88',
          veiculoAno: '2018',
          online: true,
          avaliacaoMedia: 4.7,
          totalCorridas: 76,
          verificado: true,
          pendenteValidacao: false,
          ofereceMontagem: false
        },
        {
          id: 'u_motorista_demo3',
          tipo: 'motorista',
          nome: 'Ricardo Farias',
          email: 'ricardo@exemplo.com',
          senha: '123456',
          idade: 29,
          nacionalidade: 'Brasileiro',
          cpf: '555.666.777-88',
          cnhNumero: '05566778899',
          cnhCategoria: 'B',
          cnhValidade: '07/2028',
          veiculoTipo: 'Pickup',
          veiculoModelo: 'Saveiro',
          veiculoPlaca: 'QWE4R55',
          veiculoAno: '2021',
          online: false,
          avaliacaoMedia: 5.0,
          totalCorridas: 0,
          verificado: false,
          pendenteValidacao: true,
          ofereceMontagem: true
        }
      ],
      solicitacoes: [
        {
          id: 's_demo1',
          clienteId: 'u_cliente_demo',
          origem: 'Rua Direita do Dendezeiros, 45, Dendezeiros',
          destino: 'Av. Otávio Mangabeira, 900, Itapuã',
          tipoCarga: 'Móveis',
          volume: 'Médio — cabe numa van',
          observacoes: 'Sofá de 3 lugares, geladeira, precisa de 2 pessoas para carregar',
          status: 'orcamentos_recebidos',
          motoristaAceitoId: null,
          valorAceito: null,
          orcamentoAceitoId: null,
          etapaCorrida: 0,
          criadaEm: now - 1000 * 60 * 40,
          avaliada: false,
          modalidade: 'imediata',
          agendadoPara: null,
          necessitaMontador: false,
          seguro: null,
          seguroDefinido: true,
          enderecoAlternativoId: null,
          recebimento: null
        }
      ],
      orcamentos: [
        {
          id: 'o_demo1',
          solicitacaoId: 's_demo1',
          motoristaId: 'u_motorista_demo',
          valor: 85,
          prazo: 'Até 10 minutos',
          mensagem: 'Posso levar um ajudante sem custo extra.',
          criadoEm: now - 1000 * 60 * 35
        },
        {
          id: 'o_demo2',
          solicitacaoId: 's_demo1',
          motoristaId: 'u_motorista_demo2',
          valor: 110,
          prazo: '10 a 20 minutos',
          mensagem: 'Caminhão maior, cabe tudo numa viagem só.',
          criadoEm: now - 1000 * 60 * 30
        }
      ],
      mensagens: [
        { id: uid('m'), solicitacaoId: 's_demo1', autorId: 'u_motorista_demo', texto: 'Oi! Já estou a caminho do endereço de coleta, chego em uns 6 minutos.', criadoEm: now - 1000 * 60 * 20 },
        { id: uid('m'), solicitacaoId: 's_demo1', autorId: 'u_cliente_demo', texto: 'Perfeito, vou te esperar no portão.', criadoEm: now - 1000 * 60 * 19 },
        { id: uid('m'), solicitacaoId: 's_demo1', autorId: 'u_motorista_demo', texto: 'O sofá é o único item mais pesado, certo? Vou levar um ajudante.', criadoEm: now - 1000 * 60 * 18 }
      ],
      avaliacoes: [],
      enderecosConfianca: [
        {
          id: 'e_demo1',
          clienteId: 'u_cliente_demo',
          apelido: 'Porteiro',
          responsavel: 'Carlos Almeida',
          endereco: 'Av. Sete de Setembro, 1200, Salvador - BA'
        }
      ],
      denuncias: [
        {
          id: 'd_demo1',
          solicitacaoId: null,
          descricao: 'Cliente relatou atraso não informado na corrida #4821',
          status: 'aberta',
          criadaEm: now - 1000 * 60 * 60 * 5
        }
      ]
    };
  }

  function normalizarDados(data) {
    const base = data && typeof data === 'object' ? data : {};
    let alterado = false;

    ['usuarios', 'solicitacoes', 'orcamentos', 'mensagens', 'avaliacoes', 'enderecosConfianca', 'denuncias'].forEach(chave => {
      if (!Array.isArray(base[chave])) {
        base[chave] = [];
        alterado = true;
      }
    });

    base.usuarios = base.usuarios.map(usuario => {
      if (usuario.tipo !== 'motorista') return usuario;
      const atualizado = { ...usuario };
      if (typeof atualizado.online !== 'boolean') atualizado.online = true;
      if (typeof atualizado.avaliacaoMedia !== 'number') atualizado.avaliacaoMedia = 5;
      if (typeof atualizado.totalCorridas !== 'number') atualizado.totalCorridas = 0;
      if (typeof atualizado.verificado !== 'boolean') atualizado.verificado = false;
      if (typeof atualizado.pendenteValidacao !== 'boolean') atualizado.pendenteValidacao = !atualizado.verificado;
      if (typeof atualizado.ofereceMontagem !== 'boolean') atualizado.ofereceMontagem = false;
      if (JSON.stringify(atualizado) !== JSON.stringify(usuario)) alterado = true;
      return atualizado;
    });

    base.solicitacoes = base.solicitacoes.map(solicitacao => {
      const atualizado = {
        motoristaAceitoId: null,
        valorAceito: null,
        orcamentoAceitoId: null,
        etapaCorrida: 0,
        avaliada: false,
        modalidade: 'imediata',
        agendadoPara: null,
        necessitaMontador: false,
        seguro: null,
        seguroDefinido: false,
        enderecoAlternativoId: null,
        recebimento: null,
        ...solicitacao
      };
      if (JSON.stringify(atualizado) !== JSON.stringify(solicitacao)) alterado = true;
      return atualizado;
    });

    if (!base.meta || base.meta.schemaVersion !== DB_SCHEMA_VERSION) {
      base.meta = { ...(base.meta || {}), schemaVersion: DB_SCHEMA_VERSION };
      alterado = true;
    }

    return { data: base, alterado };
  }

  function load() {
    const raw = localStorage.getItem(DB_KEY);
    if (!raw) {
      const initial = seed();
      save(initial);
      return initial;
    }

    try {
      const resultado = normalizarDados(JSON.parse(raw));
      if (resultado.alterado) save(resultado.data);
      return resultado.data;
    } catch (error) {
      const initial = seed();
      save(initial);
      return initial;
    }
  }

  function save(data) {
    localStorage.setItem(DB_KEY, JSON.stringify(data));
  }

  function reset() {
    const initial = seed();
    save(initial);
    return initial;
  }

  function prazoEmMinutos(prazo) {
    const texto = String(prazo || '').toLowerCase();
    if (texto.includes('até 10')) return 10;
    if (texto.includes('10 a 20')) return 20;
    if (texto.includes('20 a 30')) return 30;
    if (texto.includes('mais de 30')) return 60;
    return Number.POSITIVE_INFINITY;
  }

  function obterSolicitacaoDoData(data, solicitacaoId) {
    return data.solicitacoes.find(s => s.id === solicitacaoId) || null;
  }

  function obterMotoristaDoData(data, motoristaId) {
    return data.usuarios.find(u => u.id === motoristaId && u.tipo === 'motorista') || null;
  }

  return {
    uid,
    reset,
    prazoEmMinutos,

    // Usuários
    getUsuarios() {
      return load().usuarios;
    },

    getUsuarioPorId(id) {
      return load().usuarios.find(u => u.id === id) || null;
    },

    getUsuarioPorEmail(email) {
      const normalizado = String(email || '').trim().toLowerCase();
      return load().usuarios.find(u => String(u.email || '').toLowerCase() === normalizado) || null;
    },

    criarUsuario(dados) {
      const data = load();
      const email = String(dados.email || '').trim().toLowerCase();

      if (data.usuarios.some(u => String(u.email || '').toLowerCase() === email)) {
        return { erro: 'E-mail já cadastrado.' };
      }

      const usuario = {
        id: uid('u'),
        online: dados.tipo === 'motorista' ? true : undefined,
        avaliacaoMedia: dados.tipo === 'motorista' ? 5 : undefined,
        totalCorridas: dados.tipo === 'motorista' ? 0 : undefined,
        verificado: dados.tipo === 'motorista' ? false : undefined,
        pendenteValidacao: dados.tipo === 'motorista' ? true : undefined,
        ofereceMontagem: dados.tipo === 'motorista' ? false : undefined,
        ...dados,
        email
      };

      data.usuarios.push(usuario);
      save(data);
      return { usuario };
    },

    atualizarUsuario(id, patch) {
      const data = load();
      const index = data.usuarios.findIndex(u => u.id === id);
      if (index === -1) return null;

      data.usuarios[index] = { ...data.usuarios[index], ...patch };
      save(data);
      return data.usuarios[index];
    },

    listarMotoristas({ somenteOnline = false, ofereceMontagem = null } = {}) {
      return load().usuarios.filter(usuario => {
        if (usuario.tipo !== 'motorista') return false;
        if (somenteOnline && !usuario.online) return false;
        if (ofereceMontagem === true && !usuario.ofereceMontagem) return false;
        return true;
      });
    },

    // Solicitações
    getSolicitacoes() {
      return load().solicitacoes;
    },

    getSolicitacaoPorId(id) {
      return load().solicitacoes.find(s => s.id === id) || null;
    },

    getSolicitacoesDoCliente(clienteId) {
      return load().solicitacoes
        .filter(s => s.clienteId === clienteId)
        .sort((a, b) => b.criadaEm - a.criadaEm);
    },

    getSolicitacoesAbertas(motoristaId = null) {
      const data = load();
      const motorista = motoristaId ? obterMotoristaDoData(data, motoristaId) : null;

      return data.solicitacoes
        .filter(s => {
          if (!['aberta', 'orcamentos_recebidos'].includes(s.status)) return false;
          if (s.motoristaAceitoId) return false;
          if (s.necessitaMontador && motorista && !motorista.ofereceMontagem) return false;
          return true;
        })
        .sort((a, b) => {
          const aQuando = a.modalidade === 'agendada' && a.agendadoPara ? a.agendadoPara : a.criadaEm;
          const bQuando = b.modalidade === 'agendada' && b.agendadoPara ? b.agendadoPara : b.criadaEm;
          return aQuando - bQuando;
        });
    },

    getSolicitacaoAtivaDoCliente(clienteId) {
      return load().solicitacoes.find(
        s => s.clienteId === clienteId && ['aceita', 'em_andamento'].includes(s.status)
      ) || null;
    },

    getSolicitacaoAtivaDoMotorista(motoristaId) {
      return load().solicitacoes.find(
        s => s.motoristaAceitoId === motoristaId && ['aceita', 'em_andamento'].includes(s.status)
      ) || null;
    },

    criarSolicitacao(dados) {
      const modalidade = dados.modalidade === 'agendada' ? 'agendada' : 'imediata';
      const agendadoPara = modalidade === 'agendada' ? Number(dados.agendadoPara) : null;

      if (modalidade === 'agendada' && (!Number.isFinite(agendadoPara) || agendadoPara <= Date.now())) {
        return { erro: 'O agendamento precisa ser para uma data e horário futuros.' };
      }

      const data = load();
      const solicitacao = {
        id: uid('s'),
        status: 'aberta',
        motoristaAceitoId: null,
        valorAceito: null,
        orcamentoAceitoId: null,
        etapaCorrida: 0,
        criadaEm: Date.now(),
        avaliada: false,
        modalidade,
        agendadoPara,
        necessitaMontador: false,
        seguro: null,
        seguroDefinido: false,
        enderecoAlternativoId: null,
        recebimento: null,
        ...dados,
        modalidade,
        agendadoPara
      };

      data.solicitacoes.push(solicitacao);
      save(data);
      return solicitacao;
    },

    atualizarSolicitacao(id, patch) {
      const data = load();
      const index = data.solicitacoes.findIndex(s => s.id === id);
      if (index === -1) return null;

      data.solicitacoes[index] = { ...data.solicitacoes[index], ...patch };
      save(data);
      return data.solicitacoes[index];
    },

    // Seguro de carga (RF-12)
    getPlanosSeguro() {
      return PLANOS_SEGURO.map(plano => ({ ...plano }));
    },

    definirSeguro(solicitacaoId, planoId) {
      const data = load();
      const index = data.solicitacoes.findIndex(s => s.id === solicitacaoId);
      if (index === -1) return null;

      const plano = planoId === 'nenhum'
        ? null
        : PLANOS_SEGURO.find(item => item.id === planoId);

      if (planoId !== 'nenhum' && !plano) return null;

      data.solicitacoes[index].seguro = plano ? { ...plano } : null;
      data.solicitacoes[index].seguroDefinido = true;
      save(data);
      return data.solicitacoes[index];
    },

    // Orçamentos (RF-07, RF-14 e RF-15)
    getOrcamentosDaSolicitacao(solicitacaoId) {
      return load().orcamentos
        .filter(o => o.solicitacaoId === solicitacaoId)
        .sort((a, b) => a.valor - b.valor);
    },

    getOrcamentoPorId(id) {
      return load().orcamentos.find(o => o.id === id) || null;
    },

    motoristaJaOrcou(solicitacaoId, motoristaId) {
      return load().orcamentos.some(
        o => o.solicitacaoId === solicitacaoId && o.motoristaId === motoristaId
      );
    },

    criarOrcamento(dados) {
      const data = load();
      const solicitacao = obterSolicitacaoDoData(data, dados.solicitacaoId);
      const motorista = obterMotoristaDoData(data, dados.motoristaId);

      if (!solicitacao || !motorista) return { erro: 'Solicitação ou transportador inválido.' };
      if (!['aberta', 'orcamentos_recebidos'].includes(solicitacao.status) || solicitacao.motoristaAceitoId) {
        return { erro: 'Esta solicitação não está mais recebendo orçamentos.' };
      }
      if (solicitacao.necessitaMontador && !motorista.ofereceMontagem) {
        return { erro: 'Esta solicitação exige um transportador habilitado para montagem.' };
      }
      if (data.orcamentos.some(o => o.solicitacaoId === dados.solicitacaoId && o.motoristaId === dados.motoristaId)) {
        return { erro: 'Você já enviou um orçamento para esta solicitação.' };
      }

      const valor = Number(dados.valor);
      if (!Number.isFinite(valor) || valor <= 0) return { erro: 'Informe um valor válido para o frete.' };

      const orcamento = {
        id: uid('o'),
        criadoEm: Date.now(),
        ...dados,
        valor
      };

      data.orcamentos.push(orcamento);
      if (solicitacao.status === 'aberta') solicitacao.status = 'orcamentos_recebidos';
      save(data);
      return orcamento;
    },

    getOrcamentosOrdenados(solicitacaoId, criterio = 'valor') {
      const data = load();
      const motoristas = new Map(data.usuarios.map(u => [u.id, u]));
      const orcamentos = data.orcamentos.filter(o => o.solicitacaoId === solicitacaoId);

      return orcamentos.sort((a, b) => {
        const motoristaA = motoristas.get(a.motoristaId) || {};
        const motoristaB = motoristas.get(b.motoristaId) || {};

        if (criterio === 'avaliacao') {
          return Number(motoristaB.avaliacaoMedia || 0) - Number(motoristaA.avaliacaoMedia || 0);
        }
        if (criterio === 'prazo') {
          return prazoEmMinutos(a.prazo) - prazoEmMinutos(b.prazo);
        }
        if (criterio === 'recente') {
          return Number(b.criadoEm || 0) - Number(a.criadoEm || 0);
        }
        return Number(a.valor || 0) - Number(b.valor || 0);
      });
    },

    aceitarOrcamento(orcamentoId) {
      const data = load();
      const orcamento = data.orcamentos.find(o => o.id === orcamentoId);
      if (!orcamento) return null;

      const solicitacao = obterSolicitacaoDoData(data, orcamento.solicitacaoId);
      const motorista = obterMotoristaDoData(data, orcamento.motoristaId);
      if (!solicitacao || !motorista || solicitacao.motoristaAceitoId) return null;
      if (!['aberta', 'orcamentos_recebidos'].includes(solicitacao.status)) return null;
      if (solicitacao.necessitaMontador && !motorista.ofereceMontagem) return null;

      solicitacao.status = 'aceita';
      solicitacao.motoristaAceitoId = orcamento.motoristaId;
      solicitacao.valorAceito = orcamento.valor;
      solicitacao.orcamentoAceitoId = orcamento.id;
      solicitacao.etapaCorrida = 0;
      save(data);
      return solicitacao;
    },

    avancarEtapaCorrida(solicitacaoId) {
      const data = load();
      const solicitacao = obterSolicitacaoDoData(data, solicitacaoId);
      if (!solicitacao || !solicitacao.motoristaAceitoId) return null;
      if (!['aceita', 'em_andamento'].includes(solicitacao.status)) return solicitacao;

      solicitacao.etapaCorrida = Math.min(Number(solicitacao.etapaCorrida || 0) + 1, 3);
      solicitacao.status = solicitacao.etapaCorrida >= 3 ? 'concluida' : 'em_andamento';
      save(data);
      return solicitacao;
    },

    // Endereços de confiança (RF-16)
    getEnderecosConfianca(clienteId) {
      return load().enderecosConfianca.filter(e => e.clienteId === clienteId);
    },

    criarEnderecoConfianca(dados) {
      const apelido = String(dados.apelido || '').trim();
      const responsavel = String(dados.responsavel || '').trim();
      const enderecoTexto = String(dados.endereco || '').trim();
      if (!dados.clienteId || !apelido || !responsavel || !enderecoTexto) return null;

      const data = load();
      const endereco = {
        id: uid('e'),
        clienteId: dados.clienteId,
        apelido,
        responsavel,
        endereco: enderecoTexto
      };
      data.enderecosConfianca.push(endereco);
      save(data);
      return endereco;
    },

    removerEnderecoConfianca(id, clienteId) {
      const data = load();
      const enderecoEmUso = data.solicitacoes.some(
        s => s.enderecoAlternativoId === id && !s.recebimento
      );
      if (enderecoEmUso) return false;

      const tamanhoAnterior = data.enderecosConfianca.length;
      data.enderecosConfianca = data.enderecosConfianca.filter(
        e => !(e.id === id && e.clienteId === clienteId)
      );
      save(data);
      return data.enderecosConfianca.length < tamanhoAnterior;
    },

    getEnderecoConfiancaPorId(id) {
      return load().enderecosConfianca.find(e => e.id === id) || null;
    },

    definirEnderecoAlternativo(solicitacaoId, enderecoId) {
      const data = load();
      const solicitacao = obterSolicitacaoDoData(data, solicitacaoId);
      if (!solicitacao || !['aceita', 'em_andamento'].includes(solicitacao.status)) return null;

      if (enderecoId) {
        const endereco = data.enderecosConfianca.find(
          e => e.id === enderecoId && e.clienteId === solicitacao.clienteId
        );
        if (!endereco) return null;
      }

      solicitacao.enderecoAlternativoId = enderecoId || null;
      save(data);
      return solicitacao;
    },

    // Confirmação formal de recebimento (RF-17)
    registrarRecebimento(solicitacaoId, dados) {
      const data = load();
      const solicitacao = obterSolicitacaoDoData(data, solicitacaoId);
      if (!solicitacao || solicitacao.status !== 'concluida' || solicitacao.recebimento) return null;

      const nomeRecebedor = String(dados.nomeRecebedor || '').trim();
      const assinaturaDataUrl = String(dados.assinaturaDataUrl || '');
      if (!nomeRecebedor || !assinaturaDataUrl.startsWith('data:image/')) return null;

      solicitacao.recebimento = {
        registradoEm: Date.now(),
        nomeRecebedor,
        tipoRecebedor: dados.tipoRecebedor === 'alternativo' ? 'alternativo' : 'solicitante',
        enderecoRecebimento: String(dados.enderecoRecebimento || solicitacao.destino),
        assinaturaDataUrl
      };
      save(data);
      return solicitacao.recebimento;
    },

    // Mensagens
    getMensagens(solicitacaoId) {
      return load().mensagens
        .filter(m => m.solicitacaoId === solicitacaoId)
        .sort((a, b) => a.criadoEm - b.criadoEm);
    },

    enviarMensagem(solicitacaoId, autorId, texto) {
      const mensagem = String(texto || '').trim();
      if (!mensagem) return null;

      const data = load();
      const msg = {
        id: uid('m'),
        solicitacaoId,
        autorId,
        texto: mensagem,
        criadoEm: Date.now()
      };
      data.mensagens.push(msg);
      save(data);
      return msg;
    },

    // Avaliações
    criarAvaliacao(dados) {
      const data = load();
      const solicitacao = obterSolicitacaoDoData(data, dados.solicitacaoId);
      if (!solicitacao || solicitacao.status !== 'concluida' || !solicitacao.recebimento) {
        return { erro: 'A confirmação assinada de recebimento é obrigatória antes da avaliação.' };
      }
      if (solicitacao.avaliada) return { erro: 'Esta corrida já foi avaliada.' };

      const nota = Number(dados.nota);
      if (!Number.isInteger(nota) || nota < 1 || nota > 5) return { erro: 'A nota deve estar entre 1 e 5.' };

      const avaliacao = {
        id: uid('a'),
        criadoEm: Date.now(),
        ...dados,
        nota
      };
      data.avaliacoes.push(avaliacao);
      solicitacao.avaliada = true;

      if (dados.avaliadoId) {
        const motorista = obterMotoristaDoData(data, dados.avaliadoId);
        if (motorista) {
          const notas = data.avaliacoes
            .filter(a => a.avaliadoId === dados.avaliadoId)
            .map(a => Number(a.nota))
            .filter(Number.isFinite);
          motorista.avaliacaoMedia = Math.round((notas.reduce((acc, n) => acc + n, 0) / notas.length) * 10) / 10;
        }
      }

      save(data);
      return avaliacao;
    },

    getAvaliacoesDoMotorista(motoristaId) {
      return load().avaliacoes.filter(a => a.avaliadoId === motoristaId);
    },

    // Denúncias / Admin
    getDenuncias() {
      return load().denuncias;
    },

    getMotoristasPendentes() {
      return load().usuarios.filter(u => u.tipo === 'motorista' && u.pendenteValidacao);
    },

    validarMotorista(id) {
      return this.atualizarUsuario(id, { pendenteValidacao: false, verificado: true });
    },

    resolverDenuncia(id) {
      const data = load();
      const denuncia = data.denuncias.find(d => d.id === id);
      if (!denuncia) return null;

      denuncia.status = 'resolvida';
      save(data);
      return denuncia;
    },

    stats() {
      const data = load();
      return {
        corridasHoje: data.solicitacoes.filter(
          s => ['aceita', 'em_andamento', 'concluida'].includes(s.status)
        ).length,
        pendentes: data.usuarios.filter(u => u.tipo === 'motorista' && u.pendenteValidacao).length,
        denunciasAbertas: data.denuncias.filter(d => d.status === 'aberta').length
      };
    }
  };
})();

/* ============================================================
   CarretoUber — IA de apoio no chat (simulada, 100% local)
   Não faz chamadas de rede. Responde por regras de palavras-chave
   e pelo estado da corrida, do ponto de vista do MOTORISTA
   (a "outra pessoa" na conversa), para preencher o chat quando
   o usuário está testando o protótipo sozinho.
   ============================================================ */

const CHAT_AI = (function () {

  // pequenas variações para não parecer sempre a mesma frase
  function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function normalizar(texto) {
    return (texto || '')
      .toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, ''); // remove acentos
  }

  const regras = [
    {
      quando: /(oi|ola|opa|bom dia|boa tarde|boa noite)/,
      responde: () => pick([
        'Oi! Tudo certo por aí, já estou de olho no seu pedido.',
        'Olá! Pode falar, tô por aqui.',
        'Opa, tudo bem? Como posso ajudar com o carreto?'
      ])
    },
    {
      quando: /(chega|chegar|demora|quanto tempo|falta|eta)/,
      responde: () => pick([
        'Devo chegar em uns 6 a 8 minutos, o trânsito tá tranquilo.',
        'Tô a cerca de 1,5 km, chego rapidinho.',
        'Uns 10 minutos no máximo, já estou me aproximando.'
      ])
    },
    {
      quando: /(preco|valor|orcamento|quanto custa|quanto fica|pagamento|pagar)/,
      responde: () => pick([
        'O valor combinado foi o do orçamento aceito, sem taxas extras.',
        'Pode pagar direto pelo app depois da entrega, tá tudo certo.',
        'O preço já ficou fechado, qualquer item extra eu aviso antes de cobrar.'
      ])
    },
    {
      quando: /(pesado|sofa|geladeira|moveis|caixa|ajuda|ajudante|carregar)/,
      responde: () => pick([
        'Sem problema, vou levar um ajudante pra dar conta dos itens mais pesados.',
        'Pode deixar, tenho experiência com móveis grandes, vamos com cuidado.',
        'Se puder deixar o caminho livre até a porta já ajuda bastante, obrigado!'
      ])
    },
    {
      quando: /(endereco|onde|localizacao|rua|numero)/,
      responde: () => pick([
        'Endereço confirmado aqui no app, só me avisa se tiver algum ponto de referência.',
        'Já tenho a localização certinha, vou seguir pelo GPS.'
      ])
    },
    {
      quando: /(atraso|atrasad|demorou)/,
      responde: () => pick([
        'Desculpa pela demora, tive um imprevisto no trânsito, já estou quase chegando.',
        'Peço desculpas pelo atraso, chego em poucos minutos.'
      ])
    },
    {
      quando: /(obrigad|valeu|show|top|ótimo|otimo)/,
      responde: () => pick(['Disponha! Qualquer coisa é só chamar.', 'Por nada, tamo junto até a entrega!'])
    },
    {
      quando: /(cancela|cancelar)/,
      responde: () => pick(['Poxa, algum problema? Se precisar cancelar me avisa que eu ajusto por aqui.'])
    }
  ];

  const respostasPadrao = [
    'Entendido, já vou seguir com isso.',
    'Combinado! Qualquer novidade eu te aviso por aqui.',
    'Certo, obrigado por avisar.',
    'Beleza, seguimos assim então.'
  ];

  function gerarResposta(textoUsuario) {
    const t = normalizar(textoUsuario);
    for (const regra of regras) {
      if (regra.quando.test(t)) return regra.responde();
    }
    return pick(respostasPadrao);
  }

  return { gerarResposta };
})();

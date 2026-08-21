/* ============================================================
   CarretoUber — Utilitários compartilhados de interface
   ============================================================ */

const UI = (() => {
  function escapeHtml(value) {
    return String(value ?? '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }

  function dinheiro(value) {
    return Number(value || 0).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  }

  function dataHora(timestamp, options = {}) {
    if (!timestamp) return '—';
    const date = new Date(Number(timestamp));
    if (Number.isNaN(date.getTime())) return '—';

    return date.toLocaleString('pt-BR', {
      dateStyle: options.dateStyle || 'short',
      timeStyle: options.timeStyle || 'short'
    });
  }

  function data(timestamp) {
    if (!timestamp) return '—';
    const date = new Date(Number(timestamp));
    return Number.isNaN(date.getTime()) ? '—' : date.toLocaleDateString('pt-BR');
  }

  function primeiroNome(nome) {
    return String(nome || '').trim().split(/\s+/)[0] || '';
  }

  function queryParam(nome) {
    return new URLSearchParams(window.location.search).get(nome);
  }

  function mostrarErro(elemento, mensagem) {
    if (!elemento) return;
    elemento.textContent = mensagem;
    elemento.hidden = false;
    elemento.style.display = 'block';
  }

  function limparErro(elemento) {
    if (!elemento) return;
    elemento.textContent = '';
    elemento.hidden = true;
    elemento.style.display = 'none';
  }

  function hojeMaisDias(dias = 0) {
    const date = new Date();
    date.setDate(date.getDate() + dias);
    const ano = date.getFullYear();
    const mes = String(date.getMonth() + 1).padStart(2, '0');
    const dia = String(date.getDate()).padStart(2, '0');
    return `${ano}-${mes}-${dia}`;
  }

  function resumoEndereco(endereco) {
    return escapeHtml(String(endereco || '').split(',')[0] || '—');
  }

  function modalidadeLabel(solicitacao) {
    if (solicitacao?.modalidade === 'agendada' && solicitacao.agendadoPara) {
      return `🗓 Agendado para ${escapeHtml(dataHora(solicitacao.agendadoPara))}`;
    }
    return '⚡ Atendimento imediato';
  }

  return {
    escapeHtml,
    dinheiro,
    dataHora,
    data,
    primeiroNome,
    queryParam,
    mostrarErro,
    limparErro,
    hojeMaisDias,
    resumoEndereco,
    modalidadeLabel
  };
})();

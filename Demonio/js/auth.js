/* ============================================================
   CarretoUber — Sessão / autenticação
   Guarda o usuário logado no localStorage (chave separada do DB).
   ============================================================ */

const SESSION_KEY = 'carretouber_session';

const AUTH = {
  login(usuarioId) {
    localStorage.setItem(SESSION_KEY, usuarioId);
  },

  logout() {
    localStorage.removeItem(SESSION_KEY);
  },

  getUsuarioAtual() {
    const id = localStorage.getItem(SESSION_KEY);
    if (!id) return null;
    return DB.getUsuarioPorId(id);
  },

  // Redireciona para a home certa conforme o tipo do usuário
  irParaHome(usuario) {
    if (usuario.tipo === 'cliente') window.location.href = 'cliente-home.html';
    else if (usuario.tipo === 'motorista') window.location.href = 'motorista-home.html';
    else window.location.href = 'admin-painel.html';
  },

  // Protege uma página: se não houver sessão (ou tipo errado), manda para o login
  exigirSessao(tipoEsperado) {
    const usuario = this.getUsuarioAtual();
    if (!usuario) {
      window.location.href = 'login.html';
      return null;
    }
    if (tipoEsperado && usuario.tipo !== tipoEsperado) {
      this.irParaHome(usuario);
      return null;
    }
    return usuario;
  },

  iniciais(nome) {
    const partes = (nome || '').trim().split(/\s+/);
    const a = partes[0] ? partes[0][0] : '';
    const b = partes[1] ? partes[1][0] : '';
    return (a + b).toUpperCase();
  }
};

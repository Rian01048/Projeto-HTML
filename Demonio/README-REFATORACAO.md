# CarretoUber — Refatoração Pós-MVP

Este pacote mantém o projeto como HTML/CSS/JavaScript puro, usando `localStorage`, e organiza as melhorias RF-11 a RF-17 sem adicionar backend ou banco de dados.

## Funcionalidades pós-MVP

- RF-11: frete imediato ou agendado para data/horário futuros.
- RF-12: seguro de carga com três planos ou opção sem seguro.
- RF-13: transportador habilitado para montagem e filtro de compatibilidade.
- RF-14: ordenação de orçamentos por valor, avaliação, prazo e recência.
- RF-15: comparação lado a lado e aceite direto da proposta.
- RF-16: endereços de confiança e seleção de destino alternativo durante a corrida.
- RF-17: confirmação de recebimento com nome e assinatura manuscrita.

## Refatoração técnica

- Regras críticas foram movidas para `js/db.js`, evitando depender apenas de validações visuais.
- Foi adicionada migração automática de dados antigos do `localStorage` para a versão atual do modelo.
- Funções comuns de formatação, escaping e parâmetros de URL foram centralizadas em `js/ui.js`.
- O JavaScript das principais telas pós-MVP foi separado em arquivos próprios.
- O comprovante assinado pode ser consultado posteriormente no histórico da corrida.
- O motorista continua vendo a corrida imediatamente após marcá-la como concluída.

## Contas de demonstração

### Cliente
- E-mail: `maria@exemplo.com`
- Senha: `123456`

### Motorista com montagem habilitada
- E-mail: `joao@exemplo.com`
- Senha: `123456`

### Motorista sem montagem habilitada
- E-mail: `carlos@exemplo.com`
- Senha: `123456`

### Administrador
- E-mail: `admin@carretouber.com`
- Senha: `123456`

## Como executar

Abra a pasta no VS Code e execute `index.html` com a extensão Live Server.

Exemplo:

`http://127.0.0.1:5500/index.html`

## Observação sobre o MVP

Seguro, autenticação e assinatura são simulados localmente. Para produção, essas informações precisam ser persistidas em backend/banco de dados, com controle de autenticação, integridade, auditoria e integração real com seguradora/pagamento.

# FPV Arbitragem — Plataforma de Gestão da Arbitragem

Aplicação web local/PWA para gestão interna da arbitragem da Federação Portuguesa de Vela. A plataforma foi organizada como uma aplicação operacional, não como landing page, e inclui módulos para dashboard, árbitros, perfil individual, provas, nomeações, disponibilidades, licenças/formação, relatórios, conflitos de interesse, documentos, comunicações, auditoria e perfis de utilizador.

Os dados incluídos são dados de ambiente interno/teste e não representam pessoas reais, contactos reais ou registos oficiais.

## Ficheiros incluídos

- `index.html` — estrutura principal da aplicação e metadados PWA.
- `styles.css` — estilos responsivos, layout, cartões, tabelas, modais, mobile e safe areas.
- `app.js` — dados, regras de negócio, filtros, modais, localStorage, auditoria e exportações.
- `manifest.json` — configuração PWA para instalação em Android, iOS e desktop compatível.
- `service-worker.js` — cache local dos ficheiros essenciais e fallback offline.
- `offline.html` — página institucional quando a aplicação está sem ligação.
- `icons/` — ícones locais para instalação PWA.

## Como abrir localmente

Basta abrir `index.html` no navegador. Para testar a PWA, o service worker funciona melhor quando servido por HTTP local. Recomenda-se uma destas opções:

```bash
python3 -m http.server 8080
```

Depois abrir:

```text
http://localhost:8080
```

## Como testar em desktop

1. Abrir a pasta num servidor local.
2. Aceder a `http://localhost:8080`.
3. Testar navegação pela sidebar.
4. Usar filtros em Árbitros, Provas, Disponibilidades e Documentos.
5. Criar/editar registos por modais.
6. Alterar estados de nomeações, relatórios, documentos, conflitos e comunicações.
7. Confirmar que a auditoria regista as ações.
8. Testar exportações CSV.
9. Fechar e reabrir o navegador para confirmar persistência em `localStorage`.

## Como testar em Android

1. Servir a aplicação por HTTP ou HTTPS acessível ao dispositivo.
2. Abrir no Chrome Android.
3. Confirmar que o menu lateral abre e fecha corretamente.
4. Usar a opção “Adicionar ao ecrã principal” ou o botão “Instalar aplicação”, quando disponível.
5. Abrir a aplicação instalada em modo standalone.
6. Testar navegação, modais, filtros, cartões mobile e estado offline.

## Como testar em iOS

1. Abrir a aplicação no Safari iOS.
2. Usar o botão de partilha.
3. Escolher “Adicionar ao ecrã principal”.
4. Abrir a aplicação pelo ícone criado.
5. Confirmar comportamento standalone, safe areas e modais em ecrãs pequenos.

Nota: iOS pode não apresentar o mesmo evento de instalação que Chrome Android. A instalação é feita pelo menu de partilha do Safari.

## Funcionalidades incluídas

- Dashboard operacional com métricas clicáveis.
- Gestão de árbitros com pesquisa, filtros, cartões mobile e tabela desktop.
- Perfil individual com resumo operacional, risco, documentos, conflitos e linha temporal.
- Gestão de provas com estado documental, necessidades de arbitragem e checklist.
- Centro de nomeações com validação automática.
- Mapas de disponibilidade por árbitro, data e prova.
- Controlo de licenças, formação, graduação e requisitos.
- Relatórios pós-prova com prazo automático de 5 dias após o fim da prova.
- Registo e decisão de conflitos de interesse.
- Gestão documental com estados e checklist.
- Comunicações internas com estados.
- Auditoria com histórico de alterações.
- Perfis e matriz de permissões.
- Persistência local com `localStorage`.
- Botão para repor dados de teste.
- Exportação CSV de árbitros, provas, nomeações, disponibilidades, relatórios, conflitos e auditoria.
- PWA com manifest, service worker, cache básica e página offline.

## Regras de negócio implementadas

Na nomeação de árbitros são validados:

- licença desportiva válida;
- estado operacional ativo;
- disponibilidade na data/prova;
- conflito de interesse pendente ou impeditivo;
- relatório anterior em atraso;
- sobreposição com outra prova;
- graduação adequada à função;
- categoria adequada à função;
- necessidade mínima da prova.

As validações são classificadas em:

- **Bloqueio** — impede a nomeação;
- **Alerta crítico** — exige justificação;
- **Alerta moderado** — permite avançar com aviso;
- **Sem risco** — permite avançar normalmente.

Também são registadas em auditoria as alterações relevantes: nomeações, conflitos, documentos, relatórios, comunicações, credenciação e exportações.

## Limitações atuais

Esta versão funciona localmente e usa `localStorage`. Para uso oficial em produção será necessário implementar:

- backend;
- base de dados centralizada;
- autenticação real;
- permissões reais no servidor;
- armazenamento seguro de documentos;
- backups;
- logs de segurança;
- conformidade RGPD;
- alojamento em servidor seguro;
- validação formal pela Federação Portuguesa de Vela.

## Próximos passos recomendados para produção

1. Backend com API segura, por exemplo Node.js/NestJS, Django ou Laravel.
2. Base de dados PostgreSQL com modelo relacional para árbitros, provas, nomeações, documentos e auditoria.
3. Autenticação com MFA e gestão de sessões.
4. Permissões reais por perfil e por ação no servidor.
5. Armazenamento documental seguro com controlo de versões.
6. Logs imutáveis para auditoria sensível.
7. Backups automáticos e política de retenção.
8. Validação jurídica/RGPD sobre dados pessoais, contactos, licenças e documentos.
9. Alojamento em infraestrutura segura com HTTPS, monitorização e controlo de acessos.
10. Integração futura com sistemas oficiais da Federação Portuguesa de Vela, quando aplicável.

## Nota RGPD

A versão atual não deve ser usada para guardar dados pessoais reais em contexto oficial. Os contactos e nomes incluídos são de teste. Em produção, será necessário definir base legal, minimização de dados, prazos de retenção, direitos dos titulares, controlo de acesso, encriptação e registo de operações de tratamento.

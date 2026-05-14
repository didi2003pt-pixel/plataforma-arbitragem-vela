# FPV Arbitragem — Plataforma de Gestão da Arbitragem

Aplicação web/PWA em português de Portugal para gestão operacional da arbitragem da Federação Portuguesa de Vela em ambiente interno. A plataforma centraliza árbitros, provas, nomeações, disponibilidades, licenças, formação, relatórios, conflitos de interesse, documentos, comunicações, auditoria e perfis de utilizador.

Esta versão funciona localmente no navegador e usa `localStorage` para manter dados no mesmo dispositivo. Os dados incluídos são dados de teste e não representam dados reais de pessoas, clubes ou processos oficiais.

## Ficheiros

- `index.html` — estrutura principal da aplicação.
- `styles.css` — estilos responsivos para desktop, tablet, Android e iOS.
- `app.js` — lógica da aplicação, renderização, formulários, validações, auditoria, localStorage e exportações.
- `manifest.json` — configuração PWA.
- `service-worker.js` — cache básica e suporte offline.
- `offline.html` — página institucional para ausência de ligação.
- `icons/` — ícones PWA.

## Como abrir localmente

A forma mais fiável é servir a pasta com um servidor local:

```bash
cd fpv-arbitragem-pwa
python3 -m http.server 8080
```

Abrir no navegador:

```text
http://localhost:8080
```

Também pode abrir `index.html` diretamente, mas algumas capacidades PWA, como service worker e instalação, exigem HTTP/HTTPS.

## Testar em desktop

1. Abrir `http://localhost:8080`.
2. Confirmar que a aplicação abre no Dashboard, sem modal automático.
3. Navegar por todos os módulos da sidebar.
4. Abrir detalhes, editar árbitros, criar nomeações, alterar estados e exportar CSV.
5. Recarregar a página e confirmar que os dados permanecem no dispositivo.

## Testar em Android

1. Servir a pasta localmente ou publicar em HTTPS, por exemplo GitHub Pages.
2. Abrir no Chrome para Android.
3. Abrir o menu do navegador e escolher “Adicionar ao ecrã principal” ou usar o botão “Instalar aplicação” quando disponível.
4. Confirmar que a aplicação abre em modo standalone.

## Testar em iOS/iPadOS

1. Publicar em HTTPS ou servir num endereço acessível pelo dispositivo.
2. Abrir no Safari.
3. Usar Partilhar → “Adicionar ao ecrã principal”.
4. Confirmar que os modais, menu mobile e formulários respeitam as safe areas do iPhone/iPad.

## GitHub Pages

A aplicação está preparada para subpastas. Os caminhos são relativos:

- `./styles.css`
- `./app.js`
- `./manifest.json`
- `./service-worker.js`
- `./offline.html`

No `manifest.json`, `start_url` e `scope` usam `./`, adequado para GitHub Pages.

## Funcionalidades incluídas

- Dashboard com cartões acionáveis, alertas críticos e próximas provas.
- Gestão de árbitros com filtros, cartões mobile, perfil, edição, disponibilidade, documentos e conflitos.
- Gestão de provas com equipa, estado documental, checklist e detalhes.
- Nomeações com validações de licença, estado, disponibilidade, conflitos, relatórios, sobreposição, graduação e categoria.
- Classificação de validações em bloqueio, alerta crítico, alerta moderado e sem risco.
- Disponibilidades por data e prova, com alertas para mapas em falta.
- Licenças, formação e graduação com estado regular, em risco, incompleto ou suspenso.
- Relatórios pós-prova com prazo automático de 5 dias após o fim da prova.
- Conflitos de interesse com decisão e impacto na nomeação.
- Documentos com estados, versões, validação, rejeição, arquivo e remoção.
- Comunicações internas com estados lida, respondida e arquivada.
- Auditoria com data, utilizador, ação, entidade, estado anterior, novo estado, justificação e origem.
- Persistência local automática com `localStorage`.
- Botão “Guardar dados localmente”.
- Botão “Repor dados de teste”.
- Exportação CSV para árbitros, provas, nomeações, disponibilidades, relatórios, conflitos e auditoria.
- PWA com manifest, ícones, service worker e fallback offline.

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

- Backend com API segura.
- Base de dados PostgreSQL.
- Autenticação com MFA para perfis administrativos.
- Permissões por perfil aplicadas no servidor.
- Armazenamento documental seguro com controlo de versões.
- Logs imutáveis de auditoria.
- Backups automáticos.
- Monitorização e alertas de segurança.
- Política de retenção de dados alinhada com RGPD.
- Revisão formal pelo Conselho de Arbitragem e pela Federação Portuguesa de Vela.

## Nota RGPD

Os dados de teste incluídos não são reais. Qualquer versão oficial deve respeitar minimização de dados, consentimento/legitimidade de tratamento, controlo de acesso, encriptação, retenção adequada, registo de atividades de tratamento e direitos dos titulares dos dados.


## Correção 2.1.1

Inclui correção do estado inicial do modal, proteção CSS para elementos `hidden`, cache PWA atualizada e parâmetros de versão em `styles.css`, `app.js` e `manifest.json` para evitar ficheiros antigos em GitHub Pages.

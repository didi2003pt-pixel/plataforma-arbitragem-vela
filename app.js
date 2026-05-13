/* FPV Arbitragem — aplicação local/PWA sem backend.
   Os dados abaixo são de ambiente interno/teste e não representam pessoas reais. */
(() => {
  'use strict';

  const TODAY = '2026-05-13';
  const STORAGE_KEY = 'fpv-arbitragem-v2';
  const PREF_KEY = 'fpv-arbitragem-preferences';

  const NAV = [
    ['dashboard', '◉', 'Dashboard'],
    ['arbitros', '⚓', 'Árbitros'],
    ['perfil', '👤', 'Perfil do árbitro'],
    ['provas', '⛵', 'Provas'],
    ['nomeacoes', '✓', 'Nomeações'],
    ['disponibilidades', '📅', 'Disponibilidades'],
    ['credenciacao', '🎓', 'Licenças e formação'],
    ['relatorios', '📝', 'Relatórios'],
    ['conflitos', '⚠', 'Conflitos'],
    ['documentos', '📄', 'Documentos'],
    ['comunicacoes', '✉', 'Comunicações'],
    ['auditoria', '☷', 'Auditoria'],
    ['perfis', '⚙', 'Perfis']
  ];

  const META = {
    dashboard: ['Operação', 'Dashboard principal', 'Visão global da arbitragem, nomeações, licenças, relatórios, disponibilidade, conflitos e documentos.'],
    arbitros: ['Base operacional', 'Gestão de árbitros', 'Gestão de categorias, graduações, licenças, disponibilidade, formação, histórico e estado operacional.'],
    perfil: ['Ficha individual', 'Perfil do árbitro', 'Resumo operacional, risco de nomeação, histórico, documentos, conflitos e observações internas.'],
    provas: ['Calendário', 'Provas, regatas e campeonatos', 'Planeamento de provas, necessidades de arbitragem, documentação obrigatória, equipa nomeada e relatório final.'],
    nomeacoes: ['Centro operacional', 'Nomeações', 'Nomeação por função com validação de licença, estado, disponibilidade, conflitos, graduação, categoria e sobreposição.'],
    disponibilidades: ['Mapas mensais', 'Disponibilidades', 'Consulta e registo de disponibilidade por data, por prova, por árbitro e por região.'],
    credenciacao: ['Credenciação', 'Licenças, formação e graduação', 'Controlo da Licença Desportiva de Árbitro, formação, seminários, requisitos e alertas de renovação.'],
    relatorios: ['Pós-prova', 'Relatórios pós-prova', 'Prazos automáticos, entregas, validações, observações e associação documental.'],
    conflitos: ['Independência', 'Conflitos de interesse', 'Registo, análise e decisão sobre conflitos com impacto nas nomeações.'],
    documentos: ['Arquivo', 'Documentos', 'Gestão documental por tipo, prova, árbitro, versão, estado, checklist e auditoria.'],
    comunicacoes: ['Notificações', 'Comunicações e notificações', 'Pedidos, alertas e notificações internas com estados e prioridade.'],
    auditoria: ['Rastreabilidade', 'Auditoria e histórico', 'Registo de ações, entidades afetadas, estados anteriores, novos estados, justificação e origem.'],
    perfis: ['Administração', 'Perfis e permissões', 'Matriz de perfis preparada para autenticação e autorização reais em fase posterior.']
  };

  const DEFAULT_DATA = {
    arbitros: [
      { id:1,cod:'ARB-024',nome:'Ana Sofia Almeida',categoria:'Juiz',graduacao:'Nacional',licenca:'Válida',validade:'2027-03-15',regiao:'Associação Regional Centro',contacto:'ana.almeida.teste@fpv-arb.local',disponibilidade:'Disponível',formacao:'Seminário Regras de Regata à Vela 2025',seminarios:'RRV 2025; Procedimentos de protesto',provas:46,avaliacoes:18,relatoriosAtraso:0,estado:'Ativo',observacoes:'Perfil recomendado para Comissão de Protestos em provas nacionais.',documentos:['Licença Desportiva de Árbitro.pdf','Certificado Seminário RRV.pdf']},
      { id:2,cod:'ARB-041',nome:'Miguel Nunes',categoria:'Medidor',graduacao:'Nacional/Grau 2',licenca:'Válida',validade:'2026-06-30',regiao:'Associação Regional Norte',contacto:'miguel.nunes.teste@fpv-arb.local',disponibilidade:'Por confirmar',formacao:'Formação de Medição 2024',seminarios:'Medição de classes jovens',provas:29,avaliacoes:11,relatoriosAtraso:1,estado:'Ativo',observacoes:'Adequado para medição em classes jovens e monotipos.',documentos:['Certificado Medidor.pdf']},
      { id:3,cod:'ARB-063',nome:'Teresa Carvalho',categoria:'Oficial de Regata',graduacao:'Regional/Grau 1',licenca:'Por validar',validade:'2026-05-29',regiao:'Associação Regional Sul',contacto:'teresa.carvalho.teste@fpv-arb.local',disponibilidade:'Disponível',formacao:'Curso Oficial de Regata 2025',seminarios:'Gestão de campos de regata',provas:17,avaliacoes:7,relatoriosAtraso:0,estado:'Condicionado',observacoes:'Aguardar validação documental da licença antes de provas nacionais.',documentos:['Comprovativo Formação.pdf']},
      { id:4,cod:'ARB-087',nome:'João Pires',categoria:'Juiz-Árbitro',graduacao:'Nacional',licenca:'Válida',validade:'2028-01-10',regiao:'Associação Regional Lisboa',contacto:'joao.pires.teste@fpv-arb.local',disponibilidade:'Indisponível',formacao:'Seminário Match Racing 2025',seminarios:'Match Racing; Protestos',provas:38,avaliacoes:16,relatoriosAtraso:0,estado:'Ativo',observacoes:'Indisponível na segunda quinzena de junho.',documentos:['Licença FPV.pdf']},
      { id:5,cod:'ARB-102',nome:'Marta Reis',categoria:'Juiz',graduacao:'Clube',licenca:'Expirada',validade:'2025-12-18',regiao:'Associação Regional Centro',contacto:'marta.reis.teste@fpv-arb.local',disponibilidade:'Indisponível',formacao:'Sem formação recente registada',seminarios:'',provas:9,avaliacoes:3,relatoriosAtraso:2,estado:'Inativo',observacoes:'Não nomear até renovação da Licença Desportiva de Árbitro.',documentos:['Cartão interno.pdf']},
      { id:6,cod:'ARB-118',nome:'Ricardo Matos',categoria:'Oficial de Regata',graduacao:'Nacional',licenca:'Válida',validade:'2027-11-02',regiao:'Associação Regional Setúbal',contacto:'ricardo.matos.teste@fpv-arb.local',disponibilidade:'Disponível',formacao:'Seminário Gestão de Regatas 2025',seminarios:'Gestão de regatas; Segurança',provas:54,avaliacoes:22,relatoriosAtraso:0,estado:'Ativo',observacoes:'Perfil sénior para Presidente da Comissão de Regata.',documentos:['Licença Nacional.pdf']},
      { id:7,cod:'ARB-130',nome:'Inês Duarte',categoria:'Classificador Funcional',graduacao:'Regional/Grau 1',licenca:'Suspensa',validade:'2026-09-20',regiao:'Associação Regional Norte',contacto:'ines.duarte.teste@fpv-arb.local',disponibilidade:'Disponível',formacao:'Classificação Funcional 2024',seminarios:'Classificação funcional',provas:21,avaliacoes:8,relatoriosAtraso:0,estado:'Suspenso',observacoes:'Suspensão administrativa temporária. Não nomear.',documentos:['Processo de classificação.pdf']},
      { id:8,cod:'ARB-151',nome:'Luís Barros',categoria:'Oficial de Regata',graduacao:'Clube',licenca:'Válida',validade:'2026-12-05',regiao:'Associação Regional Madeira',contacto:'luis.barros.teste@fpv-arb.local',disponibilidade:'Disponível',formacao:'Curso Clube 2025',seminarios:'Oficial de Regata de Clube',provas:8,avaliacoes:4,relatoriosAtraso:0,estado:'Ativo',observacoes:'Pode apoiar provas de clube e secretariado.',documentos:['Ficha de árbitro.pdf']}
    ],
    provas: [
      { id:1,nome:'Campeonato Nacional de ILCA',tipo:'Campeonato Nacional',ambito:'Nacional',inicio:'2026-06-06',fim:'2026-06-08',local:'Cascais',clube:'Clube Naval de Cascais',classes:'ILCA 4, ILCA 6, ILCA 7',barcos:118,campos:'Campo Alfa e Campo Bravo',estado:'Nomeações pendentes',documental:'Aguardando validação',relatorio:'Pendente',necessidades:{'Presidente da Comissão de Regata':1,'Oficial de Regata':2,'Presidente da Comissão de Protestos':1,'Juiz':2,'Medidor':1},checklist:{'Anúncio de Regata':true,'Instruções de Regata':true,'Resultados':false,'Protestos':false,'Decisões':false,'Aditamentos':false,'Relatório de prova':false,'Mapa de nomeações':true,'Documentos de medição':false}},
      { id:2,nome:'Taça de Portugal Optimist',tipo:'Taça de Portugal',ambito:'Nacional',inicio:'2026-06-14',fim:'2026-06-16',local:'Portimão',clube:'Clube Naval de Portimão',classes:'Optimist',barcos:142,campos:'Campo Sul',estado:'Equipa completa',documental:'Validado',relatorio:'Pendente',necessidades:{'Presidente da Comissão de Regata':1,'Oficial de Regata':3,'Juiz':2,'Secretariado de prova':1},checklist:{'Anúncio de Regata':true,'Instruções de Regata':true,'Resultados':false,'Protestos':false,'Decisões':false,'Aditamentos':true,'Relatório de prova':false,'Mapa de nomeações':true,'Documentos de medição':false}},
      { id:3,nome:'Regata Atlântico Norte',tipo:'Prova Internacional',ambito:'Internacional',inicio:'2026-07-04',fim:'2026-07-06',local:'Viana do Castelo',clube:'Clube de Vela de Viana',classes:'ORC, ANC',barcos:34,campos:'Oceânico Norte',estado:'Em preparação',documental:'Aguardando validação',relatorio:'Pendente',necessidades:{'Presidente da Comissão de Regata':1,'Oficial de Regata':1,'Juiz':1,'Apoio técnico':1},checklist:{'Anúncio de Regata':true,'Instruções de Regata':false,'Resultados':false,'Protestos':false,'Decisões':false,'Aditamentos':false,'Relatório de prova':false,'Mapa de nomeações':false,'Documentos de medição':false}},
      { id:4,nome:'Circuito Regional Centro',tipo:'Campeonato Regional',ambito:'Regional',inicio:'2026-05-31',fim:'2026-06-01',local:'Aveiro',clube:'Sporting Clube de Aveiro',classes:'420, Snipe',barcos:48,campos:'Ria de Aveiro',estado:'Planeada',documental:'Incompleto',relatorio:'Pendente',necessidades:{'Oficial de Regata':1,'Juiz':1},checklist:{'Anúncio de Regata':false,'Instruções de Regata':false,'Resultados':false,'Protestos':false,'Decisões':false,'Aditamentos':false,'Relatório de prova':false,'Mapa de nomeações':false,'Documentos de medição':false}},
      { id:5,nome:'Portugal Sailing Grand Prix',tipo:'Prova Internacional',ambito:'Internacional',inicio:'2026-08-21',fim:'2026-08-25',local:'Vilamoura',clube:'Autoridade Organizadora FPV',classes:'49er, 470, Nacra 17',barcos:86,campos:'Campo Olímpico',estado:'Nomeações pendentes',documental:'Aguardando validação',relatorio:'Pendente',necessidades:{'Presidente da Comissão de Regata':1,'Oficial de Regata':4,'Presidente da Comissão de Protestos':1,'Juiz-Árbitro':1,'Medidor':2,'Apoio técnico':2},checklist:{'Anúncio de Regata':true,'Instruções de Regata':false,'Resultados':false,'Protestos':false,'Decisões':false,'Aditamentos':false,'Relatório de prova':false,'Mapa de nomeações':false,'Documentos de medição':true}},
      { id:6,nome:'Troféu Clube Naval Local',tipo:'Prova de Clube',ambito:'Clube',inicio:'2026-04-26',fim:'2026-04-27',local:'Sesimbra',clube:'Clube Naval de Sesimbra',classes:'Cruzeiros',barcos:24,campos:'Baía de Sesimbra',estado:'Concluída',documental:'Validado',relatorio:'Em atraso',necessidades:{'Oficial de Regata':1,'Secretariado de prova':1},checklist:{'Anúncio de Regata':true,'Instruções de Regata':true,'Resultados':true,'Protestos':true,'Decisões':true,'Aditamentos':false,'Relatório de prova':false,'Mapa de nomeações':true,'Documentos de medição':false}}
    ],
    nomeacoes: [
      {id:1,provaId:1,arbitroId:6,funcao:'Presidente da Comissão de Regata',estado:'Aceite',justificacao:''},
      {id:2,provaId:1,arbitroId:2,funcao:'Medidor',estado:'Pendente de resposta',justificacao:''},
      {id:3,provaId:1,arbitroId:1,funcao:'Presidente da Comissão de Protestos',estado:'Enviada',justificacao:''},
      {id:4,provaId:2,arbitroId:6,funcao:'Presidente da Comissão de Regata',estado:'Aceite',justificacao:''},
      {id:5,provaId:2,arbitroId:3,funcao:'Oficial de Regata',estado:'Aceite',justificacao:'Licença por validar aceite por se tratar de apoio sob supervisão.'},
      {id:6,provaId:2,arbitroId:1,funcao:'Juiz',estado:'Aceite',justificacao:''},
      {id:7,provaId:3,arbitroId:7,funcao:'Classificador Funcional',estado:'Rascunho',justificacao:''}
    ],
    disponibilidades: [
      {id:1,arbitroId:1,data:'2026-06-06',provaId:1,estado:'Disponível',observacoes:'Disponível para todo o período da prova.'},
      {id:2,arbitroId:2,data:'2026-06-06',provaId:1,estado:'Por confirmar',observacoes:'A confirmar deslocação.'},
      {id:3,arbitroId:4,data:'2026-06-14',provaId:2,estado:'Indisponível',observacoes:'Compromisso profissional.'},
      {id:4,arbitroId:6,data:'2026-06-14',provaId:2,estado:'Disponível',observacoes:'Disponível para presidência da Comissão de Regata.'},
      {id:5,arbitroId:7,data:'2026-07-04',provaId:3,estado:'Disponível',observacoes:'Sujeito a análise de conflito e estado operacional.'},
      {id:6,arbitroId:8,data:'2026-05-31',provaId:4,estado:'Disponível',observacoes:'Preferência por provas de clube/regional.'}
    ],
    relatorios: [
      {id:1,provaId:6,arbitroId:8,prazo:'2026-05-02',estado:'Em atraso',documentoId:null,observacoes:'Aguarda relatório final e anexos de protestos.'},
      {id:2,provaId:2,arbitroId:6,prazo:'2026-06-21',estado:'Pendente',documentoId:null,observacoes:'Prazo automático: 5 dias após fim da prova.'},
      {id:3,provaId:1,arbitroId:6,prazo:'2026-06-13',estado:'Pendente',documentoId:null,observacoes:'A entregar após conclusão.'},
      {id:4,provaId:4,arbitroId:3,prazo:'2026-06-06',estado:'Pendente',documentoId:null,observacoes:'Relatório simplificado regional.'}
    ],
    conflitos: [
      {id:1,arbitroId:7,provaId:3,tipo:'Ligação a clube',descricao:'Árbitro tem vínculo ao clube organizador.',estado:'Em análise',decisao:'A aguardar deliberação do Conselho de Arbitragem.',responsavel:'Conselho de Arbitragem',observacoes:'Impacto direto na nomeação.'},
      {id:2,arbitroId:2,provaId:1,tipo:'Ligação a atleta',descricao:'Ligação indireta a atleta inscrito.',estado:'Sem impedimento',decisao:'Sem impedimento para função de medição.',responsavel:'Conselho de Arbitragem',observacoes:'Registo mantido por transparência.'},
      {id:3,arbitroId:5,provaId:4,tipo:'Relação familiar',descricao:'Relação familiar com atleta inscrito.',estado:'Impedimento total',decisao:'Não nomear para esta prova.',responsavel:'Conselho de Arbitragem',observacoes:'Impedimento total aceite.'}
    ],
    documentos: [
      {id:1,nome:'Aviso de Regata - Campeonato Nacional ILCA.pdf',tipo:'Avisos de regata',provaId:1,arbitroId:null,versao:'1.0',data:'2026-05-02',estado:'Válido'},
      {id:2,nome:'Instruções de Regata - Optimist.pdf',tipo:'Instruções de regata',provaId:2,arbitroId:null,versao:'1.1',data:'2026-05-08',estado:'Válido'},
      {id:3,nome:'Mapa disponibilidade junho - Miguel Nunes.xlsx',tipo:'Mapas de disponibilidade',provaId:null,arbitroId:2,versao:'1.0',data:'2026-05-10',estado:'Por validar'},
      {id:4,nome:'Ata de protesto 04.pdf',tipo:'Atas',provaId:2,arbitroId:1,versao:'1.0',data:'2026-05-12',estado:'Arquivado'},
      {id:5,nome:'Relatório final Sesimbra.docx',tipo:'Relatórios',provaId:6,arbitroId:8,versao:'0.9',data:'2026-05-13',estado:'Em falta'}
    ],
    comunicacoes: [
      {id:1,destinatario:'Miguel Nunes',tipo:'Pedido de confirmação',estado:'Pendente',data:'2026-05-12 09:20',prioridade:'Alta',mensagem:'Confirmar nomeação como Medidor no Campeonato Nacional de ILCA.'},
      {id:2,destinatario:'Marta Reis',tipo:'Licença a expirar/expirada',estado:'Enviada',data:'2026-05-12 11:45',prioridade:'Alta',mensagem:'Regularização necessária antes de qualquer nomeação.'},
      {id:3,destinatario:'Luís Barros',tipo:'Pedido de relatório',estado:'Pendente',data:'2026-05-13 08:10',prioridade:'Alta',mensagem:'Relatório final da prova de Sesimbra em atraso.'},
      {id:4,destinatario:'Conselho de Arbitragem',tipo:'Conflito declarado',estado:'Lida',data:'2026-05-13 10:00',prioridade:'Crítica',mensagem:'Conflito pendente na Regata Atlântico Norte.'}
    ],
    auditoria: [
      {id:1,data:'2026-05-13 10:12',utilizador:'Conselho de Arbitragem',acao:'Conflito de interesse declarado',entidade:'Regata Atlântico Norte',anterior:'Sem registo',novo:'Em análise',justificacao:'Registo de independência',origem:'Conflitos'},
      {id:2,data:'2026-05-13 09:44',utilizador:'Responsável Operacional',acao:'Árbitro nomeado',entidade:'Campeonato Nacional de ILCA',anterior:'Sem nomeação',novo:'Enviada',justificacao:'Necessidade de equipa',origem:'Nomeações'},
      {id:3,data:'2026-05-12 16:20',utilizador:'Secretariado FPV',acao:'Documento validado',entidade:'Aviso de Regata ILCA',anterior:'Por validar',novo:'Válido',justificacao:'Documento revisto',origem:'Documentos'},
      {id:4,data:'2026-05-12 14:03',utilizador:'Árbitro',acao:'Comunicação de indisponibilidade',entidade:'João Pires',anterior:'Disponível',novo:'Indisponível',justificacao:'Compromisso profissional',origem:'Disponibilidades'}
    ]
  };

  const state = {
    page: 'dashboard',
    selectedRefereeId: 1,
    selectedRaceId: 1,
    filters: {
      arbitros: { q:'', categoria:'', graduacao:'', regiao:'', licenca:'', disponibilidade:'', estado:'' },
      provas: { q:'', tipo:'', ambito:'', local:'', clube:'', estado:'' },
      disponibilidades: { q:'', categoria:'', regiao:'', graduacao:'' },
      documentos: { q:'', tipo:'', estado:'' }
    },
    deferredInstallPrompt: null
  };

  let db = loadData();

  const $ = (id) => document.getElementById(id);
  const copy = (obj) => JSON.parse(JSON.stringify(obj));
  const unique = (arr) => [...new Set(arr.filter(Boolean))].sort((a,b) => String(a).localeCompare(String(b), 'pt-PT'));
  const nextId = (arr) => arr.length ? Math.max(...arr.map(x => Number(x.id) || 0)) + 1 : 1;
  const todayDate = () => new Date(`${TODAY}T00:00:00`);
  const toDate = (v) => new Date(`${v}T00:00:00`);
  const addDays = (date, n) => {
    const d = toDate(date);
    d.setDate(d.getDate() + n);
    return d.toISOString().slice(0,10);
  };
  const daysUntil = (date) => Math.ceil((toDate(date) - todayDate()) / 86400000);
  const fmtDate = (date) => date ? new Intl.DateTimeFormat('pt-PT', { day:'2-digit', month:'short', year:'numeric' }).format(toDate(date)) : '—';
  const nowStamp = () => '2026-05-13 12:00';
  const initials = (name) => name.split(' ').slice(0,2).map(s => s[0]).join('').toUpperCase();
  const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[s]));

  function loadData() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return copy(DEFAULT_DATA);
      const parsed = JSON.parse(raw);
      return { ...copy(DEFAULT_DATA), ...parsed };
    } catch {
      return copy(DEFAULT_DATA);
    }
  }

  function saveData(show = false) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
    if (show) toast('Dados guardados localmente neste dispositivo.');
  }

  function resetData() {
    if (!confirm('Repor dados de ambiente interno/teste? Os dados guardados neste dispositivo serão substituídos.')) return;
    db = copy(DEFAULT_DATA);
    saveData();
    renderAll();
    toast('Dados de teste repostos.');
  }

  function arbitro(id) { return db.arbitros.find(a => Number(a.id) === Number(id)); }
  function prova(id) { return db.provas.find(p => Number(p.id) === Number(id)); }
  function documento(id) { return db.documentos.find(d => Number(d.id) === Number(id)); }

  function badge(kind, text) { return `<span class="badge ${kind}">${escapeHtml(text)}</span>`; }
  const licenceBadge = (v) => badge(v === 'Válida' ? 'ok' : v === 'Por validar' ? 'warn' : 'bad', v);
  const availabilityBadge = (v) => badge(v === 'Disponível' ? 'ok' : v === 'Por confirmar' || v === 'Condicionado' ? 'warn' : 'bad', v);
  const opBadge = (v) => badge(v === 'Ativo' ? 'ok' : v === 'Condicionado' ? 'warn' : v === 'Suspenso' || v === 'Inativo' ? 'bad' : 'neutral', v);
  const docBadge = (v) => badge(v === 'Válido' || v === 'Validado' ? 'ok' : v === 'Em falta' || v === 'Rejeitado' ? 'bad' : v === 'Arquivado' ? 'neutral' : 'warn', v);
  const reportBadge = (v) => badge(v === 'Entregue' || v === 'Validado' ? 'ok' : v === 'Em atraso' || v === 'Em falta' || v === 'Devolvido' ? 'bad' : 'warn', v);
  const appointmentBadge = (v) => badge(['Aceite','Concluída'].includes(v) ? 'ok' : ['Recusada','Cancelada'].includes(v) ? 'bad' : v === 'Substituída' ? 'neutral' : 'warn', v);
  const conflictBadge = (v) => badge(['Sem impedimento','Resolvido'].includes(v) ? 'ok' : v === 'Impedimento total' ? 'bad' : ['Impedimento parcial','Em análise','Declarado'].includes(v) ? 'warn' : 'neutral', v);
  const priorityBadge = (v) => badge(v === 'Crítica' ? 'bad' : v === 'Alta' ? 'warn' : 'info', v);
  const riskBadge = (level) => level === 'block' ? badge('bad','Bloqueio') : level === 'critical' ? badge('bad','Alerta crítico') : level === 'moderate' ? badge('warn','Alerta moderado') : badge('ok','Sem risco');
  const raceStatusBadge = (v) => badge(['Equipa completa','Concluída','Encerrada'].includes(v) ? 'ok' : ['Nomeações pendentes','Em preparação'].includes(v) ? 'warn' : v === 'Em curso' ? 'info' : 'neutral', v);

  function registerAudit(acao, entidade, anterior, novo, justificacao = 'Registo operacional', origem = state.page) {
    db.auditoria.unshift({ id: nextId(db.auditoria), data: nowStamp(), utilizador: 'Sessão institucional', acao, entidade, anterior, novo, justificacao, origem });
    saveData();
  }

  function renderNav() {
    $('mainNav').innerHTML = NAV.map(([id, icon, label]) => `
      <button type="button" class="${state.page === id ? 'active' : ''}" data-nav="${id}" aria-current="${state.page === id ? 'page' : 'false'}">
        <span class="nav-icon">${icon}</span><span>${label}</span>
      </button>`).join('');
  }

  function navigate(page) {
    state.page = page;
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    $(page).classList.add('active');
    const [eyebrow, title, subtitle] = META[page];
    $('pageEyebrow').textContent = eyebrow;
    $('pageTitle').textContent = title;
    $('pageSubtitle').textContent = subtitle;
    renderNav();
    renderActions();
    closeSidebar();
    if (page === 'perfil') renderPerfil();
    $('mainContent').focus({ preventScroll: true });
    localStorage.setItem(PREF_KEY, JSON.stringify({ page }));
    if (location.hash !== `#${page}`) history.replaceState(null, '', `#${page}`);
  }

  function renderActions() {
    const map = {
      dashboard: `<button class="btn" data-action="save-local">Guardar dados localmente</button><button class="btn btn-primary" data-nav="nomeacoes">Gerir nomeações</button>`,
      arbitros: `<button class="btn" data-export="arbitros">Exportar CSV</button><button class="btn btn-primary" data-modal="arbitro">Novo árbitro</button>`,
      provas: `<button class="btn" data-export="provas">Exportar CSV</button><button class="btn btn-primary" data-modal="prova">Nova prova</button>`,
      nomeacoes: `<button class="btn" data-export="nomeacoes">Exportar CSV</button><button class="btn btn-primary" data-modal="nomeacao">Nova nomeação</button>`,
      disponibilidades: `<button class="btn" data-export="disponibilidades">Exportar CSV</button><button class="btn btn-primary" data-modal="disponibilidade">Registar disponibilidade</button>`,
      credenciacao: `<button class="btn" data-action="review-credentials">Rever alertas</button>`,
      relatorios: `<button class="btn" data-export="relatorios">Exportar CSV</button><button class="btn btn-primary" data-modal="relatorio">Registar relatório</button>`,
      conflitos: `<button class="btn" data-export="conflitos">Exportar CSV</button><button class="btn btn-primary" data-modal="conflito">Registar conflito</button>`,
      documentos: `<button class="btn btn-primary" data-modal="documento">Adicionar documento</button>`,
      comunicacoes: `<button class="btn btn-primary" data-action="send-message">Enviar aviso</button>`,
      auditoria: `<button class="btn" data-export="auditoria">Exportar CSV</button>`,
      perfis: `<button class="btn" data-action="reset-data">Repor dados de teste</button>`
    };
    const install = state.deferredInstallPrompt ? `<button class="btn btn-primary" data-action="install-app">Instalar aplicação</button>` : '';
    $('pageActions').innerHTML = `${install}${map[state.page] || ''}`;
  }

  function riskSummary(a) {
    const risks = db.provas.map(p => validateAppointment(a, p, 'Juiz')).flat();
    if (a.licenca !== 'Válida' || ['Suspenso','Inativo'].includes(a.estado)) return 'Alto';
    if (risks.some(r => r.level === 'critical')) return 'Médio';
    if (risks.some(r => r.level === 'moderate')) return 'Moderado';
    return 'Baixo';
  }

  function updateReportDeadlines() {
    db.relatorios.forEach(r => {
      const p = prova(r.provaId);
      if (!p) return;
      const expected = addDays(p.fim, 5);
      r.prazo = r.prazo || expected;
      if (r.estado !== 'Entregue' && r.estado !== 'Validado' && toDate(r.prazo) < todayDate()) r.estado = 'Em atraso';
    });
  }

  function dashboardMetrics() {
    updateReportDeadlines();
    const future = db.provas.filter(p => p.fim >= TODAY);
    const incompleteTeams = db.provas.filter(p => teamProgress(p).missing > 0 && p.fim >= TODAY);
    const pendingNominations = db.nomeacoes.filter(n => ['Rascunho','Enviada','Pendente de resposta'].includes(n.estado));
    const refusedNominations = db.nomeacoes.filter(n => n.estado === 'Recusada');
    const available = db.arbitros.filter(a => a.disponibilidade === 'Disponível' && a.licenca === 'Válida' && a.estado === 'Ativo');
    const missingMaps = db.arbitros.filter(a => !db.disponibilidades.some(d => Number(d.arbitroId) === Number(a.id)));
    const expiredLicences = db.arbitros.filter(a => ['Expirada','Suspensa'].includes(a.licenca));
    const expiringLicences = db.arbitros.filter(a => a.licenca === 'Válida' && daysUntil(a.validade) >= 0 && daysUntil(a.validade) <= 60);
    const lateReports = db.relatorios.filter(r => r.estado === 'Em atraso');
    const pendingConflicts = db.conflitos.filter(c => ['Declarado','Em análise'].includes(c.estado));
    const missingDocs = db.provas.filter(p => ['Incompleto','Aguardando validação'].includes(p.documental)).concat(db.documentos.filter(d => ['Em falta','Por validar'].includes(d.estado)));
    const criticalTasks = incompleteTeams.length + lateReports.length + pendingConflicts.length + expiredLicences.length + missingDocs.length;
    return { future, incompleteTeams, pendingNominations, refusedNominations, available, missingMaps, expiredLicences, expiringLicences, lateReports, pendingConflicts, missingDocs, criticalTasks };
  }

  function teamProgress(p) {
    const required = Object.values(p.necessidades || {}).reduce((sum, n) => sum + Number(n), 0);
    const named = db.nomeacoes.filter(n => Number(n.provaId) === Number(p.id) && !['Cancelada','Recusada'].includes(n.estado)).length;
    return { required, named, missing: Math.max(0, required - named), pct: required ? Math.min(100, Math.round(named / required * 100)) : 100 };
  }

  function renderDashboard() {
    const m = dashboardMetrics();
    const kpis = [
      ['Provas futuras', m.future.length, 'Calendário que ainda exige acompanhamento.', 'provas'],
      ['Provas sem equipa completa', m.incompleteTeams.length, 'Necessidades de arbitragem por fechar.', 'provas'],
      ['Nomeações pendentes', m.pendingNominations.length, 'Rascunho, enviadas ou sem resposta.', 'nomeacoes'],
      ['Nomeações recusadas', m.refusedNominations.length, 'Requerem substituição ou decisão.', 'nomeacoes'],
      ['Árbitros disponíveis', m.available.length, 'Ativos, disponíveis e com licença válida.', 'arbitros'],
      ['Sem mapa de disponibilidade', m.missingMaps.length, 'Árbitros sem mapa registado.', 'disponibilidades'],
      ['Licenças expiradas/suspensas', m.expiredLicences.length, 'Bloqueiam nomeação.', 'credenciacao'],
      ['Licenças a expirar', m.expiringLicences.length, 'Validade inferior a 60 dias.', 'credenciacao'],
      ['Relatórios em atraso', m.lateReports.length, 'Prazo de 5 dias ultrapassado.', 'relatorios'],
      ['Conflitos pendentes', m.pendingConflicts.length, 'Aguardam análise ou decisão.', 'conflitos'],
      ['Documentos pendentes', m.missingDocs.length, 'Em falta ou por validar.', 'documentos'],
      ['Tarefas críticas', m.criticalTasks, 'Ações prioritárias da operação.', 'auditoria']
    ];
    $('dashboard').innerHTML = `
      ${installBanner()}
      <div class="local-note"><strong>ℹ</strong><div><strong>Persistência local ativa.</strong><br><small>Os registos ficam guardados neste dispositivo através de localStorage. Para produção será necessário backend, base de dados e autenticação.</small></div></div>
      <div class="grid kpis">${kpis.map(([l,v,h,page]) => `<article class="card kpi clickable" data-nav="${page}" tabindex="0"><div class="kpi-label">${l}</div><div class="kpi-value">${v}</div><div class="kpi-hint">${h}</div></article>`).join('')}</div>
      <div class="grid two">
        <section class="card critical"><div class="panel"><h3>Alertas operacionais</h3><button class="mini touch" data-nav="auditoria">Ver auditoria</button></div><div class="list">${renderAlerts()}</div></section>
        <section class="card"><div class="panel"><h3>Estado das equipas de arbitragem</h3><button class="mini touch" data-nav="provas">Ver provas</button></div><div class="list">${db.provas.slice(0,6).map(p => renderTeamStatus(p)).join('')}</div></section>
      </div>`;
  }

  function installBanner() {
    if (!state.deferredInstallPrompt) return '';
    return `<div class="card install-banner"><div><strong>Instalação disponível</strong><p class="row-sub">Pode instalar esta plataforma como aplicação no dispositivo.</p></div><button class="btn btn-primary" data-action="install-app">Instalar aplicação</button></div>`;
  }

  function renderAlerts() {
    const m = dashboardMetrics();
    const alerts = [
      ['bad','Relatórios','Relatórios pós-prova em atraso', `${m.lateReports.length} relatório(s) ultrapassaram o prazo de 5 dias.`, 'relatorios'],
      ['bad','Conflitos','Conflitos por decidir', `${m.pendingConflicts.length} conflito(s) aguardam decisão do Conselho de Arbitragem.`, 'conflitos'],
      ['warn','Licenças','Licenças expiradas ou a expirar', `${m.expiredLicences.length + m.expiringLicences.length} situação(ões) exigem revisão.`, 'credenciacao'],
      ['warn','Disponibilidade','Mapas de disponibilidade em falta', `${m.missingMaps.length} árbitro(s) sem mapa registado.`, 'disponibilidades'],
      ['info','Documentos','Documentos pendentes', `${m.missingDocs.length} item(ns) em falta ou por validar.`, 'documentos']
    ];
    return alerts.map(([kind,type,title,text,page]) => `<div class="item"><div>${badge(kind,type)}<p><strong>${title}</strong></p><p>${text}</p></div><button class="mini touch" data-nav="${page}">Abrir</button></div>`).join('');
  }

  function renderTeamStatus(p) {
    const t = teamProgress(p);
    return `<div class="item"><div style="width:100%"><strong>${escapeHtml(p.nome)}</strong><p>${fmtDate(p.inicio)} · ${escapeHtml(p.local)} · ${t.named}/${t.required} elementos</p><div class="progress" aria-label="Progresso da equipa"><span style="width:${t.pct}%"></span></div></div>${t.missing ? badge('warn', `${t.missing} em falta`) : badge('ok','Completa')}</div>`;
  }

  function renderArbitros() {
    const f = state.filters.arbitros;
    const list = db.arbitros.filter(a =>
      (!f.q || `${a.nome} ${a.cod} ${a.contacto} ${a.categoria}`.toLowerCase().includes(f.q.toLowerCase())) &&
      (!f.categoria || a.categoria === f.categoria) && (!f.graduacao || a.graduacao === f.graduacao) &&
      (!f.regiao || a.regiao === f.regiao) && (!f.licenca || a.licenca === f.licenca) &&
      (!f.disponibilidade || a.disponibilidade === f.disponibilidade) && (!f.estado || a.estado === f.estado)
    );
    const filters = `
      <input class="input" placeholder="Pesquisar nome, código, categoria" value="${escapeHtml(f.q)}" data-filter="arbitros.q">
      ${selectFilter('arbitros.categoria','Categoria',unique(db.arbitros.map(a=>a.categoria)),f.categoria)}
      ${selectFilter('arbitros.graduacao','Graduação',unique(db.arbitros.map(a=>a.graduacao)),f.graduacao)}
      ${selectFilter('arbitros.regiao','Região',unique(db.arbitros.map(a=>a.regiao)),f.regiao)}
      ${selectFilter('arbitros.licenca','Licença',unique(db.arbitros.map(a=>a.licenca)),f.licenca)}
      ${selectFilter('arbitros.disponibilidade','Disponibilidade',unique(db.arbitros.map(a=>a.disponibilidade)),f.disponibilidade)}
      ${selectFilter('arbitros.estado','Estado',unique(db.arbitros.map(a=>a.estado)),f.estado)}`;

    $('arbitros').innerHTML = `
      <div class="card"><div class="toolbar"><div class="filters">${filters}</div><button class="btn" data-clear-filter="arbitros">Limpar filtros</button></div>
        <div class="table-wrap"><table><thead><tr><th>Árbitro</th><th>Categoria</th><th>Graduação</th><th>Licença</th><th>Região</th><th>Disponibilidade</th><th>Formação</th><th>Provas</th><th>Avaliações</th><th>Relatórios atraso</th><th>Conflitos</th><th>Estado</th><th>Ações</th></tr></thead><tbody>${list.map(rowArbitro).join('') || emptyRow(13)}</tbody></table></div>
        <div class="mobile-cards">${list.map(cardArbitro).join('') || emptyState('Nenhum árbitro corresponde aos filtros aplicados.')}</div>
      </div>`;
  }

  function rowArbitro(a) {
    return `<tr><td><div class="row-title">${escapeHtml(a.nome)}</div><div class="row-sub">${a.cod} · ${a.contacto}</div></td><td>${a.categoria}</td><td>${a.graduacao}</td><td>${licenceBadge(a.licenca)}<div class="row-sub">até ${fmtDate(a.validade)}</div></td><td>${a.regiao}</td><td>${availabilityBadge(a.disponibilidade)}</td><td>${a.formacao}</td><td><strong>${a.provas}</strong></td><td>${a.avaliacoes}</td><td>${a.relatoriosAtraso}</td><td>${activeConflicts(a.id).length}</td><td>${opBadge(a.estado)}</td><td><div class="row-actions">${arbitroActions(a.id)}</div></td></tr>`;
  }

  function cardArbitro(a) {
    return `<article class="data-card"><header><div><h3>${escapeHtml(a.nome)}</h3><p class="row-sub">${a.cod} · ${a.contacto}</p></div>${opBadge(a.estado)}</header><div>${licenceBadge(a.licenca)} ${availabilityBadge(a.disponibilidade)}</div><div class="meta-grid"><div class="meta"><span>Categoria</span><strong>${a.categoria}</strong></div><div class="meta"><span>Graduação</span><strong>${a.graduacao}</strong></div><div class="meta"><span>Região</span><strong>${a.regiao}</strong></div><div class="meta"><span>Relatórios atraso</span><strong>${a.relatoriosAtraso}</strong></div></div><div class="row-actions">${arbitroActions(a.id)}</div></article>`;
  }

  function arbitroActions(id) {
    return `<button class="mini touch" data-profile="${id}">Perfil</button><button class="mini touch" data-modal="arbitro" data-id="${id}">Editar</button><button class="mini touch" data-action="mark-unavailable" data-id="${id}">Indisponível</button><button class="mini touch" data-modal="documento" data-arbitro="${id}">Documento</button><button class="mini touch" data-modal="conflito" data-arbitro="${id}">Conflito</button>`;
  }

  function renderPerfil() {
    const a = arbitro(state.selectedRefereeId) || db.arbitros[0];
    if (!a) return;
    const nominations = db.nomeacoes.filter(n => n.arbitroId === a.id);
    const reports = db.relatorios.filter(r => r.arbitroId === a.id);
    const docs = db.documentos.filter(d => d.arbitroId === a.id);
    const conflicts = db.conflitos.filter(c => c.arbitroId === a.id);
    $('perfil').innerHTML = `
      <div class="grid profile-layout">
        <aside class="profile-box"><div class="profile-head"><div class="big-avatar">${initials(a.nome)}</div><div><h3>${escapeHtml(a.nome)}</h3><p class="row-sub">${a.cod} · ${a.categoria}</p></div></div>
          ${metric('Graduação', a.graduacao)}${metric('Licença', `${a.licenca} · ${fmtDate(a.validade)}`)}${metric('Região', a.regiao)}${metric('Disponibilidade', a.disponibilidade)}${metric('Estado operacional', a.estado)}${metric('Risco de nomeação', riskSummary(a))}
          <div class="row-actions" style="margin-top:16px"><button class="btn btn-primary" data-modal="nomeacao" data-arbitro="${a.id}">Nomear</button><button class="btn" data-modal="arbitro" data-id="${a.id}">Editar</button><button class="btn" data-modal="disponibilidade" data-arbitro="${a.id}">Disponibilidade</button></div>
        </aside>
        <div class="grid">
          <section class="card"><div class="panel"><h3>Resumo operacional</h3>${credentialBadge(a)}</div><div class="grid three"><div class="item"><div><strong>${nominations.filter(n=>['Rascunho','Enviada','Pendente de resposta'].includes(n.estado)).length}</strong><p>Nomeações pendentes</p></div></div><div class="item"><div><strong>${reports.filter(r=>['Entregue','Validado'].includes(r.estado)).length}</strong><p>Relatórios entregues/validados</p></div></div><div class="item"><div><strong>${reports.filter(r=>!['Entregue','Validado'].includes(r.estado)).length}</strong><p>Relatórios em falta</p></div></div></div></section>
          <section class="card"><div class="panel"><h3>Formação e observações</h3></div><div class="list"><div class="item"><div><strong>Formação recente</strong><p>${a.formacao}</p></div></div><div class="item"><div><strong>Seminários</strong><p>${a.seminarios || 'Sem registos complementares.'}</p></div></div><div class="item"><div><strong>Observações do Conselho de Arbitragem</strong><p>${a.observacoes}</p></div></div></div></section>
          <div class="grid two"><section class="card"><div class="panel"><h3>Documentos</h3><button class="mini touch" data-modal="documento" data-arbitro="${a.id}">Associar</button></div><div class="list">${docs.map(d=>`<div class="item"><div><strong>${d.nome}</strong><p>${d.tipo} · ${fmtDate(d.data)} · v${d.versao}</p></div>${docBadge(d.estado)}</div>`).join('') || emptyState('Sem documentos associados.')}</div></section><section class="card"><div class="panel"><h3>Conflitos</h3><button class="mini touch" data-modal="conflito" data-arbitro="${a.id}">Registar</button></div><div class="list">${conflicts.map(c=>`<div class="item"><div><strong>${c.tipo}</strong><p>${prova(c.provaId)?.nome || 'Sem prova'} · ${c.descricao}</p></div>${conflictBadge(c.estado)}</div>`).join('') || emptyState('Sem conflitos registados.')}</div></section></div>
          <section class="card"><div class="panel"><h3>Linha temporal</h3></div><div class="timeline">${timeline(a).map(t => `<div class="timeline-row"><small>${t.data}</small><div class="timeline-content"><strong>${t.titulo}</strong><p class="row-sub">${t.texto}</p></div></div>`).join('')}</div></section>
        </div>
      </div>`;
  }

  function metric(label, value) { return `<div class="metric"><span>${label}</span><span>${escapeHtml(value)}</span></div>`; }

  function timeline(a) {
    return [
      { data:'2026-05-13', titulo:'Avaliação registada', texto:`${a.avaliacoes} avaliações positivas acumuladas.` },
      { data:'2026-05-12', titulo:'Formação concluída', texto:a.formacao },
      { data:'2026-05-10', titulo:'Licença revista', texto:`Licença ${a.licenca} até ${fmtDate(a.validade)}.` },
      ...db.nomeacoes.filter(n => n.arbitroId === a.id).map(n => ({ data: prova(n.provaId)?.inicio || TODAY, titulo:'Nomeado para prova', texto:`${prova(n.provaId)?.nome} · ${n.funcao} · ${n.estado}` })),
      ...db.conflitos.filter(c => c.arbitroId === a.id).map(c => ({ data:TODAY, titulo:'Conflito declarado', texto:`${c.tipo} · ${c.estado}` }))
    ].slice(0, 8);
  }

  function renderProvas() {
    const f = state.filters.provas;
    const list = db.provas.filter(p =>
      (!f.q || `${p.nome} ${p.local} ${p.clube} ${p.classes}`.toLowerCase().includes(f.q.toLowerCase())) &&
      (!f.tipo || p.tipo === f.tipo) && (!f.ambito || p.ambito === f.ambito) && (!f.local || p.local === f.local) &&
      (!f.clube || p.clube === f.clube) && (!f.estado || p.estado === f.estado)
    );
    $('provas').innerHTML = `<div class="card"><div class="toolbar"><div class="filters"><input class="input" placeholder="Pesquisar prova, local ou classe" value="${escapeHtml(f.q)}" data-filter="provas.q">${selectFilter('provas.tipo','Tipo',unique(db.provas.map(p=>p.tipo)),f.tipo)}${selectFilter('provas.ambito','Âmbito',unique(db.provas.map(p=>p.ambito)),f.ambito)}${selectFilter('provas.local','Local',unique(db.provas.map(p=>p.local)),f.local)}${selectFilter('provas.clube','Organização',unique(db.provas.map(p=>p.clube)),f.clube)}${selectFilter('provas.estado','Estado',unique(db.provas.map(p=>p.estado)),f.estado)}</div><button class="btn" data-clear-filter="provas">Limpar filtros</button></div><div class="table-wrap"><table><thead><tr><th>Prova</th><th>Tipo</th><th>Âmbito</th><th>Datas</th><th>Local</th><th>Organização</th><th>Classes</th><th>Barcos</th><th>Equipa</th><th>Docs</th><th>Relatório</th><th>Ações</th></tr></thead><tbody>${list.map(rowProva).join('') || emptyRow(12)}</tbody></table></div><div class="mobile-cards">${list.map(cardProva).join('') || emptyState('Nenhuma prova corresponde aos filtros.')}</div></div>`;
  }

  function rowProva(p) {
    const t = teamProgress(p);
    return `<tr><td><div class="row-title">${p.nome}</div><div class="row-sub">${p.campos}</div></td><td>${p.tipo}</td><td>${p.ambito}</td><td>${fmtDate(p.inicio)} — ${fmtDate(p.fim)}</td><td>${p.local}</td><td>${p.clube}</td><td>${p.classes}</td><td>${p.barcos}</td><td>${t.named}/${t.required} ${t.missing ? badge('warn','Incompleta') : badge('ok','Completa')}</td><td>${docBadge(p.documental)}</td><td>${reportBadge(computedReportStatus(p))}</td><td><div class="row-actions"><button class="mini touch" data-detail-prova="${p.id}">Detalhes</button><button class="mini touch" data-modal="prova" data-id="${p.id}">Editar</button><button class="mini touch" data-select-race="${p.id}">Nomear</button></div></td></tr>`;
  }

  function cardProva(p) {
    const t = teamProgress(p);
    return `<article class="data-card"><header><div><h3>${p.nome}</h3><p class="row-sub">${fmtDate(p.inicio)} — ${fmtDate(p.fim)} · ${p.local}</p></div>${raceStatusBadge(p.estado)}</header><div>${docBadge(p.documental)} ${reportBadge(computedReportStatus(p))}</div><div class="meta-grid"><div class="meta"><span>Tipo</span><strong>${p.tipo}</strong></div><div class="meta"><span>Âmbito</span><strong>${p.ambito}</strong></div><div class="meta"><span>Classes</span><strong>${p.classes}</strong></div><div class="meta"><span>Equipa</span><strong>${t.named}/${t.required}</strong></div></div><div class="row-actions"><button class="mini touch" data-detail-prova="${p.id}">Detalhes</button><button class="mini touch" data-modal="prova" data-id="${p.id}">Editar</button><button class="mini touch" data-select-race="${p.id}">Nomear</button></div></article>`;
  }

  function computedReportStatus(p) {
    const r = db.relatorios.find(x => x.provaId === p.id);
    if (!r) return p.relatorio;
    if (!['Entregue','Validado'].includes(r.estado) && toDate(r.prazo) < todayDate()) return 'Em atraso';
    return r.estado;
  }

  function renderNomeacoes() {
    const p = prova(state.selectedRaceId) || db.provas[0];
    if (!p) return;
    const selected = db.nomeacoes.filter(n => n.provaId === p.id);
    $('nomeacoes').innerHTML = `<div class="grid appointment-layout"><section class="card"><div class="panel"><h3>Prova e necessidades</h3></div><select class="select" data-select-main-race>${db.provas.map(x=>`<option value="${x.id}" ${x.id===p.id?'selected':''}>${x.nome} · ${fmtDate(x.inicio)}</option>`).join('')}</select><div class="list" style="margin-top:14px"><div class="item"><div><strong>${p.nome}</strong><p>${p.local} · ${p.ambito} · ${p.classes}</p></div>${raceStatusBadge(p.estado)}</div>${Object.entries(p.necessidades).map(([funcao,qtd]) => needLine(p, funcao, qtd)).join('')}</div></section><section class="card"><div class="panel"><h3>Árbitros elegíveis</h3><button class="mini touch" data-modal="nomeacao">Nomeação manual</button></div><div class="list">${db.arbitros.map(a => candidateLine(a,p)).join('')}</div></section></div><section class="card" style="margin-top:16px"><div class="panel"><h3>Equipa nomeada</h3></div><div class="table-wrap"><table><thead><tr><th>Árbitro</th><th>Função</th><th>Estado</th><th>Validação</th><th>Justificação</th><th>Ações</th></tr></thead><tbody>${selected.map(rowNomeacao).join('') || emptyRow(6)}</tbody></table></div><div class="mobile-cards">${selected.map(cardNomeacao).join('') || emptyState('Ainda não existem nomeações para esta prova.')}</div></section>`;
  }

  function needLine(p, funcao, qtd) {
    const named = db.nomeacoes.filter(n => n.provaId === p.id && n.funcao === funcao && !['Cancelada','Recusada'].includes(n.estado)).length;
    return `<div class="item"><div><strong>${funcao}</strong><p>Necessários: ${qtd} · Nomeados: ${named}</p></div><button class="mini touch" data-modal="nomeacao" data-funcao="${escapeHtml(funcao)}">Nomear</button></div>`;
  }

  function candidateLine(a,p) {
    const v = validateAppointment(a,p,'Juiz');
    const max = riskLevel(v);
    const already = db.nomeacoes.some(n => n.provaId === p.id && n.arbitroId === a.id && !['Cancelada','Recusada'].includes(n.estado));
    return `<div class="candidate ${max === 'block' ? 'block' : ''}"><div><strong>${a.nome}</strong><p>${a.categoria} · ${a.graduacao} · ${a.regiao}</p>${riskBadge(max)} ${already ? badge('info','Já nomeado') : ''}<div style="margin-top:6px">${v.slice(0,3).map(r => badge(r.level === 'block' ? 'bad' : r.level === 'critical' ? 'bad' : 'warn', r.message)).join('') || badge('ok','Sem risco')}</div></div><button class="mini touch" ${already || max === 'block' ? 'disabled' : ''} data-modal="nomeacao" data-arbitro="${a.id}">Nomear</button></div>`;
  }

  function rowNomeacao(n) {
    const a = arbitro(n.arbitroId), p = prova(n.provaId), v = validateAppointment(a,p,n.funcao);
    return `<tr><td><div class="row-title">${a?.nome || 'Árbitro removido'}</div><div class="row-sub">${a?.categoria || ''} · ${a?.graduacao || ''}</div></td><td>${n.funcao}</td><td>${appointmentBadge(n.estado)}</td><td>${riskBadge(riskLevel(v))}<div class="row-sub">${v.map(x=>x.message).join('; ') || 'Sem risco identificado'}</div></td><td>${n.justificacao || '—'}</td><td><div class="row-actions">${appointmentActions(n.id)}</div></td></tr>`;
  }

  function cardNomeacao(n) {
    const a = arbitro(n.arbitroId), p = prova(n.provaId), v = validateAppointment(a,p,n.funcao);
    return `<article class="data-card"><header><div><h3>${a?.nome || 'Árbitro removido'}</h3><p class="row-sub">${n.funcao}</p></div>${appointmentBadge(n.estado)}</header><div>${riskBadge(riskLevel(v))}</div><p class="row-sub">${v.map(x=>x.message).join('; ') || 'Sem risco identificado'}</p><div class="row-actions">${appointmentActions(n.id)}</div></article>`;
  }

  function appointmentActions(id) {
    return `<button class="mini touch" data-set-nomination="${id}:Aceite">Aceitar</button><button class="mini touch" data-refuse-nomination="${id}">Recusar</button><button class="mini touch" data-set-nomination="${id}:Substituída">Substituir</button><button class="mini touch" data-set-nomination="${id}:Cancelada">Cancelar</button><button class="mini touch" data-set-nomination="${id}:Concluída">Concluir</button>`;
  }

  function validateAppointment(a, p, funcao) {
    const risks = [];
    if (!a || !p) return [{ level:'block', message:'Registo inválido' }];
    if (a.licenca === 'Expirada') risks.push({ level:'block', message:'Licença expirada' });
    if (a.licenca === 'Suspensa') risks.push({ level:'block', message:'Licença suspensa' });
    if (['Suspenso','Inativo'].includes(a.estado)) risks.push({ level:'block', message:'Árbitro suspenso ou inativo' });
    const disp = availabilityFor(a.id, p.id, p.inicio);
    if (disp === 'Indisponível') risks.push({ level:'block', message:'Indisponível na data da prova' });
    const conflict = db.conflitos.find(c => c.arbitroId === a.id && c.provaId === p.id && !['Resolvido','Arquivado','Sem impedimento'].includes(c.estado));
    if (conflict?.estado === 'Impedimento total') risks.push({ level:'block', message:'Conflito com impedimento total' });

    if (a.licenca === 'Por validar') risks.push({ level:'critical', message:'Licença por validar' });
    if (conflict && ['Declarado','Em análise'].includes(conflict.estado)) risks.push({ level:'critical', message:'Conflito em análise' });
    if (a.relatoriosAtraso > 0) risks.push({ level:'critical', message:'Relatório anterior em atraso' });
    if (!isGradeSuitable(a.graduacao, funcao)) risks.push({ level:'critical', message:'Graduação possivelmente insuficiente' });
    if (!isCategorySuitable(a.categoria, funcao)) risks.push({ level:'critical', message:'Nomeação fora da categoria principal' });

    if (disp === 'Por confirmar' || a.disponibilidade === 'Por confirmar') risks.push({ level:'moderate', message:'Disponibilidade por confirmar' });
    if (a.licenca === 'Válida' && daysUntil(a.validade) >= 0 && daysUntil(a.validade) <= 60) risks.push({ level:'moderate', message:'Licença a expirar brevemente' });
    if (a.provas >= 45) risks.push({ level:'moderate', message:'Elevada carga de provas recentes' });
    if (!sameRegion(a, p)) risks.push({ level:'moderate', message:'Distância/localização desfavorável' });
    if (overlapsWithOtherRace(a.id, p)) risks.push({ level:'critical', message:'Sobreposição com outra prova' });
    if (needFilled(p, funcao)) risks.push({ level:'moderate', message:'Necessidade mínima da função já preenchida' });
    return risks;
  }

  function riskLevel(risks) {
    if (risks.some(r => r.level === 'block')) return 'block';
    if (risks.some(r => r.level === 'critical')) return 'critical';
    if (risks.some(r => r.level === 'moderate')) return 'moderate';
    return 'none';
  }

  function availabilityFor(arbitroId, provaId, date) {
    const d = db.disponibilidades.find(x => x.arbitroId === arbitroId && (x.provaId === provaId || x.data === date));
    return d?.estado || arbitro(arbitroId)?.disponibilidade;
  }

  function activeConflicts(arbitroId) { return db.conflitos.filter(c => c.arbitroId === arbitroId && !['Resolvido','Arquivado','Sem impedimento'].includes(c.estado)); }
  function sameRegion(a,p) { return a.regiao.toLowerCase().includes(p.local.toLowerCase()) || p.local.toLowerCase().includes('cascais') && a.regiao.includes('Lisboa') || p.local.toLowerCase().includes('aveiro') && a.regiao.includes('Centro') || p.local.toLowerCase().includes('portimão') && a.regiao.includes('Sul'); }
  function overlap(p1,p2) { return p1 && p2 && p1.inicio <= p2.fim && p2.inicio <= p1.fim; }
  function overlapsWithOtherRace(arbitroId,p) { return db.nomeacoes.some(n => n.arbitroId === arbitroId && n.provaId !== p.id && ['Aceite','Pendente de resposta','Enviada'].includes(n.estado) && overlap(prova(n.provaId), p)); }
  function needFilled(p,funcao) { const req = p.necessidades?.[funcao] || 0; const named = db.nomeacoes.filter(n => n.provaId === p.id && n.funcao === funcao && !['Cancelada','Recusada'].includes(n.estado)).length; return req > 0 && named >= req; }
  function isGradeSuitable(grade,funcao) { if (!funcao) return true; if (funcao.includes('Presidente') || funcao === 'Juiz-Árbitro') return ['Nacional','Nacional/Grau 2'].includes(grade); return true; }
  function isCategorySuitable(cat,funcao) { if (!funcao) return true; if (funcao.includes('Comissão de Regata') || funcao === 'Oficial de Regata') return cat === 'Oficial de Regata'; if (funcao.includes('Protestos') || funcao === 'Juiz') return ['Juiz','Juiz-Árbitro'].includes(cat); if (funcao === 'Medidor') return cat === 'Medidor'; if (funcao === 'Classificador Funcional') return cat === 'Classificador Funcional'; return true; }

  function renderDisponibilidades() {
    const f = state.filters.disponibilidades;
    const refs = db.arbitros.filter(a => (!f.q || a.nome.toLowerCase().includes(f.q.toLowerCase())) && (!f.categoria || a.categoria===f.categoria) && (!f.regiao || a.regiao===f.regiao) && (!f.graduacao || a.graduacao===f.graduacao));
    $('disponibilidades').innerHTML = `<div class="card"><div class="toolbar"><div class="filters"><input class="input" placeholder="Pesquisar árbitro" value="${escapeHtml(f.q)}" data-filter="disponibilidades.q">${selectFilter('disponibilidades.categoria','Categoria',unique(db.arbitros.map(a=>a.categoria)),f.categoria)}${selectFilter('disponibilidades.regiao','Região',unique(db.arbitros.map(a=>a.regiao)),f.regiao)}${selectFilter('disponibilidades.graduacao','Graduação',unique(db.arbitros.map(a=>a.graduacao)),f.graduacao)}</div><button class="btn" data-action="missing-maps">Gerar alerta mapas em falta</button></div><div class="calendar">${db.disponibilidades.map(d => `<div class="day"><strong>${fmtDate(d.data)}</strong>${availabilityBadge(d.estado)}<p class="row-sub">${prova(d.provaId)?.nome || 'Disponibilidade geral'}</p><small>${arbitro(d.arbitroId)?.nome}</small></div>`).join('')}</div></div><section class="card" style="margin-top:16px"><div class="panel"><h3>Mapa por árbitro</h3></div><div class="table-wrap"><table><thead><tr><th>Árbitro</th><th>Categoria</th><th>Região</th><th>Graduação</th><th>Último registo</th><th>Estado geral</th><th>Ações</th></tr></thead><tbody>${refs.map(a => rowAvailability(a)).join('')}</tbody></table></div><div class="mobile-cards">${refs.map(cardAvailability).join('')}</div></section>`;
  }

  function rowAvailability(a) { const ds = db.disponibilidades.filter(d => d.arbitroId === a.id); return `<tr><td><div class="row-title">${a.nome}</div><div class="row-sub">${a.cod}</div></td><td>${a.categoria}</td><td>${a.regiao}</td><td>${a.graduacao}</td><td>${ds.length ? fmtDate(ds.at(-1).data) : 'Sem mapa'}</td><td>${ds.length ? availabilityBadge(a.disponibilidade) : badge('warn','Mapa em falta')}</td><td><button class="mini touch" data-modal="disponibilidade" data-arbitro="${a.id}">Registar</button></td></tr>`; }
  function cardAvailability(a) { const ds = db.disponibilidades.filter(d => d.arbitroId === a.id); return `<article class="data-card"><header><div><h3>${a.nome}</h3><p class="row-sub">${a.categoria} · ${a.regiao}</p></div>${ds.length ? availabilityBadge(a.disponibilidade) : badge('warn','Mapa em falta')}</header><button class="mini touch" data-modal="disponibilidade" data-arbitro="${a.id}">Registar disponibilidade</button></article>`; }

  function renderCredenciacao() {
    $('credenciacao').innerHTML = `<section class="card"><div class="panel"><h3>Controlo de credenciação</h3></div><div class="table-wrap"><table><thead><tr><th>Árbitro</th><th>Categoria</th><th>Graduação</th><th>Licença</th><th>Validade</th><th>Formação</th><th>Seminários</th><th>Avaliações</th><th>Requisitos</th><th>Estado</th><th>Ações</th></tr></thead><tbody>${db.arbitros.map(a => `<tr><td><div class="row-title">${a.nome}</div><div class="row-sub">${a.cod}</div></td><td>${a.categoria}</td><td>${a.graduacao}</td><td>${licenceBadge(a.licenca)}</td><td>${fmtDate(a.validade)}</td><td>${a.formacao}</td><td>${a.seminarios || '—'}</td><td>${a.avaliacoes}</td><td>${progressRequirements(a)}</td><td>${credentialBadge(a)}</td><td><button class="mini touch" data-action="review-credential" data-id="${a.id}">Rever</button></td></tr>`).join('')}</tbody></table></div><div class="mobile-cards">${db.arbitros.map(a => `<article class="data-card"><header><div><h3>${a.nome}</h3><p class="row-sub">${a.categoria} · ${a.graduacao}</p></div>${credentialBadge(a)}</header><div>${licenceBadge(a.licenca)} <span class="row-sub">até ${fmtDate(a.validade)}</span></div><p class="row-sub">${progressRequirements(a)}</p><button class="mini touch" data-action="review-credential" data-id="${a.id}">Rever</button></article>`).join('')}</div></section>`;
  }

  function credentialStatus(a) {
    if (a.estado === 'Suspenso' || a.licenca === 'Suspensa') return 'Suspenso';
    if (a.licenca === 'Expirada' || a.licenca === 'Por validar') return 'Incompleto';
    if (daysUntil(a.validade) <= 60) return 'A necessitar de renovação';
    if (!a.formacao || a.formacao.includes('Sem formação')) return 'Em risco';
    return 'Regular';
  }
  function credentialBadge(a) { const s = credentialStatus(a); return badge(s === 'Regular' ? 'ok' : s === 'Suspenso' || s === 'Incompleto' ? 'bad' : 'warn', s); }
  function progressRequirements(a) { if (a.licenca !== 'Válida') return 'Regularizar licença antes de progressão.'; if (a.graduacao === 'Clube') return 'Requer formação regional e avaliações adicionais.'; if (a.graduacao.includes('Regional')) return 'Requer seminário nacional e avaliações positivas.'; if (!a.seminarios) return 'Atualizar seminários frequentados.'; return 'Requisitos principais completos.'; }

  function renderRelatorios() {
    updateReportDeadlines();
    $('relatorios').innerHTML = `<section class="card"><div class="panel"><h3>Relatórios pós-prova</h3>${badge('info','Prazo automático: 5 dias')}</div><div class="table-wrap"><table><thead><tr><th>Prova</th><th>Árbitro responsável</th><th>Fim da prova</th><th>Prazo</th><th>Estado</th><th>Documento</th><th>Observações</th><th>Ações</th></tr></thead><tbody>${db.relatorios.map(rowReport).join('')}</tbody></table></div><div class="mobile-cards">${db.relatorios.map(cardReport).join('')}</div></section>`;
  }

  function rowReport(r) { const p=prova(r.provaId), a=arbitro(r.arbitroId), doc=r.documentoId?documento(r.documentoId):null; return `<tr><td><div class="row-title">${p?.nome}</div><div class="row-sub">${p?.tipo} · ${p?.local}</div></td><td>${a?.nome}</td><td>${fmtDate(p?.fim)}</td><td>${fmtDate(r.prazo)}</td><td>${reportBadge(r.estado)}</td><td>${doc?.nome || '—'}</td><td>${r.observacoes}</td><td><div class="row-actions"><button class="mini touch" data-action="deliver-report" data-id="${r.id}">Entregue</button><button class="mini touch" data-action="validate-report" data-id="${r.id}">Validar</button><button class="mini touch" data-action="return-report" data-id="${r.id}">Devolver</button></div></td></tr>`; }
  function cardReport(r) { const p=prova(r.provaId), a=arbitro(r.arbitroId); return `<article class="data-card"><header><div><h3>${p?.nome}</h3><p class="row-sub">${a?.nome} · prazo ${fmtDate(r.prazo)}</p></div>${reportBadge(r.estado)}</header><p class="row-sub">${r.observacoes}</p><div class="row-actions"><button class="mini touch" data-action="deliver-report" data-id="${r.id}">Entregue</button><button class="mini touch" data-action="validate-report" data-id="${r.id}">Validar</button></div></article>`; }

  function renderConflitos() {
    $('conflitos').innerHTML = `<section class="card"><div class="panel"><h3>Conflitos de interesse</h3><button class="mini touch" data-modal="conflito">Registar conflito</button></div><div class="table-wrap"><table><thead><tr><th>Árbitro</th><th>Prova</th><th>Tipo</th><th>Descrição</th><th>Estado</th><th>Decisão</th><th>Responsável</th><th>Ações</th></tr></thead><tbody>${db.conflitos.map(c => `<tr><td>${arbitro(c.arbitroId)?.nome}</td><td>${prova(c.provaId)?.nome}</td><td>${c.tipo}</td><td>${c.descricao}</td><td>${conflictBadge(c.estado)}</td><td>${c.decisao}</td><td>${c.responsavel}</td><td><div class="row-actions"><button class="mini touch" data-decide-conflict="${c.id}:Sem impedimento">Sem impedimento</button><button class="mini touch" data-decide-conflict="${c.id}:Impedimento parcial">Parcial</button><button class="mini touch" data-decide-conflict="${c.id}:Impedimento total">Total</button><button class="mini touch" data-decide-conflict="${c.id}:Arquivado">Arquivar</button></div></td></tr>`).join('')}</tbody></table></div><div class="mobile-cards">${db.conflitos.map(c => `<article class="data-card"><header><div><h3>${arbitro(c.arbitroId)?.nome}</h3><p class="row-sub">${prova(c.provaId)?.nome} · ${c.tipo}</p></div>${conflictBadge(c.estado)}</header><p class="row-sub">${c.descricao}</p><div class="row-actions"><button class="mini touch" data-decide-conflict="${c.id}:Sem impedimento">Sem impedimento</button><button class="mini touch" data-decide-conflict="${c.id}:Impedimento total">Total</button></div></article>`).join('')}</div></section>`;
  }

  function renderDocumentos() {
    const f = state.filters.documentos;
    const docs = db.documentos.filter(d => (!f.q || `${d.nome} ${d.tipo}`.toLowerCase().includes(f.q.toLowerCase())) && (!f.tipo || d.tipo === f.tipo) && (!f.estado || d.estado === f.estado));
    $('documentos').innerHTML = `<div class="grid two"><section class="card"><div class="toolbar"><div class="filters"><input class="input" placeholder="Pesquisar documento" value="${escapeHtml(f.q)}" data-filter="documentos.q">${selectFilter('documentos.tipo','Tipo',unique(db.documentos.map(d=>d.tipo)),f.tipo)}${selectFilter('documentos.estado','Estado',unique(db.documentos.map(d=>d.estado)),f.estado)}</div><button class="btn" data-clear-filter="documentos">Limpar</button></div><div class="table-wrap"><table><thead><tr><th>Documento</th><th>Tipo</th><th>Prova</th><th>Árbitro</th><th>Versão</th><th>Data</th><th>Estado</th><th>Ações</th></tr></thead><tbody>${docs.map(d => `<tr><td><div class="row-title">${d.nome}</div></td><td>${d.tipo}</td><td>${d.provaId ? prova(d.provaId)?.nome : '—'}</td><td>${d.arbitroId ? arbitro(d.arbitroId)?.nome : '—'}</td><td>${d.versao}</td><td>${fmtDate(d.data)}</td><td>${docBadge(d.estado)}</td><td><div class="row-actions"><button class="mini touch" data-action="view-doc" data-id="${d.id}">Ver</button><button class="mini touch" data-set-doc="${d.id}:Válido">Validar</button><button class="mini touch" data-set-doc="${d.id}:Rejeitado">Rejeitar</button><button class="mini touch" data-set-doc="${d.id}:Arquivado">Arquivar</button></div></td></tr>`).join('')}</tbody></table></div><div class="mobile-cards">${docs.map(d => `<article class="data-card"><header><div><h3>${d.nome}</h3><p class="row-sub">${d.tipo} · v${d.versao}</p></div>${docBadge(d.estado)}</header><div class="row-actions"><button class="mini touch" data-set-doc="${d.id}:Válido">Validar</button><button class="mini touch" data-set-doc="${d.id}:Rejeitado">Rejeitar</button><button class="mini touch" data-set-doc="${d.id}:Arquivado">Arquivar</button></div></article>`).join('') || emptyState('Sem documentos para os filtros aplicados.')}</div></section><section class="card"><div class="panel"><h3>Checklist por prova</h3></div><div class="list">${db.provas.map(p => checklistLine(p)).join('')}</div></section></div>`;
  }

  function checklistLine(p) { const total = Object.keys(p.checklist || {}).length; const done = Object.values(p.checklist || {}).filter(Boolean).length; return `<div class="item"><div style="width:100%"><strong>${p.nome}</strong><p>${done}/${total} itens documentais completos</p><div class="progress"><span style="width:${Math.round(done/total*100)}%"></span></div></div>${docBadge(p.documental)}</div>`; }

  function renderComunicacoes() {
    $('comunicacoes').innerHTML = `<section class="card"><div class="panel"><h3>Comunicações internas</h3><button class="mini touch" data-action="send-message">Enviar aviso</button></div><div class="table-wrap"><table><thead><tr><th>Destinatário</th><th>Tipo</th><th>Mensagem</th><th>Estado</th><th>Data</th><th>Prioridade</th><th>Ações</th></tr></thead><tbody>${db.comunicacoes.map(c => `<tr><td>${c.destinatario}</td><td>${c.tipo}</td><td>${c.mensagem}</td><td>${badge(c.estado === 'Respondida' || c.estado === 'Lida' ? 'ok' : c.estado === 'Arquivada' ? 'neutral' : 'warn', c.estado)}</td><td>${c.data}</td><td>${priorityBadge(c.prioridade)}</td><td><div class="row-actions"><button class="mini touch" data-set-message="${c.id}:Lida">Lida</button><button class="mini touch" data-set-message="${c.id}:Respondida">Respondida</button><button class="mini touch" data-set-message="${c.id}:Arquivada">Arquivar</button></div></td></tr>`).join('')}</tbody></table></div><div class="mobile-cards">${db.comunicacoes.map(c => `<article class="data-card"><header><div><h3>${c.tipo}</h3><p class="row-sub">${c.destinatario} · ${c.data}</p></div>${priorityBadge(c.prioridade)}</header><p class="row-sub">${c.mensagem}</p><div>${badge(c.estado === 'Respondida' || c.estado === 'Lida' ? 'ok' : c.estado === 'Arquivada' ? 'neutral' : 'warn', c.estado)}</div><div class="row-actions"><button class="mini touch" data-set-message="${c.id}:Lida">Lida</button><button class="mini touch" data-set-message="${c.id}:Respondida">Respondida</button></div></article>`).join('')}</div></section>`;
  }

  function renderAuditoria() {
    $('auditoria').innerHTML = `<section class="card"><div class="panel"><h3>Registo de auditoria</h3>${badge('info', `${db.auditoria.length} registos`)}</div><div class="table-wrap"><table><thead><tr><th>Data e hora</th><th>Utilizador</th><th>Ação</th><th>Entidade afetada</th><th>Estado anterior</th><th>Novo estado</th><th>Justificação</th><th>Origem</th></tr></thead><tbody>${db.auditoria.map(a => `<tr><td>${a.data}</td><td>${a.utilizador}</td><td><strong>${a.acao}</strong></td><td>${a.entidade}</td><td>${a.anterior}</td><td>${a.novo}</td><td>${a.justificacao}</td><td>${a.origem}</td></tr>`).join('')}</tbody></table></div><div class="mobile-cards">${db.auditoria.map(a => `<article class="data-card"><header><div><h3>${a.acao}</h3><p class="row-sub">${a.data} · ${a.utilizador}</p></div>${badge('info',a.origem)}</header><p class="row-sub">${a.entidade}: ${a.anterior} → ${a.novo}</p><p class="row-sub">${a.justificacao}</p></article>`).join('')}</div></section>`;
  }

  function renderPerfis() {
    const profiles = [
      ['Administrador da Federação','Acesso total: gestão de utilizadores, perfis, provas, documentos, auditoria e configurações institucionais.'],
      ['Conselho de Arbitragem','Valida graduações, analisa conflitos, aprova nomeações críticas e decide impedimentos.'],
      ['Responsável Operacional de Arbitragem','Cria provas, prepara nomeações, acompanha disponibilidade, relatórios e documentação.'],
      ['Árbitro','Consulta nomeações, aceita ou recusa convites, declara disponibilidade, conflitos e envia relatórios.'],
      ['Clube Organizador','Consulta equipa nomeada, documentos obrigatórios, estado operacional e comunicações da sua prova.'],
      ['Consulta/Auditoria','Acesso de leitura ao histórico, documentos autorizados e rastreabilidade das decisões.']
    ];
    $('perfis').innerHTML = `<div class="grid three">${profiles.map(p => `<article class="card"><h3>${p[0]}</h3><p class="row-sub">${p[1]}</p>${badge('info','Permissões configuráveis')}</article>`).join('')}</div><section class="card" style="margin-top:16px"><div class="panel"><h3>Matriz de permissões</h3></div><div class="table-wrap"><table><thead><tr><th>Perfil</th><th>Nomeações</th><th>Conflitos</th><th>Licenças/graduação</th><th>Relatórios</th><th>Auditoria</th></tr></thead><tbody>${profiles.map((p,i)=>`<tr><td>${p[0]}</td><td>${i<3?'Editar':'Consultar'}</td><td>${i===1?'Decidir':i<3?'Registar':'Declarar/consultar'}</td><td>${i<2?'Validar':'Consultar'}</td><td>${i===3?'Enviar':i<3?'Gerir':'Consultar'}</td><td>${i===0||i===5?'Consultar':'Limitada'}</td></tr>`).join('')}</tbody></table></div></section><section class="card" style="margin-top:16px"><div class="panel"><h3>Dados locais</h3></div><div class="row-actions"><button class="btn" data-action="save-local">Guardar dados localmente</button><button class="btn btn-danger" data-action="reset-data">Repor dados de teste</button></div><p class="row-sub">A persistência atual é local no dispositivo. A autenticação e permissões reais deverão ser aplicadas no servidor numa versão de produção.</p></section>`;
  }

  function renderAll() {
    updateReportDeadlines();
    renderDashboard(); renderArbitros(); renderPerfil(); renderProvas(); renderNomeacoes(); renderDisponibilidades(); renderCredenciacao(); renderRelatorios(); renderConflitos(); renderDocumentos(); renderComunicacoes(); renderAuditoria(); renderPerfis();
    saveData();
  }

  function selectFilter(path, placeholder, options, value) { return `<select class="select" data-filter="${path}"><option value="">${placeholder}</option>${options.map(o => `<option value="${escapeHtml(o)}" ${o === value ? 'selected' : ''}>${escapeHtml(o)}</option>`).join('')}</select>`; }
  function emptyRow(cols) { return `<tr><td colspan="${cols}"><div class="empty">Sem registos para apresentar.</div></td></tr>`; }
  function emptyState(text) { return `<div class="empty">${escapeHtml(text)}</div>`; }

  function openModal(title, body, footer = '') {
    $('modalTitle').textContent = title;
    $('modalBody').innerHTML = body;
    $('modalFooter').innerHTML = footer;
    $('modalBackdrop').hidden = false;
    setTimeout(() => $('closeModal').focus(), 0);
  }
  function closeModal() { $('modalBackdrop').hidden = true; }

  function formField(name,label,value='',type='text',required=false) { return `<div class="field"><label for="${name}">${label}</label><input class="input" id="${name}" name="${name}" type="${type}" value="${escapeHtml(value)}" ${required?'required':''}></div>`; }
  function formSelect(name,label,value,options) { return `<div class="field"><label for="${name}">${label}</label><select class="select" id="${name}" name="${name}">${options.map(o => Array.isArray(o) ? `<option value="${o[0]}" ${String(o[0])===String(value)?'selected':''}>${o[1]}</option>` : `<option value="${o}" ${o===value?'selected':''}>${o}</option>`).join('')}</select></div>`; }
  function formData(formId) { return Object.fromEntries(new FormData($(formId)).entries()); }

  function modalArbitro(id) {
    const a = id ? arbitro(id) : {};
    openModal(id ? 'Editar árbitro' : 'Novo árbitro', `<form id="formArbitro" class="form-grid"><input type="hidden" name="id" value="${a.id||''}">${formField('nome','Nome',a.nome||'', 'text', true)}${formField('cod','Código interno',a.cod || `ARB-${160+db.arbitros.length}`, 'text', true)}${formSelect('categoria','Categoria',a.categoria||'Juiz',['Oficial de Regata','Juiz','Juiz-Árbitro','Medidor','Classificador Funcional'])}${formSelect('graduacao','Graduação',a.graduacao||'Regional/Grau 1',['Clube','Regional/Grau 1','Nacional/Grau 2','Nacional'])}${formSelect('licenca','Licença Desportiva de Árbitro',a.licenca||'Válida',['Válida','Por validar','Expirada','Suspensa'])}${formField('validade','Validade da licença',a.validade||'2027-01-01','date',true)}${formField('regiao','Região / associação regional',a.regiao||'', 'text', true)}${formField('contacto','Contacto de teste',a.contacto||'', 'text', true)}${formSelect('disponibilidade','Disponibilidade',a.disponibilidade||'Disponível',['Disponível','Indisponível','Condicionado','Por confirmar'])}${formField('formacao','Formação recente',a.formacao||'','text')}${formField('provas','Provas realizadas',a.provas||0,'number')}${formField('avaliacoes','Avaliações positivas',a.avaliacoes||0,'number')}${formField('relatoriosAtraso','Relatórios em atraso',a.relatoriosAtraso||0,'number')}${formSelect('estado','Estado operacional',a.estado||'Ativo',['Ativo','Condicionado','Suspenso','Inativo'])}<div class="field full"><label for="observacoes">Observações internas</label><textarea class="textarea" id="observacoes" name="observacoes" rows="4">${escapeHtml(a.observacoes||'')}</textarea></div></form>`, `<button class="btn" data-close-modal>Cancelar</button><button class="btn btn-primary" data-save-arbitro>Guardar</button>`);
  }

  function saveArbitro() {
    const f = formData('formArbitro');
    if (!f.nome || !f.cod) return toast('Preencha o nome e o código interno.');
    const id = Number(f.id);
    const payload = { id: id || nextId(db.arbitros), cod:f.cod, nome:f.nome, categoria:f.categoria, graduacao:f.graduacao, licenca:f.licenca, validade:f.validade, regiao:f.regiao, contacto:f.contacto, disponibilidade:f.disponibilidade, formacao:f.formacao, seminarios:id ? arbitro(id).seminarios : '', provas:Number(f.provas), avaliacoes:Number(f.avaliacoes), relatoriosAtraso:Number(f.relatoriosAtraso), estado:f.estado, observacoes:f.observacoes, documentos:id ? arbitro(id).documentos : [] };
    const idx = db.arbitros.findIndex(x => x.id === id);
    if (idx >= 0) { db.arbitros[idx] = payload; registerAudit('Dados de árbitro alterados', payload.nome, 'Ficha anterior', 'Ficha atualizada', 'Atualização de registo'); }
    else { db.arbitros.push(payload); registerAudit('Árbitro criado', payload.nome, 'Inexistente', 'Ativo', 'Novo registo'); }
    closeModal(); renderAll(); toast('Árbitro guardado.');
  }

  function modalProva(id) {
    const p = id ? prova(id) : {};
    openModal(id ? 'Editar prova' : 'Nova prova', `<form id="formProva" class="form-grid"><input type="hidden" name="id" value="${p.id||''}">${formField('nome','Nome da prova',p.nome||'', 'text', true)}${formSelect('tipo','Tipo',p.tipo||'Campeonato Regional',['Campeonato Nacional','Campeonato de Portugal','Prova de Apuramento Nacional','Taça de Portugal','Campeonato Regional','Prova de Clube','Prova Internacional','Outra'])}${formSelect('ambito','Âmbito',p.ambito||'Regional',['Clube','Regional','Nacional','Internacional'])}${formField('inicio','Data de início',p.inicio||'2026-06-01','date',true)}${formField('fim','Data de fim',p.fim||'2026-06-02','date',true)}${formField('local','Local',p.local||'', 'text', true)}${formField('clube','Clube/autoridade organizadora',p.clube||'', 'text', true)}${formField('classes','Classes',p.classes||'', 'text', true)}${formField('barcos','N.º previsto de barcos',p.barcos||30,'number')}${formField('campos','Campos de regata',p.campos||'', 'text')}${formSelect('estado','Estado da prova',p.estado||'Planeada',['Planeada','Em preparação','Nomeações pendentes','Equipa completa','Em curso','Concluída','Encerrada'])}${formSelect('documental','Estado documental',p.documental||'Incompleto',['Incompleto','Aguardando validação','Validado','Arquivado'])}</form>`, `<button class="btn" data-close-modal>Cancelar</button><button class="btn btn-primary" data-save-prova>Guardar</button>`);
  }

  function saveProva() {
    const f = formData('formProva');
    const id = Number(f.id);
    const existing = id ? prova(id) : null;
    const payload = { id: id || nextId(db.provas), nome:f.nome,tipo:f.tipo,ambito:f.ambito,inicio:f.inicio,fim:f.fim,local:f.local,clube:f.clube,classes:f.classes,barcos:Number(f.barcos),campos:f.campos,estado:f.estado,documental:f.documental,relatorio:existing?.relatorio || 'Pendente', necessidades:existing?.necessidades || {'Oficial de Regata':1,'Juiz':1}, checklist:existing?.checklist || {'Anúncio de Regata':false,'Instruções de Regata':false,'Resultados':false,'Protestos':false,'Decisões':false,'Aditamentos':false,'Relatório de prova':false,'Mapa de nomeações':false,'Documentos de medição':false} };
    const idx = db.provas.findIndex(x => x.id === id);
    if (idx >= 0) { db.provas[idx] = payload; registerAudit('Prova alterada', payload.nome, 'Dados anteriores', 'Dados atualizados'); }
    else { db.provas.push(payload); db.relatorios.push({id:nextId(db.relatorios),provaId:payload.id,arbitroId:db.arbitros[0].id,prazo:addDays(payload.fim,5),estado:'Pendente',documentoId:null,observacoes:'Prazo automático: 5 dias após fim da prova.'}); registerAudit('Prova criada', payload.nome, 'Inexistente', 'Planeada'); }
    closeModal(); renderAll(); toast('Prova guardada.');
  }

  function modalNomeacao(funcao = '', arbitroId = '') {
    const p = prova(state.selectedRaceId) || db.provas[0];
    openModal('Nova nomeação', `<form id="formNomeacao" class="form-grid">${formSelect('provaId','Prova',p.id,db.provas.map(x=>[x.id,`${x.nome} · ${fmtDate(x.inicio)}`]))}${formSelect('arbitroId','Árbitro',arbitroId || db.arbitros[0].id,db.arbitros.map(a=>[a.id,`${a.nome} · ${a.categoria} · ${a.graduacao} · ${a.licenca}`]))}${formSelect('funcao','Função',funcao||'Juiz',['Presidente da Comissão de Regata','Oficial de Regata','Presidente da Comissão de Protestos','Juiz','Juiz-Árbitro','Medidor','Classificador Funcional','Apoio técnico','Secretariado de prova','Outra função'])}${formSelect('estado','Estado','Rascunho',['Rascunho','Enviada','Pendente de resposta','Aceite','Recusada','Substituída','Cancelada','Concluída'])}<div class="field full"><label for="justificacao">Justificação/motivo</label><textarea class="textarea" id="justificacao" name="justificacao" rows="4" placeholder="Obrigatória para alertas críticos."></textarea></div></form><div class="risk-box" id="nomRisk">A validação será aplicada ao guardar a nomeação.</div>`, `<button class="btn" data-close-modal>Cancelar</button><button class="btn btn-primary" data-save-nomeacao>Guardar nomeação</button>`);
  }

  function saveNomeacao() {
    const f = formData('formNomeacao');
    const p = prova(Number(f.provaId)), a = arbitro(Number(f.arbitroId));
    const risks = validateAppointment(a,p,f.funcao);
    const level = riskLevel(risks);
    if (level === 'block') return toast('Nomeação bloqueada: ' + risks.filter(r=>r.level==='block').map(r=>r.message).join(', '));
    if (level === 'critical' && !f.justificacao.trim()) return toast('Justificação obrigatória para avançar com alertas críticos.');
    db.nomeacoes.push({ id: nextId(db.nomeacoes), provaId:p.id, arbitroId:a.id, funcao:f.funcao, estado:f.estado, justificacao:f.justificacao || risks.map(r=>r.message).join('; ') });
    registerAudit('Árbitro nomeado', p.nome, 'Sem nomeação', `${a.nome} · ${f.funcao} · ${f.estado}`, f.justificacao || 'Nomeação registada', 'Nomeações');
    closeModal(); renderAll(); toast(level === 'none' ? 'Nomeação guardada sem risco identificado.' : 'Nomeação guardada com alertas registados.');
  }

  function modalDisponibilidade(arbitroId = '') {
    openModal('Registar disponibilidade', `<form id="formDisponibilidade" class="form-grid">${formSelect('arbitroId','Árbitro',arbitroId || db.arbitros[0].id, db.arbitros.map(a=>[a.id,a.nome]))}${formField('data','Data',TODAY,'date',true)}${formSelect('provaId','Prova associada',state.selectedRaceId,db.provas.map(p=>[p.id,p.nome]))}${formSelect('estado','Estado','Disponível',['Disponível','Indisponível','Condicionado','Por confirmar'])}<div class="field full"><label for="observacoes">Observações</label><textarea class="textarea" id="observacoes" name="observacoes" rows="3"></textarea></div></form>`, `<button class="btn" data-close-modal>Cancelar</button><button class="btn btn-primary" data-save-disponibilidade>Guardar</button>`);
  }

  function saveDisponibilidade() {
    const f = formData('formDisponibilidade');
    db.disponibilidades.push({ id:nextId(db.disponibilidades), arbitroId:Number(f.arbitroId), data:f.data, provaId:Number(f.provaId), estado:f.estado, observacoes:f.observacoes });
    const a = arbitro(Number(f.arbitroId)); const old = a.disponibilidade; a.disponibilidade = f.estado;
    registerAudit('Disponibilidade registada', a.nome, old, f.estado, f.observacoes || 'Mapa de disponibilidade atualizado', 'Disponibilidades');
    closeModal(); renderAll(); toast('Disponibilidade registada.');
  }

  function modalDocumento(arbitroId = '') {
    openModal('Adicionar documento', `<form id="formDocumento" class="form-grid">${formField('nome','Nome do documento','Novo documento.pdf','text',true)}${formSelect('tipo','Tipo','Relatórios',['Regulamentos','Regras de regata','Prescrições','Avisos de regata','Instruções de regata','Relatórios','Mapas de disponibilidade','Atas','Decisões','Protestos','Formulários','Avaliações','Certificados','Outros'])}${formSelect('provaId','Prova associada',0,[[0,'Sem prova'],...db.provas.map(p=>[p.id,p.nome])])}${formSelect('arbitroId','Árbitro associado',arbitroId || 0,[[0,'Sem árbitro'],...db.arbitros.map(a=>[a.id,a.nome])])}${formField('versao','Versão','1.0','text')}${formSelect('estado','Estado','Por validar',['Válido','Em falta','Por validar','Arquivado','Rejeitado'])}</form>`, `<button class="btn" data-close-modal>Cancelar</button><button class="btn btn-primary" data-save-documento>Guardar documento</button>`);
  }

  function saveDocumento() {
    const f = formData('formDocumento');
    db.documentos.unshift({ id:nextId(db.documentos), nome:f.nome, tipo:f.tipo, provaId:Number(f.provaId)||null, arbitroId:Number(f.arbitroId)||null, versao:f.versao||'1.0', data:TODAY, estado:f.estado });
    registerAudit('Documento adicionado', f.nome, 'Inexistente', f.estado, 'Registo documental', 'Documentos');
    closeModal(); renderAll(); toast('Documento registado.');
  }

  function modalConflito(arbitroId = '') {
    openModal('Registar conflito de interesse', `<form id="formConflito" class="form-grid">${formSelect('arbitroId','Árbitro',arbitroId || db.arbitros[0].id, db.arbitros.map(a=>[a.id,a.nome]))}${formSelect('provaId','Prova',state.selectedRaceId,db.provas.map(p=>[p.id,p.nome]))}${formSelect('tipo','Tipo','Ligação a clube',['Ligação a clube','Ligação a atleta','Ligação a equipa','Relação familiar','Relação profissional','Interesse financeiro','Participação anterior relevante','Outro'])}${formSelect('estado','Estado','Declarado',['Declarado','Em análise','Sem impedimento','Impedimento parcial','Impedimento total','Resolvido','Arquivado'])}${formField('responsavel','Responsável pela decisão','Conselho de Arbitragem','text')}<div class="field full"><label for="descricao">Descrição</label><textarea class="textarea" id="descricao" name="descricao" rows="3"></textarea></div><div class="field full"><label for="decisao">Decisão</label><textarea class="textarea" id="decisao" name="decisao" rows="3">A aguardar análise.</textarea></div><div class="field full"><label for="observacoes">Observações internas</label><textarea class="textarea" id="observacoes" name="observacoes" rows="3"></textarea></div></form>`, `<button class="btn" data-close-modal>Cancelar</button><button class="btn btn-primary" data-save-conflito>Guardar conflito</button>`);
  }

  function saveConflito() {
    const f = formData('formConflito');
    db.conflitos.unshift({ id:nextId(db.conflitos), arbitroId:Number(f.arbitroId), provaId:Number(f.provaId), tipo:f.tipo, descricao:f.descricao, estado:f.estado, decisao:f.decisao, responsavel:f.responsavel, observacoes:f.observacoes });
    registerAudit('Conflito de interesse declarado', prova(Number(f.provaId)).nome, 'Sem registo', f.estado, f.descricao || 'Registo de conflito', 'Conflitos');
    closeModal(); renderAll(); toast('Conflito registado.');
  }

  function modalRelatorio() {
    openModal('Registar relatório pós-prova', `<form id="formRelatorio" class="form-grid">${formSelect('provaId','Prova',db.provas[0].id,db.provas.map(p=>[p.id,p.nome]))}${formSelect('arbitroId','Árbitro responsável',db.arbitros[0].id,db.arbitros.map(a=>[a.id,a.nome]))}${formSelect('estado','Estado','Entregue',['Pendente','Entregue','Em atraso','Validado','Devolvido'])}<div class="field full"><label for="observacoes">Observações da prova</label><textarea class="textarea" id="observacoes" name="observacoes" rows="4">Relatório registado na plataforma operacional.</textarea></div></form>`, `<button class="btn" data-close-modal>Cancelar</button><button class="btn btn-primary" data-save-relatorio>Guardar relatório</button>`);
  }

  function saveRelatorio() {
    const f = formData('formRelatorio'); const p = prova(Number(f.provaId));
    db.relatorios.unshift({ id:nextId(db.relatorios), provaId:p.id, arbitroId:Number(f.arbitroId), prazo:addDays(p.fim,5), estado:f.estado, documentoId:null, observacoes:f.observacoes });
    p.relatorio = f.estado;
    registerAudit('Relatório entregue', p.nome, 'Pendente', f.estado, f.observacoes, 'Relatórios');
    closeModal(); renderAll(); toast('Relatório registado.');
  }

  function detailProva(id) {
    const p = prova(id); const t = teamProgress(p);
    openModal('Detalhes da prova', `<div class="grid two"><div class="profile-box"><h3>${p.nome}</h3>${metric('Tipo',p.tipo)}${metric('Âmbito',p.ambito)}${metric('Datas',`${fmtDate(p.inicio)} — ${fmtDate(p.fim)}`)}${metric('Local',p.local)}${metric('Organização',p.clube)}${metric('Classes',p.classes)}${metric('Campos',p.campos)}${metric('Barcos previstos',p.barcos)}${metric('Equipa',`${t.named}/${t.required}`)}</div><div class="card" style="box-shadow:none"><h3>Checklist documental</h3><div class="list">${Object.entries(p.checklist).map(([k,v])=>`<div class="item"><div><strong>${k}</strong></div>${v?badge('ok','Completo'):badge('warn','Pendente')}</div>`).join('')}</div></div></div>`, `<button class="btn btn-primary" data-select-race="${p.id}" data-close-modal>Gerir nomeações</button>`);
  }

  function setNomination(id, status) {
    const n = db.nomeacoes.find(x => x.id === Number(id)); if (!n) return;
    const old = n.estado; n.estado = status;
    if (['Recusada','Substituída'].includes(status)) n.justificacao = prompt('Motivo/justificação:') || n.justificacao || 'Motivo não especificado.';
    registerAudit(`Nomeação ${status.toLowerCase()}`, prova(n.provaId).nome, old, status, n.justificacao || 'Alteração de estado', 'Nomeações');
    renderAll(); toast(`Nomeação marcada como ${status}.`);
  }

  function setReport(id, status) {
    const r = db.relatorios.find(x => x.id === Number(id)); if (!r) return;
    const old = r.estado; r.estado = status;
    if (status === 'Entregue') {
      const docId = nextId(db.documentos);
      db.documentos.unshift({ id:docId, nome:`Relatório final - ${prova(r.provaId).nome}.pdf`, tipo:'Relatórios', provaId:r.provaId, arbitroId:r.arbitroId, versao:'1.0', data:TODAY, estado:'Por validar' });
      r.documentoId = docId;
    }
    prova(r.provaId).relatorio = status;
    registerAudit(status === 'Entregue' ? 'Relatório entregue' : 'Estado de relatório alterado', prova(r.provaId).nome, old, status, 'Atualização pós-prova', 'Relatórios');
    renderAll(); toast(`Relatório marcado como ${status}.`);
  }

  function setConflict(id, status) {
    const c = db.conflitos.find(x => x.id === Number(id)); if (!c) return;
    const old = c.estado; c.estado = status; c.decisao = `Decisão registada pelo Conselho de Arbitragem: ${status}.`;
    registerAudit('Decisão registada pelo Conselho de Arbitragem', prova(c.provaId).nome, old, status, c.decisao, 'Conflitos');
    renderAll(); toast('Decisão de conflito registada.');
  }

  function setDocument(id, status) {
    const d = db.documentos.find(x => x.id === Number(id)); if (!d) return;
    const old = d.estado; d.estado = status;
    registerAudit(status === 'Válido' ? 'Documento validado' : status === 'Rejeitado' ? 'Documento rejeitado' : 'Documento arquivado', d.nome, old, status, 'Alteração documental', 'Documentos');
    renderAll(); toast(`Documento marcado como ${status}.`);
  }

  function setMessage(id, status) {
    const c = db.comunicacoes.find(x => x.id === Number(id)); if (!c) return;
    const old = c.estado; c.estado = status;
    registerAudit('Comunicação atualizada', c.tipo, old, status, 'Gestão de comunicação', 'Comunicações');
    renderAll(); toast(`Comunicação marcada como ${status}.`);
  }

  function markUnavailable(id) {
    const a = arbitro(id); if (!a) return;
    const old = a.disponibilidade; a.disponibilidade = 'Indisponível';
    registerAudit('Comunicação de indisponibilidade', a.nome, old, 'Indisponível', 'Atualização operacional', 'Árbitros');
    renderAll(); toast(`${a.nome} marcado como indisponível.`);
  }

  function generateMissingMaps() {
    const missing = db.arbitros.filter(a => !db.disponibilidades.some(d => d.arbitroId === a.id));
    missing.forEach(a => db.comunicacoes.unshift({ id:nextId(db.comunicacoes), destinatario:a.nome, tipo:'Mapa de disponibilidade em falta', estado:'Pendente', data:nowStamp(), prioridade:'Alta', mensagem:'Solicitado envio do mapa de disponibilidade mensal.' }));
    registerAudit('Alertas de mapas gerados', 'Disponibilidades', 'Sem alerta', `${missing.length} pedido(s)`, 'Mapas mensais em falta', 'Disponibilidades');
    renderAll(); toast(`${missing.length} alerta(s) de mapa em falta gerados.`);
  }

  function sendMessage() {
    db.comunicacoes.unshift({ id:nextId(db.comunicacoes), destinatario:'Árbitros nomeados', tipo:'Pedido de confirmação', estado:'Enviada', data:nowStamp(), prioridade:'Alta', mensagem:'Solicitada confirmação das nomeações pendentes.' });
    registerAudit('Comunicação enviada', 'Nomeações pendentes', 'Pendente', 'Enviada', 'Pedido de confirmação', 'Comunicações');
    renderAll(); toast('Comunicação enviada.');
  }

  function exportCSV(entity) {
    const data = entity === 'nomeacoes' ? db.nomeacoes.map(n => ({...n, prova:prova(n.provaId)?.nome, arbitro:arbitro(n.arbitroId)?.nome})) : entity === 'relatorios' ? db.relatorios.map(r => ({...r, prova:prova(r.provaId)?.nome, arbitro:arbitro(r.arbitroId)?.nome})) : db[entity];
    if (!data?.length) return toast('Sem dados para exportar.');
    const keys = unique(data.flatMap(o => Object.keys(o)));
    const csv = [keys.join(';'), ...data.map(row => keys.map(k => csvCell(row[k])).join(';'))].join('\n');
    const blob = new Blob([`\ufeff${csv}`], { type:'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `fpv-${entity}-${TODAY}.csv`; a.click();
    URL.revokeObjectURL(url);
    registerAudit('Exportação CSV', entity, 'Dados internos', 'Ficheiro CSV', 'Exportação local', 'Exportação');
    renderAuditoria(); toast('Exportação CSV criada.');
  }
  function csvCell(value) { if (value == null) return ''; const s = typeof value === 'object' ? JSON.stringify(value) : String(value); return `"${s.replace(/"/g,'""')}"`; }

  function toast(message) {
    const t = $('toast'); t.textContent = message; t.classList.add('show'); clearTimeout(toast.timer); toast.timer = setTimeout(() => t.classList.remove('show'), 3200);
  }

  function handleClick(e) {
    const nav = e.target.closest('[data-nav]'); if (nav) { navigate(nav.dataset.nav); return; }
    const profile = e.target.closest('[data-profile]'); if (profile) { state.selectedRefereeId = Number(profile.dataset.profile); renderPerfil(); navigate('perfil'); return; }
    const modal = e.target.closest('[data-modal]'); if (modal) { openNamedModal(modal.dataset.modal, modal); return; }
    const close = e.target.closest('[data-close-modal]'); if (close) closeModal();
    if (e.target.closest('[data-save-arbitro]')) saveArbitro();
    if (e.target.closest('[data-save-prova]')) saveProva();
    if (e.target.closest('[data-save-nomeacao]')) saveNomeacao();
    if (e.target.closest('[data-save-disponibilidade]')) saveDisponibilidade();
    if (e.target.closest('[data-save-documento]')) saveDocumento();
    if (e.target.closest('[data-save-conflito]')) saveConflito();
    if (e.target.closest('[data-save-relatorio]')) saveRelatorio();
    const clear = e.target.closest('[data-clear-filter]'); if (clear) { Object.keys(state.filters[clear.dataset.clearFilter]).forEach(k => state.filters[clear.dataset.clearFilter][k]=''); renderAll(); }
    const exp = e.target.closest('[data-export]'); if (exp) exportCSV(exp.dataset.export);
    const detail = e.target.closest('[data-detail-prova]'); if (detail) detailProva(Number(detail.dataset.detailProva));
    const selectRace = e.target.closest('[data-select-race]'); if (selectRace) { state.selectedRaceId = Number(selectRace.dataset.selectRace); closeModal(); renderNomeacoes(); navigate('nomeacoes'); }
    const setNom = e.target.closest('[data-set-nomination]'); if (setNom) { const [id,status] = setNom.dataset.setNomination.split(':'); setNomination(id,status); }
    const refuse = e.target.closest('[data-refuse-nomination]'); if (refuse) setNomination(refuse.dataset.refuseNomination, 'Recusada');
    const deliver = e.target.closest('[data-action="deliver-report"]'); if (deliver) setReport(deliver.dataset.id,'Entregue');
    const validate = e.target.closest('[data-action="validate-report"]'); if (validate) setReport(validate.dataset.id,'Validado');
    const ret = e.target.closest('[data-action="return-report"]'); if (ret) setReport(ret.dataset.id,'Devolvido');
    const conflict = e.target.closest('[data-decide-conflict]'); if (conflict) { const [id,status] = conflict.dataset.decideConflict.split(':'); setConflict(id,status); }
    const setDoc = e.target.closest('[data-set-doc]'); if (setDoc) { const [id,status] = setDoc.dataset.setDoc.split(':'); setDocument(id,status); }
    const setMsg = e.target.closest('[data-set-message]'); if (setMsg) { const [id,status] = setMsg.dataset.setMessage.split(':'); setMessage(id,status); }
    const action = e.target.closest('[data-action]'); if (action) handleAction(action.dataset.action, action.dataset.id);
  }

  function openNamedModal(name, el) {
    const id = el.dataset.id ? Number(el.dataset.id) : null;
    if (name === 'arbitro') modalArbitro(id);
    if (name === 'prova') modalProva(id);
    if (name === 'nomeacao') modalNomeacao(el.dataset.funcao || '', el.dataset.arbitro || '');
    if (name === 'disponibilidade') modalDisponibilidade(el.dataset.arbitro || '');
    if (name === 'documento') modalDocumento(el.dataset.arbitro || '');
    if (name === 'conflito') modalConflito(el.dataset.arbitro || '');
    if (name === 'relatorio') modalRelatorio();
  }

  function handleAction(action, id) {
    if (action === 'save-local') saveData(true);
    if (action === 'reset-data') resetData();
    if (action === 'mark-unavailable') markUnavailable(Number(id));
    if (action === 'missing-maps') generateMissingMaps();
    if (action === 'send-message') sendMessage();
    if (action === 'review-credential') { const a = arbitro(Number(id)); toast(`${a.nome}: ${credentialStatus(a)}.`); registerAudit('Credenciação revista', a.nome, 'Por rever', credentialStatus(a), 'Revisão manual', 'Credenciação'); renderAuditoria(); }
    if (action === 'review-credentials') { toast('Alertas de credenciação revistos.'); registerAudit('Credenciações revistas', 'Árbitros', 'Por rever', 'Revisto', 'Revisão global', 'Credenciação'); renderAuditoria(); }
    if (action === 'install-app') installApp();
    if (action === 'view-doc') toast('Abertura de documento registada. Nesta versão local, a visualização é representada por registo documental.');
  }

  function handleInput(e) {
    const filter = e.target.closest('[data-filter]');
    if (!filter) return;
    const [section, key] = filter.dataset.filter.split('.');
    state.filters[section][key] = filter.value;
    if (section === 'arbitros') renderArbitros();
    if (section === 'provas') renderProvas();
    if (section === 'disponibilidades') renderDisponibilidades();
    if (section === 'documentos') renderDocumentos();
  }

  function bindUI() {
    document.body.addEventListener('click', handleClick);
    document.body.addEventListener('input', handleInput);
    document.body.addEventListener('change', (e) => {
      handleInput(e);
      if (e.target.matches('[data-select-main-race]')) { state.selectedRaceId = Number(e.target.value); renderNomeacoes(); }
    });
    $('openSidebar').addEventListener('click', () => { $('sidebar').classList.add('open'); $('appOverlay').hidden = false; $('openSidebar').setAttribute('aria-expanded','true'); });
    $('appOverlay').addEventListener('click', closeSidebar);
    $('closeModal').addEventListener('click', closeModal);
    $('modalBackdrop').addEventListener('click', (e) => { if (e.target.id === 'modalBackdrop') closeModal(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { closeModal(); closeSidebar(); } });
    window.addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); state.deferredInstallPrompt = e; renderActions(); renderDashboard(); });
  }

  function closeSidebar() { $('sidebar').classList.remove('open'); $('appOverlay').hidden = true; $('openSidebar').setAttribute('aria-expanded','false'); }
  async function installApp() { if (!state.deferredInstallPrompt) return toast('Instalação indisponível neste navegador neste momento.'); state.deferredInstallPrompt.prompt(); await state.deferredInstallPrompt.userChoice; state.deferredInstallPrompt = null; renderActions(); renderDashboard(); }

  function registerServiceWorker() {
    if ('serviceWorker' in navigator) navigator.serviceWorker.register('service-worker.js').catch(() => {});
  }

  function init() {
    renderNav(); bindUI(); renderAll();
    let page = location.hash ? location.hash.replace('#','') : 'dashboard';
    if (!META[page]) { try { page = JSON.parse(localStorage.getItem(PREF_KEY) || '{}').page || 'dashboard'; } catch {} }
    navigate(META[page] ? page : 'dashboard');
    registerServiceWorker();
  }

  init();
})();

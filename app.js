'use strict';

const APP_VERSION = '2.1.1-modal-fix';
const STORAGE_KEY = 'fpv-arbitragem-state-v2';
const TODAY = '2026-05-13';

const navItems = [
  ['dashboard','◉','Dashboard'], ['arbitros','⚓','Árbitros'], ['perfil','👤','Perfil do árbitro'],
  ['provas','⛵','Provas'], ['nomeacoes','✓','Nomeações'], ['disponibilidades','📅','Disponibilidades'],
  ['credenciacao','🎓','Licenças e formação'], ['relatorios','📝','Relatórios'], ['conflitos','⚠','Conflitos de interesse'],
  ['documentos','📄','Documentos'], ['comunicacoes','✉','Comunicações'], ['auditoria','☷','Auditoria'], ['perfis','⚙','Perfis e permissões']
];

const pageMeta = {
  dashboard:['Operação','Dashboard','Visão global da gestão operacional da arbitragem, com prioridades e alertas acionáveis.'],
  arbitros:['Base operacional','Árbitros','Gestão de categorias, graduações, licenças, disponibilidade, formação e estado operacional.'],
  perfil:['Ficha individual','Perfil do árbitro','Resumo operacional, risco de nomeação, histórico, documentos, conflitos e observações.'],
  provas:['Calendário desportivo','Provas','Gestão de regatas, campeonatos, necessidades de arbitragem, equipa e documentação.'],
  nomeacoes:['Centro operacional','Nomeações','Preparação, validação e acompanhamento das nomeações para provas.'],
  disponibilidades:['Mapas mensais','Disponibilidades','Consulta, registo e controlo dos mapas de disponibilidade por árbitro e prova.'],
  credenciacao:['Credenciação','Licenças, formação e graduação','Controlo da Licença Desportiva de Árbitro, formação, graduação e requisitos.'],
  relatorios:['Pós-prova','Relatórios','Prazos automáticos, entrega, validação e auditoria de relatórios pós-prova.'],
  conflitos:['Independência','Conflitos de interesse','Registo, análise, decisão e impacto dos conflitos nas nomeações.'],
  documentos:['Arquivo operacional','Documentos','Gestão documental por tipo, prova, árbitro, versão, estado e checklist.'],
  comunicacoes:['Notificações','Comunicações','Pedidos, alertas, respostas e histórico das comunicações internas.'],
  auditoria:['Rastreabilidade','Auditoria','Histórico de ações, alterações de estado, justificação e origem.'],
  perfis:['Administração','Perfis e permissões','Matriz de permissões preparada para futura autenticação real.']
};

const defaultData = () => ({
  ui:{page:'dashboard', selectedRef:1, selectedRace:1, filters:{}},
  arbitros:[
    {id:1,cod:'ARB-024',nome:'Ana Sofia Almeida',cat:'Juiz',grad:'Nacional',lic:'Válida',valid:'2027-03-15',reg:'Associação Regional Centro',contacto:'ana.almeida.teste@fpv-arb.local',disp:'Disponível',form:'Seminário RRV 2025',seminarios:'RRV, protestos e decisões',provas:46,aval:18,relAtraso:0,estado:'Ativo',obs:'Perfil recomendado para Comissão de Protestos em provas nacionais.',docs:[1]},
    {id:2,cod:'ARB-041',nome:'Miguel Nunes',cat:'Medidor',grad:'Nacional/Grau 2',lic:'Válida',valid:'2026-06-30',reg:'Associação Regional Norte',contacto:'miguel.nunes.teste@fpv-arb.local',disp:'Por confirmar',form:'Formação de Medição 2024',seminarios:'Medição de monotipos',provas:29,aval:11,relAtraso:1,estado:'Ativo',obs:'Adequado para medição em classes jovens e monotipos.',docs:[3]},
    {id:3,cod:'ARB-063',nome:'Teresa Carvalho',cat:'Oficial de Regata',grad:'Regional/Grau 1',lic:'Por validar',valid:'2026-05-29',reg:'Associação Regional Sul',contacto:'teresa.carvalho.teste@fpv-arb.local',disp:'Disponível',form:'Curso Oficial de Regata 2025',seminarios:'Gestão de linha de partida',provas:17,aval:7,relAtraso:0,estado:'Condicionado',obs:'Aguardar validação documental da licença antes de provas nacionais.',docs:[]},
    {id:4,cod:'ARB-087',nome:'João Pires',cat:'Juiz-Árbitro',grad:'Nacional',lic:'Válida',valid:'2028-01-10',reg:'Associação Regional Lisboa',contacto:'joao.pires.teste@fpv-arb.local',disp:'Indisponível',form:'Seminário Match Racing 2025',seminarios:'Match racing e protestos',provas:38,aval:16,relAtraso:0,estado:'Ativo',obs:'Indisponível na segunda quinzena de junho.',docs:[]},
    {id:5,cod:'ARB-102',nome:'Marta Reis',cat:'Juiz',grad:'Clube',lic:'Expirada',valid:'2025-12-18',reg:'Associação Regional Centro',contacto:'marta.reis.teste@fpv-arb.local',disp:'Indisponível',form:'Sem formação recente registada',seminarios:'—',provas:9,aval:3,relAtraso:2,estado:'Inativo',obs:'Não nomear até renovação da Licença Desportiva de Árbitro.',docs:[]},
    {id:6,cod:'ARB-118',nome:'Ricardo Matos',cat:'Oficial de Regata',grad:'Nacional',lic:'Válida',valid:'2027-11-02',reg:'Associação Regional Setúbal',contacto:'ricardo.matos.teste@fpv-arb.local',disp:'Disponível',form:'Seminário Gestão de Regatas 2025',seminarios:'Comissão de Regata',provas:54,aval:22,relAtraso:0,estado:'Ativo',obs:'Perfil sénior para Presidente da Comissão de Regata.',docs:[]},
    {id:7,cod:'ARB-130',nome:'Inês Duarte',cat:'Classificador Funcional',grad:'Regional/Grau 1',lic:'Suspensa',valid:'2026-09-20',reg:'Associação Regional Norte',contacto:'ines.duarte.teste@fpv-arb.local',disp:'Disponível',form:'Classificação Funcional 2024',seminarios:'Vela adaptada',provas:21,aval:8,relAtraso:0,estado:'Suspenso',obs:'Suspensão administrativa temporária. Sem nomeação operacional.',docs:[]},
    {id:8,cod:'ARB-151',nome:'Luís Barros',cat:'Oficial de Regata',grad:'Clube',lic:'Válida',valid:'2026-12-05',reg:'Associação Regional Madeira',contacto:'luis.barros.teste@fpv-arb.local',disp:'Disponível',form:'Curso Clube 2025',seminarios:'Secretariado e apoio técnico',provas:8,aval:4,relAtraso:0,estado:'Ativo',obs:'Pode apoiar provas de clube e secretariado.',docs:[]}
  ],
  provas:[
    {id:1,nome:'Campeonato Nacional de ILCA',tipo:'Campeonato Nacional',amb:'Nacional',ini:'2026-06-06',fim:'2026-06-08',local:'Cascais',clube:'Clube Naval de Cascais',classes:'ILCA 4, ILCA 6, ILCA 7',barcos:118,campos:'Campo Alpha e Campo Bravo',estado:'Nomeações pendentes',docs:'Aguardando validação',relatorio:'Pendente',necessidades:{'Presidente da Comissão de Regata':1,'Oficial de Regata':2,'Presidente da Comissão de Protestos':1,'Juiz':2,'Medidor':1},checklist:{'Anúncio de Regata':true,'Instruções de Regata':false,'Resultados':false,'Protestos':false,'Decisões':false,'Aditamentos':true,'Relatório de prova':false,'Mapa de nomeações':true,'Documentos de medição':false}},
    {id:2,nome:'Taça de Portugal Optimist',tipo:'Taça de Portugal',amb:'Nacional',ini:'2026-06-14',fim:'2026-06-16',local:'Portimão',clube:'Clube Naval de Portimão',classes:'Optimist',barcos:142,campos:'Campo único costeiro',estado:'Equipa completa',docs:'Validado',relatorio:'Pendente',necessidades:{'Presidente da Comissão de Regata':1,'Oficial de Regata':3,'Juiz':2,'Secretariado de prova':1},checklist:{'Anúncio de Regata':true,'Instruções de Regata':true,'Resultados':false,'Protestos':false,'Decisões':false,'Aditamentos':false,'Relatório de prova':false,'Mapa de nomeações':true,'Documentos de medição':false}},
    {id:3,nome:'Regata Atlântico Norte',tipo:'Prova Internacional',amb:'Internacional',ini:'2026-07-04',fim:'2026-07-06',local:'Viana do Castelo',clube:'Clube de Vela de Viana',classes:'ORC, ANC',barcos:34,campos:'Percurso costeiro e oceânico',estado:'Em preparação',docs:'Aguardando validação',relatorio:'Pendente',necessidades:{'Presidente da Comissão de Regata':1,'Oficial de Regata':1,'Juiz':1,'Apoio técnico':1},checklist:{'Anúncio de Regata':true,'Instruções de Regata':false,'Resultados':false,'Protestos':false,'Decisões':false,'Aditamentos':false,'Relatório de prova':false,'Mapa de nomeações':false,'Documentos de medição':false}},
    {id:4,nome:'Circuito Regional Centro',tipo:'Campeonato Regional',amb:'Regional',ini:'2026-05-31',fim:'2026-06-01',local:'Aveiro',clube:'Sporting Clube de Aveiro',classes:'420, Snipe',barcos:48,campos:'Ria de Aveiro',estado:'Planeada',docs:'Incompleto',relatorio:'Pendente',necessidades:{'Oficial de Regata':1,'Juiz':1},checklist:{'Anúncio de Regata':false,'Instruções de Regata':false,'Resultados':false,'Protestos':false,'Decisões':false,'Aditamentos':false,'Relatório de prova':false,'Mapa de nomeações':false,'Documentos de medição':false}},
    {id:5,nome:'Portugal Sailing Grand Prix',tipo:'Prova Internacional',amb:'Internacional',ini:'2026-08-21',fim:'2026-08-25',local:'Vilamoura',clube:'Autoridade Organizadora FPV',classes:'49er, 470, Nacra 17',barcos:86,campos:'Campo Olímpico e Campo Sul',estado:'Nomeações pendentes',docs:'Aguardando validação',relatorio:'Pendente',necessidades:{'Presidente da Comissão de Regata':1,'Oficial de Regata':4,'Presidente da Comissão de Protestos':1,'Juiz-Árbitro':1,'Medidor':2,'Apoio técnico':2},checklist:{'Anúncio de Regata':true,'Instruções de Regata':false,'Resultados':false,'Protestos':false,'Decisões':false,'Aditamentos':false,'Relatório de prova':false,'Mapa de nomeações':false,'Documentos de medição':true}},
    {id:6,nome:'Troféu Clube Naval Local',tipo:'Prova de Clube',amb:'Clube',ini:'2026-04-26',fim:'2026-04-27',local:'Sesimbra',clube:'Clube Naval de Sesimbra',classes:'Cruzeiros',barcos:24,campos:'Baía de Sesimbra',estado:'Concluída',docs:'Validado',relatorio:'Em atraso',necessidades:{'Oficial de Regata':1,'Secretariado de prova':1},checklist:{'Anúncio de Regata':true,'Instruções de Regata':true,'Resultados':true,'Protestos':false,'Decisões':false,'Aditamentos':false,'Relatório de prova':false,'Mapa de nomeações':true,'Documentos de medição':false}}
  ],
  nomeacoes:[
    {id:1,prova:1,arb:6,funcao:'Presidente da Comissão de Regata',estado:'Aceite',motivo:'Confirmação recebida.'},
    {id:2,prova:1,arb:2,funcao:'Medidor',estado:'Pendente de resposta',motivo:''},
    {id:3,prova:1,arb:1,funcao:'Presidente da Comissão de Protestos',estado:'Enviada',motivo:''},
    {id:4,prova:2,arb:6,funcao:'Presidente da Comissão de Regata',estado:'Aceite',motivo:''},
    {id:5,prova:2,arb:3,funcao:'Oficial de Regata',estado:'Aceite',motivo:'Validação administrativa pendente.'},
    {id:6,prova:2,arb:1,funcao:'Juiz',estado:'Aceite',motivo:''},
    {id:7,prova:3,arb:7,funcao:'Classificador Funcional',estado:'Rascunho',motivo:'Aguardar decisão de conflito.'}
  ],
  disponibilidades:[
    {id:1,arb:1,data:'2026-06-06',prova:1,estado:'Disponível',obs:'Disponível para todo o fim de semana.'},
    {id:2,arb:2,data:'2026-06-06',prova:1,estado:'Por confirmar',obs:'A confirmar deslocação.'},
    {id:3,arb:4,data:'2026-06-14',prova:2,estado:'Indisponível',obs:'Compromisso profissional.'},
    {id:4,arb:6,data:'2026-06-14',prova:2,estado:'Disponível',obs:'Sem restrições.'},
    {id:5,arb:7,data:'2026-07-04',prova:3,estado:'Disponível',obs:'Sujeito a decisão administrativa.'},
    {id:6,arb:8,data:'2026-05-31',prova:4,estado:'Disponível',obs:'Preferência por apoio local.'}
  ],
  relatorios:[
    {id:1,prova:6,arb:8,prazo:'2026-05-02',estado:'Em atraso',obs:'Aguarda relatório final e anexos.'},
    {id:2,prova:2,arb:6,prazo:'2026-06-21',estado:'Pendente',obs:'Prazo automático: 5 dias após fim da prova.'},
    {id:3,prova:1,arb:6,prazo:'2026-06-13',estado:'Pendente',obs:'A entregar após conclusão.'},
    {id:4,prova:4,arb:3,prazo:'2026-06-06',estado:'Pendente',obs:'Relatório simplificado regional.'}
  ],
  conflitos:[
    {id:1,arb:7,prova:3,tipo:'ligação a clube',estado:'em análise',descricao:'Vínculo ao clube organizador.',decisao:'Aguardar deliberação do Conselho de Arbitragem.',responsavel:'Conselho de Arbitragem',obs:'Impacto potencial na nomeação.'},
    {id:2,arb:2,prova:1,tipo:'ligação a atleta',estado:'sem impedimento',descricao:'Ligação indireta a atleta inscrito.',decisao:'Sem impedimento para função de medição.',responsavel:'Conselho de Arbitragem',obs:'Monitorizar alterações.'},
    {id:3,arb:5,prova:4,tipo:'relação familiar',estado:'impedimento total',descricao:'Relação familiar direta com atleta.',decisao:'Não nomear para esta prova.',responsavel:'Conselho de Arbitragem',obs:'Impedimento registado.'}
  ],
  documentos:[
    {id:1,nome:'Aviso de Regata - Campeonato Nacional ILCA.pdf',tipo:'avisos de regata',prova:1,arb:null,versao:'1.0',data:'2026-05-02',estado:'válido'},
    {id:2,nome:'Instruções de Regata - Optimist.pdf',tipo:'instruções de regata',prova:2,arb:null,versao:'1.1',data:'2026-05-08',estado:'válido'},
    {id:3,nome:'Mapa disponibilidade junho - Miguel Nunes.xlsx',tipo:'mapas de disponibilidade',prova:null,arb:2,versao:'1.0',data:'2026-05-10',estado:'por validar'},
    {id:4,nome:'Ata de protesto 04.pdf',tipo:'atas',prova:2,arb:1,versao:'1.0',data:'2026-05-12',estado:'arquivado'},
    {id:5,nome:'Relatório final Sesimbra.docx',tipo:'relatórios',prova:6,arb:8,versao:'0.9',data:'2026-05-13',estado:'em falta'}
  ],
  comunicacoes:[
    {id:1,dest:'Miguel Nunes',tipo:'pedido de confirmação',estado:'pendente',data:'2026-05-12 09:20',prio:'alta',msg:'Confirmar nomeação como Medidor no Campeonato Nacional de ILCA.'},
    {id:2,dest:'Marta Reis',tipo:'licença expirada',estado:'enviada',data:'2026-05-12 11:45',prio:'alta',msg:'Regularização necessária antes de nova nomeação.'},
    {id:3,dest:'Luís Barros',tipo:'pedido de relatório',estado:'pendente',data:'2026-05-13 08:10',prio:'alta',msg:'Relatório final da prova de Sesimbra em atraso.'},
    {id:4,dest:'Conselho de Arbitragem',tipo:'conflito declarado',estado:'lida',data:'2026-05-13 10:00',prio:'crítica',msg:'Conflito pendente na Regata Atlântico Norte.'}
  ],
  auditoria:[
    {id:1,data:'2026-05-13 10:12',user:'Conselho de Arbitragem',acao:'Conflito de interesse declarado',ent:'Regata Atlântico Norte',ant:'Sem registo',novo:'Em análise',just:'Declaração recebida',origem:'Módulo Conflitos'},
    {id:2,data:'2026-05-13 09:44',user:'Responsável Operacional',acao:'Árbitro nomeado',ent:'Campeonato Nacional de ILCA',ant:'Sem nomeação',novo:'Enviada',just:'Preparação de equipa',origem:'Módulo Nomeações'},
    {id:3,data:'2026-05-12 16:20',user:'Secretariado FPV',acao:'Documento validado',ent:'Aviso de Regata ILCA',ant:'Por validar',novo:'Válido',just:'Verificação documental',origem:'Módulo Documentos'}
  ]
});

let state;
let deferredInstallPrompt = null;

function initApp(){
  try{
    closeModal();
    state = loadState();
    normalizeState();
    bindCoreEvents();
    renderNavigation();
    renderAll();
    const initialPage = (location.hash || '').replace('#','');
    navigate(pageMeta[initialPage] ? initialPage : 'dashboard');
    closeModal();
    registerServiceWorker();
  }catch(err){
    console.warn('Falha controlada na inicialização. A repor dados internos.', err);
    state = defaultData();
    saveState();
    renderNavigation(); renderAll(); navigate('dashboard');
    showToast('Dados internos repostos para garantir o funcionamento da plataforma.');
  }
}

function loadState(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    if(!raw) return defaultData();
    const parsed = JSON.parse(raw);
    if(!parsed || !Array.isArray(parsed.arbitros) || !Array.isArray(parsed.provas) || !Array.isArray(parsed.nomeacoes)) throw new Error('Estrutura inválida');
    return parsed;
  }catch(err){
    console.warn('localStorage vazio ou corrompido; a usar dados internos válidos.', err);
    return defaultData();
  }
}
function normalizeState(){
  const base = defaultData();
  Object.keys(base).forEach(k => { if(state[k] === undefined) state[k] = base[k]; });
  state.ui = {...base.ui, ...(state.ui || {})};
  state.relatorios.forEach(r => { const p = getRace(r.prova); if(p) r.prazo = addDays(p.fim, 5); if(r.estado !== 'Entregue' && r.estado !== 'Validado' && dateLt(r.prazo, TODAY)) r.estado = 'Em atraso'; });
}
function saveState(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
function mutate(fn){ fn(); normalizeState(); saveState(); renderAll(); }

function bindCoreEvents(){
  document.getElementById('mobileMenuBtn')?.addEventListener('click', openSidebar);
  document.getElementById('overlay')?.addEventListener('click', closeSidebar);
  document.getElementById('modalCloseBtn')?.addEventListener('click', closeModal);
  document.getElementById('modalRoot')?.addEventListener('click', e => { if(e.target.id === 'modalRoot') closeModal(); });
  document.addEventListener('keydown', e => { if(e.key === 'Escape') closeModal(); });
  window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); deferredInstallPrompt = e; renderPageActions(); });
}

function renderNavigation(){
  const nav = document.getElementById('mainNav');
  nav.innerHTML = navItems.map(([id,icon,label]) => `<button type="button" data-nav="${id}" class="${state.ui.page===id?'active':''}"><span class="nav-icon">${icon}</span><span>${label}</span></button>`).join('');
  nav.querySelectorAll('[data-nav]').forEach(btn => btn.addEventListener('click', () => navigate(btn.dataset.nav)));
}
function navigate(page){
  if(!pageMeta[page]) page = 'dashboard';
  state.ui.page = page; saveState();
  document.querySelectorAll('.section').forEach(s => s.classList.toggle('active', s.id === page));
  document.querySelectorAll('[data-nav]').forEach(b => b.classList.toggle('active', b.dataset.nav === page));
  const [eyebrow,title,subtitle] = pageMeta[page];
  setText('pageEyebrow', eyebrow); setText('pageTitle', title); setText('pageSubtitle', subtitle);
  renderPageActions(); closeSidebar(); document.getElementById('main')?.focus({preventScroll:true});
}
function renderPageActions(){
  const actions = document.getElementById('pageActions');
  const install = deferredInstallPrompt ? `<button class="btn btn-primary" type="button" data-action="install">Instalar aplicação</button>` : '';
  const common = `<button class="btn" type="button" data-action="save-local">Guardar dados localmente</button><button class="btn" type="button" data-action="reset-data">Repor dados de teste</button>`;
  const byPage = {
    dashboard:`<button class="btn btn-primary" type="button" data-navgo="nomeacoes">Gerir nomeações</button>`,
    arbitros:`<button class="btn btn-primary" type="button" data-action="new-ref">Novo árbitro</button><button class="btn" type="button" data-export="arbitros">Exportar CSV</button>`,
    provas:`<button class="btn btn-primary" type="button" data-action="new-race">Nova prova</button><button class="btn" type="button" data-export="provas">Exportar CSV</button>`,
    nomeacoes:`<button class="btn btn-primary" type="button" data-action="new-appointment">Nova nomeação</button><button class="btn" type="button" data-export="nomeacoes">Exportar CSV</button>`,
    disponibilidades:`<button class="btn btn-primary" type="button" data-action="new-availability">Registar disponibilidade</button><button class="btn" type="button" data-export="disponibilidades">Exportar CSV</button>`,
    relatorios:`<button class="btn btn-primary" type="button" data-action="new-report">Registar relatório</button><button class="btn" type="button" data-export="relatorios">Exportar CSV</button>`,
    conflitos:`<button class="btn btn-primary" type="button" data-action="new-conflict">Registar conflito</button><button class="btn" type="button" data-export="conflitos">Exportar CSV</button>`,
    documentos:`<button class="btn btn-primary" type="button" data-action="new-document">Adicionar documento</button>`,
    auditoria:`<button class="btn" type="button" data-export="auditoria">Exportar CSV</button>`
  };
  actions.innerHTML = `${install}${byPage[state.ui.page] || ''}${common}`;
  actions.querySelectorAll('[data-navgo]').forEach(b => b.addEventListener('click', () => navigate(b.dataset.navgo)));
  actions.querySelectorAll('[data-action]').forEach(b => b.addEventListener('click', () => handleAction(b.dataset.action)));
  actions.querySelectorAll('[data-export]').forEach(b => b.addEventListener('click', () => exportCSV(b.dataset.export)));
}
function handleAction(action){
  const map = {
    'install': installApp, 'save-local': () => {saveState(); showToast('Dados guardados neste dispositivo.');}, 'reset-data': resetData,
    'new-ref': () => openRefereeForm(), 'new-race': () => openRaceForm(), 'new-appointment': () => openAppointmentForm(),
    'new-availability': () => openAvailabilityForm(), 'new-report': () => openReportForm(), 'new-conflict': () => openConflictForm(), 'new-document': () => openDocumentForm()
  };
  (map[action] || (() => showToast('Ação indisponível neste contexto.')))();
}
function installApp(){ if(!deferredInstallPrompt) return showToast('Instalação não disponível neste navegador.'); deferredInstallPrompt.prompt(); deferredInstallPrompt = null; renderPageActions(); }
function openSidebar(){ document.getElementById('sidebar')?.classList.add('open'); const o=document.getElementById('overlay'); if(o) o.hidden=false; }
function closeSidebar(){ document.getElementById('sidebar')?.classList.remove('open'); const o=document.getElementById('overlay'); if(o) o.hidden=true; }

function safeRender(id, fn){
  try{ const el=document.getElementById(id); if(el) el.innerHTML = fn(); }
  catch(err){ console.warn(`Falha ao renderizar ${id}`, err); const el=document.getElementById(id); if(el) el.innerHTML = empty(`Não foi possível carregar ${id}. Os restantes módulos continuam disponíveis.`); }
}
function renderAll(){
  safeRender('dashboard', renderDashboard); safeRender('arbitros', renderArbitros); safeRender('perfil', renderPerfil); safeRender('provas', renderProvas);
  safeRender('nomeacoes', renderNomeacoes); safeRender('disponibilidades', renderDisponibilidades); safeRender('credenciacao', renderCredenciacao);
  safeRender('relatorios', renderRelatorios); safeRender('conflitos', renderConflitos); safeRender('documentos', renderDocumentos); safeRender('comunicacoes', renderComunicacoes);
  safeRender('auditoria', renderAuditoria); safeRender('perfis', renderPerfis);
}

function renderDashboard(){
  const future = state.provas.filter(p => p.fim >= TODAY);
  const incomplete = state.provas.filter(p => appointedCount(p.id) < requiredCount(p.id));
  const pending = state.nomeacoes.filter(n => ['Enviada','Pendente de resposta','Rascunho'].includes(n.estado));
  const refused = state.nomeacoes.filter(n => n.estado === 'Recusada');
  const available = state.arbitros.filter(a => a.disp === 'Disponível' && a.lic === 'Válida' && a.estado === 'Ativo');
  const noMap = state.arbitros.filter(a => !state.disponibilidades.some(d => d.arb === a.id));
  const expired = state.arbitros.filter(a => ['Expirada','Suspensa'].includes(a.lic));
  const expiring = state.arbitros.filter(a => a.lic === 'Válida' && daysUntil(a.valid) <= 60 && daysUntil(a.valid) >= 0);
  const lateReports = state.relatorios.filter(r => isLateReport(r));
  const pendingConflicts = state.conflitos.filter(c => ['declarado','em análise','impedimento parcial','impedimento total'].includes(c.estado));
  const missingDocs = state.documentos.filter(d => ['em falta','por validar'].includes(d.estado))
    .concat(state.provas.filter(p => ['Incompleto','Aguardando validação'].includes(p.docs)).map(p => ({nome:p.nome, estado:p.docs})));
  const critical = lateReports.length + pendingConflicts.length + expired.length + incomplete.length + missingDocs.length;
  return `
    <div class="grid kpi-grid">
      ${kpi('Provas futuras', future.length, 'Calendário ativo', 'provas')}
      ${kpi('Provas sem equipa completa', incomplete.length, 'Necessitam de nomeação', 'nomeacoes')}
      ${kpi('Nomeações pendentes', pending.length, 'Aguardam ação', 'nomeacoes')}
      ${kpi('Nomeações recusadas', refused.length, 'Exigem substituição', 'nomeacoes')}
      ${kpi('Árbitros disponíveis', available.length, 'Ativos e regulares', 'arbitros')}
      ${kpi('Sem mapa de disponibilidade', noMap.length, 'Enviar pedido de mapa', 'disponibilidades')}
      ${kpi('Licenças expiradas/suspensas', expired.length, 'Bloqueiam nomeação', 'credenciacao')}
      ${kpi('Licenças a expirar', expiring.length, 'Dentro de 60 dias', 'credenciacao')}
      ${kpi('Relatórios em atraso', lateReports.length, 'Prazo ultrapassado', 'relatorios')}
      ${kpi('Conflitos pendentes', pendingConflicts.length, 'Exigem decisão', 'conflitos')}
      ${kpi('Documentos em falta', missingDocs.length, 'Por validar ou incompletos', 'documentos')}
      ${kpi('Tarefas críticas', critical, 'Prioridade operacional', 'auditoria')}
    </div>
    <div class="grid two-col">
      <div class="card"><div class="panel"><h3>Alertas críticos</h3><button class="mini" data-goto="auditoria">Ver auditoria</button></div><div class="list">
        ${dashboardAlerts().map(a => `<div class="item clickable" data-goto="${a.page}"><div>${badge(a.level,a.type)}<p><strong>${a.title}</strong></p><p>${a.text}</p></div><span class="badge dark">Abrir</span></div>`).join('') || empty('Sem alertas críticos neste momento.')}
      </div></div>
      <div class="card"><div class="panel"><h3>Próximas provas</h3><button class="mini" data-goto="provas">Ver todas</button></div><div class="list">
        ${future.slice(0,6).map(p => { const count=appointedCount(p.id), req=requiredCount(p.id), pct=Math.min(100,Math.round((count/Math.max(req,1))*100)); return `<div class="item"><div style="width:100%"><strong>${esc(p.nome)}</strong><p>${fmtDate(p.ini)} — ${fmtDate(p.fim)} · ${esc(p.local)} · ${count}/${req} elementos</p><div class="progress"><span style="width:${pct}%"></span></div></div>${statusBadge(p.estado)}</div>`;}).join('') || empty('Não existem provas futuras registadas.')}
      </div></div>
    </div>`;
}
function kpi(label,value,hint,page){ return `<article class="card kpi clickable" data-goto="${page}"><div><div class="label">${label}</div><div class="value">${value}</div></div><div class="hint">${hint}</div></article>`; }
function dashboardAlerts(){
  const arr=[];
  state.relatorios.filter(isLateReport).forEach(r=>arr.push({level:'bad',type:'Relatório',title:`Relatório em atraso: ${getRace(r.prova)?.nome||'Prova'}`,text:`Prazo: ${fmtDate(r.prazo)}.`,page:'relatorios'}));
  state.conflitos.filter(c=>['declarado','em análise','impedimento parcial','impedimento total'].includes(c.estado)).forEach(c=>arr.push({level:'bad',type:'Conflito',title:`Conflito pendente: ${getRef(c.arb)?.nome||'Árbitro'}`,text:`${getRace(c.prova)?.nome||'Prova'} · ${c.estado}.`,page:'conflitos'}));
  state.provas.filter(p=>appointedCount(p.id)<requiredCount(p.id)).forEach(p=>arr.push({level:'warn',type:'Equipa incompleta',title:p.nome,text:`${appointedCount(p.id)}/${requiredCount(p.id)} elementos nomeados.`,page:'nomeacoes'}));
  state.arbitros.filter(a=>a.lic==='Expirada'||a.lic==='Suspensa'||daysUntil(a.valid)<=60).slice(0,5).forEach(a=>arr.push({level:a.lic==='Válida'?'warn':'bad',type:'Licença',title:a.nome,text:`${a.lic} · validade ${fmtDate(a.valid)}.`,page:'credenciacao'}));
  return arr.slice(0,10);
}

function renderArbitros(){
  const f=getFilters('arbitros');
  const list=state.arbitros.filter(a => matchText(a, f.q, ['nome','cod','contacto','reg','cat','grad']) && match(a.cat,f.cat) && match(a.grad,f.grad) && match(a.reg,f.reg) && match(a.lic,f.lic) && match(a.disp,f.disp) && match(a.estado,f.estado));
  const headers=['Árbitro','Categoria','Graduação','Licença','Região','Disponibilidade','Formação','Provas','Avaliações','Relatórios','Conflitos','Estado','Ações'];
  const rows=list.map(a=>[
    `<div class="row-title">${esc(a.nome)}</div><div class="row-sub">${esc(a.cod)} · ${esc(a.contacto)}</div>`, esc(a.cat), esc(a.grad), `${licenseBadge(a.lic)}<div class="row-sub">até ${fmtDate(a.valid)}</div>`, esc(a.reg), availabilityBadge(a.disp), esc(a.form), a.provas, a.aval, a.relAtraso, activeConflicts(a.id), stateBadge(a.estado),
    actions([['Perfil',()=>selectProfile(a.id)],['Editar',()=>openRefereeForm(a.id)],['Indisponível',()=>markUnavailable(a.id)],['Histórico',()=>showRefHistory(a.id)],['Documento',()=>openDocumentForm({arb:a.id})],['Conflito',()=>openConflictForm({arb:a.id})]])
  ]);
  return `<div class="card">${filterBar('arbitros', f, [ ['cat','Categoria',unique(state.arbitros.map(a=>a.cat))], ['grad','Graduação',unique(state.arbitros.map(a=>a.grad))], ['reg','Região',unique(state.arbitros.map(a=>a.reg))], ['lic','Licença',unique(state.arbitros.map(a=>a.lic))], ['disp','Disponibilidade',unique(state.arbitros.map(a=>a.disp))], ['estado','Estado',unique(state.arbitros.map(a=>a.estado))] ], 'Pesquisar árbitro, código ou região')}${table(headers, rows)}${cards(list.map(a=>({title:a.nome, sub:`${a.cod} · ${a.cat} · ${a.grad}`, rows:[['Licença',`${a.lic} · ${fmtDate(a.valid)}`],['Região',a.reg],['Disponibilidade',a.disp],['Estado',a.estado],['Relatórios em atraso',a.relAtraso]], actions:actions([['Perfil',()=>selectProfile(a.id)],['Editar',()=>openRefereeForm(a.id)],['Nomear',()=>openAppointmentForm({arb:a.id})]])})))}</div>`;
}

function renderPerfil(){
  const a=getRef(state.ui.selectedRef) || state.arbitros[0]; if(!a) return empty('Não existem árbitros registados.');
  const noms=state.nomeacoes.filter(n=>n.arb===a.id), rels=state.relatorios.filter(r=>r.arb===a.id), confs=state.conflitos.filter(c=>c.arb===a.id), docs=state.documentos.filter(d=>d.arb===a.id);
  const risk = appointmentRisk(a, state.provas[0], 'Juiz');
  return `<div class="grid profile-grid">
    <aside class="profile-box"><div class="profile-head"><div class="big-avatar">${initials(a.nome)}</div><div><h3>${esc(a.nome)}</h3><p class="row-sub">${esc(a.cod)} · ${esc(a.cat)}</p></div></div>
      ${metric('Graduação',a.grad)}${metric('Licença',`${a.lic} · ${fmtDate(a.valid)}`)}${metric('Região',a.reg)}${metric('Disponibilidade',a.disp)}${metric('Estado',a.estado)}${metric('Provas realizadas',a.provas)}${metric('Avaliações positivas',a.aval)}
      <div class="row-actions" style="margin-top:16px">${actions([['Nomear',()=>openAppointmentForm({arb:a.id})],['Editar',()=>openRefereeForm(a.id)],['Disponibilidade',()=>openAvailabilityForm({arb:a.id})],['Conflito',()=>openConflictForm({arb:a.id})],['Documento',()=>openDocumentForm({arb:a.id})]])}</div>
    </aside>
    <div class="grid">
      <div class="card"><div class="panel"><h3>Resumo operacional</h3>${riskBadge(risk)}</div><div class="grid three-col"><div class="item"><div><strong>${noms.filter(n=>['Enviada','Pendente de resposta','Rascunho'].includes(n.estado)).length}</strong><p>Nomeações pendentes</p></div></div><div class="item"><div><strong>${rels.filter(r=>['Entregue','Validado'].includes(r.estado)).length}</strong><p>Relatórios entregues</p></div></div><div class="item"><div><strong>${confs.length}</strong><p>Conflitos registados</p></div></div></div><p class="offline-note">${esc(a.obs)}</p></div>
      <div class="grid two-col"><div class="card"><div class="panel"><h3>Histórico de provas</h3></div><div class="list">${noms.map(n=>`<div class="item"><div><strong>${esc(getRace(n.prova)?.nome||'Prova')}</strong><p>${esc(n.funcao)} · ${esc(n.estado)}</p></div>${nomBadge(n.estado)}</div>`).join('')||empty('Sem nomeações registadas.')}</div></div><div class="card"><div class="panel"><h3>Relatórios</h3></div><div class="list">${rels.map(r=>`<div class="item"><div><strong>${esc(getRace(r.prova)?.nome||'Prova')}</strong><p>Prazo: ${fmtDate(r.prazo)} · ${esc(r.obs)}</p></div>${reportBadge(r.estado)}</div>`).join('')||empty('Sem relatórios associados.')}</div></div></div>
      <div class="grid two-col"><div class="card"><div class="panel"><h3>Documentos</h3></div><div class="list">${docs.map(d=>`<div class="item"><div><strong>${esc(d.nome)}</strong><p>${esc(d.tipo)} · versão ${esc(d.versao)}</p></div>${docBadge(d.estado)}</div>`).join('')||empty('Sem documentos associados.')}</div></div><div class="card"><div class="panel"><h3>Conflitos</h3></div><div class="list">${confs.map(c=>`<div class="item"><div><strong>${esc(c.tipo)}</strong><p>${esc(getRace(c.prova)?.nome||'Prova')} · ${esc(c.descricao)}</p></div>${conflictBadge(c.estado)}</div>`).join('')||empty('Sem conflitos registados.')}</div></div></div>
      <div class="card"><div class="panel"><h3>Linha temporal</h3></div><div class="list">${timelineForRef(a).map(t=>`<div class="item"><div><strong>${esc(t.title)}</strong><p>${esc(t.text)}</p></div><small>${esc(t.date)}</small></div>`).join('')}</div></div>
    </div></div>`;
}

function renderProvas(){
  const f=getFilters('provas');
  const list=state.provas.filter(p => matchText(p,f.q,['nome','tipo','amb','local','clube','classes']) && match(p.tipo,f.tipo) && match(p.amb,f.amb) && match(p.local,f.local) && match(p.clube,f.clube) && match(p.estado,f.estado));
  const headers=['Prova','Tipo','Âmbito','Datas','Local','Organização','Classes','Barcos','Equipa','Docs','Relatório','Ações'];
  const rows=list.map(p=>[
    `<div class="row-title">${esc(p.nome)}</div><div class="row-sub">${esc(p.campos)}</div>`, esc(p.tipo), esc(p.amb), `${fmtDate(p.ini)} — ${fmtDate(p.fim)}`, esc(p.local), esc(p.clube), esc(p.classes), p.barcos, `${appointedCount(p.id)}/${requiredCount(p.id)}`, docBadge(p.docs), reportBadge(p.relatorio),
    actions([['Detalhe',()=>showRaceDetail(p.id)],['Editar',()=>openRaceForm(p.id)],['Nomear',()=>{state.ui.selectedRace=p.id; saveState(); renderAll(); navigate('nomeacoes');}],['Histórico',()=>showRaceHistory(p.id)]])
  ]);
  return `<div class="card">${filterBar('provas', f, [ ['tipo','Tipo',unique(state.provas.map(p=>p.tipo))], ['amb','Âmbito',unique(state.provas.map(p=>p.amb))], ['local','Local',unique(state.provas.map(p=>p.local))], ['clube','Clube',unique(state.provas.map(p=>p.clube))], ['estado','Estado',unique(state.provas.map(p=>p.estado))] ], 'Pesquisar prova, clube ou local')}${table(headers, rows)}${cards(list.map(p=>({title:p.nome, sub:`${p.tipo} · ${fmtDate(p.ini)} — ${fmtDate(p.fim)}`, rows:[['Local',p.local],['Organização',p.clube],['Equipa',`${appointedCount(p.id)}/${requiredCount(p.id)}`],['Documentos',p.docs],['Relatório',p.relatorio]], actions:actions([['Detalhe',()=>showRaceDetail(p.id)],['Editar',()=>openRaceForm(p.id)],['Nomear',()=>{state.ui.selectedRace=p.id; saveState(); renderAll(); navigate('nomeacoes');}]])})))}</div>`;
}

function renderNomeacoes(){
  const p=getRace(state.ui.selectedRace) || state.provas[0]; if(!p) return empty('Não existem provas para nomeação.');
  const noms=state.nomeacoes.filter(n=>n.prova===p.id);
  return `<div class="grid two-col"><div class="card"><div class="panel"><h3>Prova selecionada</h3></div><select class="select" id="selectedRacePicker">${state.provas.map(r=>`<option value="${r.id}" ${r.id===p.id?'selected':''}>${esc(r.nome)} · ${fmtDate(r.ini)}</option>`).join('')}</select><div class="list" style="margin-top:14px"><div class="item"><div><strong>${esc(p.nome)}</strong><p>${esc(p.local)} · ${esc(p.amb)} · ${esc(p.classes)}</p></div>${statusBadge(p.estado)}</div>${Object.entries(p.necessidades).map(([fn,q])=>`<div class="item"><div><strong>${esc(fn)}</strong><p>Necessários: ${q} · Nomeados: ${noms.filter(n=>n.funcao===fn&&!['Cancelada','Recusada'].includes(n.estado)).length}</p></div><button class="mini" data-appoint-fn="${escAttr(fn)}">Nomear</button></div>`).join('')}</div></div>
  <div class="card"><div class="panel"><h3>Árbitros elegíveis</h3><button class="mini" data-action-local="new-appointment">Nomeação manual</button></div><div class="list">${state.arbitros.map(a=>candidate(a,p)).join('')}</div></div></div>
  <div class="card" style="margin-top:16px"><div class="panel"><h3>Equipa nomeada</h3></div>${appointmentTable(noms,p)}</div>`;
}
function candidate(a,p){ const risk=appointmentRisk(a,p,''); const already=state.nomeacoes.some(n=>n.prova===p.id&&n.arb===a.id&&!['Cancelada','Recusada'].includes(n.estado)); return `<div class="item"><div><strong>${esc(a.nome)}</strong><p>${esc(a.cat)} · ${esc(a.grad)} · ${esc(a.reg)}</p>${riskMessages(risk).slice(0,3).join(' ')||badge('ok','Sem risco')}</div><button class="mini" ${already?'disabled':''} data-appoint-arb="${a.id}">${already?'Nomeado':'Nomear'}</button></div>`; }
function appointmentTable(noms,p){
  const headers=['Árbitro','Função','Estado','Validações','Motivo','Ações'];
  const rows=noms.map(n=>{ const a=getRef(n.arb), risk=appointmentRisk(a,p,n.funcao); return [esc(a?.nome||'Árbitro removido'), esc(n.funcao), nomBadge(n.estado), riskMessages(risk).join(' ')||badge('ok','Sem risco'), esc(n.motivo||'—'), actions([['Aceitar',()=>setAppointmentStatus(n.id,'Aceite')],['Recusar',()=>promptAppointmentStatus(n.id,'Recusada')],['Substituir',()=>promptAppointmentStatus(n.id,'Substituída')],['Cancelar',()=>promptAppointmentStatus(n.id,'Cancelada')],['Concluir',()=>setAppointmentStatus(n.id,'Concluída')]])]; });
  return table(headers, rows) + cards(noms.map(n=>{const a=getRef(n.arb), risk=appointmentRisk(a,p,n.funcao); return {title:a?.nome||'Árbitro removido', sub:n.funcao, rows:[['Estado',n.estado],['Validações',stripHtml(riskMessages(risk).join(', ')||'Sem risco')],['Motivo',n.motivo||'—']], actions:actions([['Aceitar',()=>setAppointmentStatus(n.id,'Aceite')],['Recusar',()=>promptAppointmentStatus(n.id,'Recusada')],['Substituir',()=>promptAppointmentStatus(n.id,'Substituída')]])}; }));
}

function renderDisponibilidades(){
  const f=getFilters('disponibilidades');
  const list=state.disponibilidades.filter(d => { const a=getRef(d.arb); return a && matchText(a,f.q,['nome','cat','reg','grad']) && match(a.cat,f.cat) && match(a.reg,f.reg) && match(a.grad,f.grad); });
  const missing=state.arbitros.filter(a=>!state.disponibilidades.some(d=>d.arb===a.id));
  const headers=['Data','Árbitro','Categoria','Região','Graduação','Prova','Estado','Observações','Ações'];
  const rows=list.map(d=>{const a=getRef(d.arb); return [fmtDate(d.data), esc(a.nome), esc(a.cat), esc(a.reg), esc(a.grad), esc(getRace(d.prova)?.nome||'Geral'), availabilityBadge(d.estado), esc(d.obs||'—'), actions([['Editar',()=>openAvailabilityForm(d)],['Detalhe',()=>showAvailabilityDetail(d.id)]])];});
  return `<div class="card">${filterBar('disponibilidades', f, [['cat','Categoria',unique(state.arbitros.map(a=>a.cat))],['reg','Região',unique(state.arbitros.map(a=>a.reg))],['grad','Graduação',unique(state.arbitros.map(a=>a.grad))]], 'Pesquisar árbitro ou região')}<div class="item" style="margin-bottom:14px"><div><strong>Mapas em falta</strong><p>${missing.length} árbitro(s) sem mapa de disponibilidade registado neste dispositivo.</p></div><button class="mini" data-action-local="missing-maps">Gerar alerta</button></div>${table(headers, rows)}${cards(list.map(d=>{const a=getRef(d.arb); return {title:a?.nome||'Árbitro', sub:`${fmtDate(d.data)} · ${getRace(d.prova)?.nome||'Geral'}`, rows:[['Estado',d.estado],['Categoria',a?.cat||'—'],['Região',a?.reg||'—'],['Observações',d.obs||'—']], actions:actions([['Editar',()=>openAvailabilityForm(d)],['Detalhe',()=>showAvailabilityDetail(d.id)]])};}))}</div>`;
}
function renderCredenciacao(){
  const headers=['Árbitro','Categoria','Graduação','Licença','Validade','Formação','Seminários','Avaliações','Provas','Requisitos','Estado','Ações'];
  const rows=state.arbitros.map(a=>[esc(a.nome),esc(a.cat),esc(a.grad),licenseBadge(a.lic),fmtDate(a.valid),esc(a.form),esc(a.seminarios),a.aval,a.provas,esc(requirements(a)),credBadge(a),actions([['Rever',()=>showCredentialDetail(a.id)],['Editar',()=>openRefereeForm(a.id)]])]);
  return `<div class="card"><div class="panel"><h3>Controlo de credenciação</h3><button class="mini" data-export="arbitros">Exportar árbitros</button></div>${table(headers, rows)}${cards(state.arbitros.map(a=>({title:a.nome, sub:`${a.cat} · ${a.grad}`, rows:[['Licença',`${a.lic} · ${fmtDate(a.valid)}`],['Formação',a.form],['Estado',credText(a)],['Requisitos',requirements(a)]], actions:actions([['Rever',()=>showCredentialDetail(a.id)],['Editar',()=>openRefereeForm(a.id)]])})))}</div>`;
}
function renderRelatorios(){
  const headers=['Prova','Árbitro responsável','Fim da prova','Prazo','Estado','Observações','Ações'];
  const rows=state.relatorios.map(r=>{ const p=getRace(r.prova), a=getRef(r.arb); return [esc(p?.nome||'Prova'), esc(a?.nome||'Árbitro'), fmtDate(p?.fim), fmtDate(r.prazo), reportBadge(isLateReport(r)?'Em atraso':r.estado), esc(r.obs), actions([['Entregue',()=>deliverReport(r.id)],['Validar',()=>setReportStatus(r.id,'Validado')],['Devolver',()=>promptReportReturn(r.id)],['Detalhe',()=>showReportDetail(r.id)]])]; });
  return `<div class="card"><div class="panel"><h3>Relatórios pós-prova</h3><span class="badge info">Prazo automático: 5 dias após fim da prova</span></div>${table(headers, rows)}${cards(state.relatorios.map(r=>{const p=getRace(r.prova),a=getRef(r.arb);return{title:p?.nome||'Prova',sub:`Responsável: ${a?.nome||'—'}`,rows:[['Prazo',fmtDate(r.prazo)],['Estado',isLateReport(r)?'Em atraso':r.estado],['Observações',r.obs]],actions:actions([['Entregue',()=>deliverReport(r.id)],['Validar',()=>setReportStatus(r.id,'Validado')],['Detalhe',()=>showReportDetail(r.id)]])};}))}</div>`;
}
function renderConflitos(){
  const headers=['Árbitro','Prova','Tipo','Estado','Decisão','Responsável','Observações','Ações'];
  const rows=state.conflitos.map(c=>[esc(getRef(c.arb)?.nome||'Árbitro'), esc(getRace(c.prova)?.nome||'Prova'), esc(c.tipo), conflictBadge(c.estado), esc(c.decisao), esc(c.responsavel), esc(c.obs), actions([['Detalhe',()=>showConflictDetail(c.id)],['Sem impedimento',()=>decideConflict(c.id,'sem impedimento')],['Parcial',()=>decideConflict(c.id,'impedimento parcial')],['Total',()=>decideConflict(c.id,'impedimento total')],['Arquivar',()=>decideConflict(c.id,'arquivado')]])]);
  return `<div class="card"><div class="panel"><h3>Conflitos de interesse</h3><button class="mini" data-action-local="new-conflict">Registar conflito</button></div>${table(headers, rows)}${cards(state.conflitos.map(c=>({title:getRef(c.arb)?.nome||'Árbitro',sub:`${getRace(c.prova)?.nome||'Prova'} · ${c.tipo}`,rows:[['Estado',c.estado],['Decisão',c.decisao],['Impacto',conflictImpact(c.estado)]],actions:actions([['Detalhe',()=>showConflictDetail(c.id)],['Decidir',()=>decideConflict(c.id,'sem impedimento')]])})))}</div>`;
}
function renderDocumentos(){
  const headers=['Documento','Tipo','Prova','Árbitro','Versão','Data','Estado','Ações'];
  const rows=state.documentos.map(d=>[esc(d.nome),esc(d.tipo),esc(getRace(d.prova)?.nome||'—'),esc(getRef(d.arb)?.nome||'—'),esc(d.versao),fmtDate(d.data),docBadge(d.estado),actions([['Ver',()=>showDocumentDetail(d.id)],['Validar',()=>setDocumentStatus(d.id,'válido')],['Rejeitar',()=>setDocumentStatus(d.id,'rejeitado')],['Arquivar',()=>setDocumentStatus(d.id,'arquivado')],['Remover',()=>removeDocument(d.id)]])]);
  return `<div class="grid two-col"><div class="card"><div class="panel"><h3>Arquivo documental</h3><button class="mini" data-action-local="new-document">Adicionar documento</button></div>${table(headers, rows)}${cards(state.documentos.map(d=>({title:d.nome,sub:`${d.tipo} · versão ${d.versao}`,rows:[['Prova',getRace(d.prova)?.nome||'—'],['Árbitro',getRef(d.arb)?.nome||'—'],['Estado',d.estado],['Data',fmtDate(d.data)]],actions:actions([['Ver',()=>showDocumentDetail(d.id)],['Validar',()=>setDocumentStatus(d.id,'válido')],['Arquivar',()=>setDocumentStatus(d.id,'arquivado')]])})))}</div><div class="card"><div class="panel"><h3>Checklist documental por prova</h3></div><div class="list">${state.provas.map(p=>`<div class="item"><div><strong>${esc(p.nome)}</strong><p>${Object.entries(p.checklist||{}).filter(([,v])=>v).length}/${Object.keys(p.checklist||{}).length} itens completos</p></div>${docBadge(p.docs)}</div>`).join('')}</div></div></div>`;
}
function renderComunicacoes(){
  const headers=['Destinatário','Tipo','Mensagem','Estado','Data','Prioridade','Ações'];
  const rows=state.comunicacoes.map(c=>[esc(c.dest),esc(c.tipo),esc(c.msg),commBadge(c.estado),esc(c.data),priorityBadge(c.prio),actions([['Lida',()=>setCommunication(c.id,'lida')],['Respondida',()=>setCommunication(c.id,'respondida')],['Arquivar',()=>setCommunication(c.id,'arquivada')],['Detalhe',()=>showCommunicationDetail(c.id)]])]);
  return `<div class="card"><div class="panel"><h3>Comunicações internas</h3><button class="mini" data-action-local="send-message">Enviar aviso</button></div>${table(headers, rows)}${cards(state.comunicacoes.map(c=>({title:c.dest,sub:c.tipo,rows:[['Mensagem',c.msg],['Estado',c.estado],['Prioridade',c.prio],['Data',c.data]],actions:actions([['Lida',()=>setCommunication(c.id,'lida')],['Respondida',()=>setCommunication(c.id,'respondida')],['Detalhe',()=>showCommunicationDetail(c.id)]])})))}</div>`;
}
function renderAuditoria(){
  const headers=['Data e hora','Utilizador','Ação','Entidade afetada','Estado anterior','Novo estado','Justificação','Origem'];
  const rows=state.auditoria.map(a=>[esc(a.data),esc(a.user),`<strong>${esc(a.acao)}</strong>`,esc(a.ent),esc(a.ant),esc(a.novo),esc(a.just),esc(a.origem)]);
  return `<div class="card"><div class="panel"><h3>Registo de auditoria</h3><button class="mini" data-export="auditoria">Exportar CSV</button></div>${table(headers, rows)}</div>`;
}
function renderPerfis(){
  const profiles=[
    ['Administrador da Federação','Acesso total a configuração, utilizadores, dados, documentos, auditoria e governação.'],
    ['Conselho de Arbitragem','Valida graduações, analisa conflitos, aprova nomeações críticas e decide impedimentos.'],
    ['Responsável Operacional de Arbitragem','Cria provas, prepara nomeações, acompanha mapas, relatórios, documentos e comunicações.'],
    ['Árbitro','Consulta nomeações, aceita ou recusa, declara disponibilidade, conflitos e envia relatórios.'],
    ['Clube Organizador','Consulta equipa nomeada, documentos obrigatórios e estado operacional da prova.'],
    ['Consulta/Auditoria','Acesso de leitura a histórico, documentos autorizados e rastreabilidade.']
  ];
  return `<div class="grid three-col">${profiles.map(p=>`<div class="card"><h3>${p[0]}</h3><p class="offline-note">${p[1]}</p>${badge('info','Perfil previsto')}</div>`).join('')}</div><div class="card" style="margin-top:16px"><div class="panel"><h3>Matriz de permissões</h3></div>${table(['Perfil','Nomeações','Conflitos','Credenciação','Relatórios','Documentos','Auditoria'], profiles.map((p,i)=>[p[0], i<3?'Editar':'Consultar', i===1?'Decidir':i===3?'Declarar':'Consultar', i<2?'Validar':'Consultar', i===3?'Enviar':i<3?'Gerir':'Consultar', i<3?'Gerir':'Consultar', i===0||i===5?'Consultar':'Limitada']))}</div>`;
}

function afterRenderEvents(){
  document.querySelectorAll('[data-goto]').forEach(el => { el.onclick = () => navigate(el.dataset.goto); });
  document.querySelectorAll('[data-action-local]').forEach(el => { el.onclick = () => handleLocalAction(el.dataset.actionLocal); });
  document.querySelectorAll('[data-export]').forEach(el => { el.onclick = () => exportCSV(el.dataset.export); });
  document.querySelectorAll('[data-appoint-fn]').forEach(el => { el.onclick = () => openAppointmentForm({funcao:el.dataset.appointFn}); });
  document.querySelectorAll('[data-appoint-arb]').forEach(el => { el.onclick = () => openAppointmentForm({arb:Number(el.dataset.appointArb)}); });
  const picker=document.getElementById('selectedRacePicker'); if(picker) picker.addEventListener('change', e=>{ state.ui.selectedRace=Number(e.target.value); saveState(); renderAll(); });
}
const originalSafeRender=safeRender;
safeRender=function(id,fn){ originalSafeRender(id,fn); setTimeout(afterRenderEvents,0); };
function handleLocalAction(action){
  const map={'new-appointment':()=>openAppointmentForm(),'new-conflict':()=>openConflictForm(),'new-document':()=>openDocumentForm(),'send-message':sendMessage,'missing-maps':generateMissingMapMessages};
  (map[action]||(()=>showToast('Ação disponível noutro módulo.')))();
}

function openModal(title, body, actionsHtml=''){
  const safeTitle = String(title||'Informação').trim();
  const safeBody = String(body||'').trim();
  const root = document.getElementById('modalRoot');
  const bodyEl = document.getElementById('modalBody');
  const actionsEl = document.getElementById('modalActions');
  if(!root || !bodyEl || !actionsEl){ showToast('Janela indisponível neste momento.'); return; }
  if(!safeBody){
    showToast('Não existe conteúdo disponível para esta ação.');
    console.warn('openModal chamado sem conteúdo:', safeTitle);
    return;
  }
  setText('modalTitle', safeTitle);
  bodyEl.innerHTML = safeBody;
  actionsEl.innerHTML = actionsHtml || '<button class="btn btn-primary" type="button" data-close-modal>Fechar</button>';
  root.hidden = false;
  root.setAttribute('aria-hidden','false');
  document.body.classList.add('modal-open');
  actionsEl.querySelectorAll('[data-close-modal]').forEach(b=>b.addEventListener('click', closeModal));
  actionsEl.querySelectorAll('[data-form-submit]').forEach(b=>b.addEventListener('click', () => submitForm(b.dataset.formSubmit)));
}
function closeModal(){
  const m=document.getElementById('modalRoot');
  if(!m) return;
  m.hidden=true;
  m.setAttribute('aria-hidden','true');
  document.body.classList.remove('modal-open');
}

function openRefereeForm(id){ const a=id?getRef(id):{}; openModal(id?'Editar árbitro':'Novo árbitro', `<form id="refForm" class="form-grid">${hidden('id',a.id||'')}${field('nome','Nome',a.nome||'',true)}${field('cod','Código interno',a.cod||`ARB-${nextId(state.arbitros)+150}`,true)}${select('cat','Categoria',a.cat||'Juiz',['Oficial de Regata','Juiz','Juiz-Árbitro','Medidor','Classificador Funcional'])}${select('grad','Graduação',a.grad||'Regional/Grau 1',['Clube','Regional/Grau 1','Nacional/Grau 2','Nacional'])}${select('lic','Licença Desportiva de Árbitro',a.lic||'Válida',['Válida','Suspensa','Expirada','Por validar'])}${field('valid','Validade da licença',a.valid||'2027-01-01',true,'date')}${field('reg','Região',a.reg||'',true)}${field('contacto','Contacto de teste',a.contacto||'',true)}${select('disp','Disponibilidade',a.disp||'Disponível',['Disponível','Indisponível','Condicionado','Por confirmar'])}${field('form','Formação recente',a.form||'')}${field('seminarios','Seminários',a.seminarios||'')}${field('provas','Provas realizadas',a.provas||0,true,'number')}${field('aval','Avaliações positivas',a.aval||0,true,'number')}${field('relAtraso','Relatórios em atraso',a.relAtraso||0,true,'number')}${select('estado','Estado operacional',a.estado||'Ativo',['Ativo','Condicionado','Suspenso','Inativo'])}<div class="field full"><label>Observações internas</label><textarea class="textarea" name="obs" rows="4">${esc(a.obs||'')}</textarea></div></form>`, `<button class="btn" data-close-modal>Cancelar</button><button class="btn btn-primary" data-form-submit="refForm">Guardar</button>`); }
function openRaceForm(id){ const p=id?getRace(id):{}; openModal(id?'Editar prova':'Nova prova', `<form id="raceForm" class="form-grid">${hidden('id',p.id||'')}${field('nome','Nome da prova',p.nome||'',true)}${select('tipo','Tipo',p.tipo||'Campeonato Regional',['Campeonato Nacional','Campeonato de Portugal','Prova de Apuramento Nacional','Taça de Portugal','Campeonato Regional','Prova de Clube','Prova Internacional','Outra'])}${select('amb','Âmbito',p.amb||'Regional',['Clube','Regional','Nacional','Internacional'])}${field('ini','Data início',p.ini||'2026-06-01',true,'date')}${field('fim','Data fim',p.fim||'2026-06-02',true,'date')}${field('local','Local',p.local||'',true)}${field('clube','Clube/autoridade organizadora',p.clube||'',true)}${field('classes','Classes',p.classes||'',true)}${field('barcos','N.º previsto de barcos',p.barcos||30,true,'number')}${field('campos','Campos de regata',p.campos||'')}${select('estado','Estado da prova',p.estado||'Planeada',['Planeada','Em preparação','Nomeações pendentes','Equipa completa','Em curso','Concluída','Encerrada'])}${select('docs','Estado documental',p.docs||'Incompleto',['Incompleto','Aguardando validação','Validado','Arquivado'])}${select('relatorio','Relatório final',p.relatorio||'Pendente',['Pendente','Entregue','Em atraso','Validado','Devolvido'])}</form>`, `<button class="btn" data-close-modal>Cancelar</button><button class="btn btn-primary" data-form-submit="raceForm">Guardar</button>`); }
function openAppointmentForm(opts={}){ const p=getRace(opts.prova||state.ui.selectedRace)||state.provas[0], a=getRef(opts.arb)||state.arbitros[0]; if(!p||!a) return showToast('É necessário existir pelo menos uma prova e um árbitro.'); const risk=appointmentRisk(a,p,opts.funcao||'Juiz'); openModal('Nova nomeação', `<form id="appointmentForm" class="form-grid">${select('prova','Prova',p.id,state.provas.map(x=>[x.id,`${x.nome} · ${fmtDate(x.ini)}`]))}${select('arb','Árbitro',a.id,state.arbitros.map(x=>[x.id,`${x.nome} · ${x.cat} · ${x.grad}`]))}${select('funcao','Função',opts.funcao||'Juiz',['Presidente da Comissão de Regata','Oficial de Regata','Presidente da Comissão de Protestos','Juiz','Juiz-Árbitro','Medidor','Classificador Funcional','Apoio técnico','Secretariado de prova','Outra função'])}${select('estado','Estado','Rascunho',['Rascunho','Enviada','Pendente de resposta','Aceite','Recusada','Substituída','Cancelada','Concluída'])}<div class="field full"><label>Justificação / observações</label><textarea class="textarea" name="motivo" rows="3" placeholder="Obrigatória em alertas críticos."></textarea></div></form><div class="risk-list" style="margin-top:14px">${riskRows(risk)}</div>`, `<button class="btn" data-close-modal>Cancelar</button><button class="btn btn-primary" data-form-submit="appointmentForm">Guardar nomeação</button>`); }
function openAvailabilityForm(input={}){ const d=typeof input==='object'&&input.id?input:{}; const arbId=input.arb||d.arb||state.arbitros[0]?.id; openModal(d.id?'Editar disponibilidade':'Registar disponibilidade', `<form id="availabilityForm" class="form-grid">${hidden('id',d.id||'')}${select('arb','Árbitro',arbId,state.arbitros.map(a=>[a.id,a.nome]))}${field('data','Data',d.data||TODAY,true,'date')}${select('prova','Prova',d.prova||0,[[0,'Disponibilidade geral'],...state.provas.map(p=>[p.id,p.nome])])}${select('estado','Estado',d.estado||'Disponível',['Disponível','Indisponível','Condicionado','Por confirmar'])}<div class="field full"><label>Observações</label><textarea class="textarea" name="obs" rows="3">${esc(d.obs||'')}</textarea></div></form>`, `<button class="btn" data-close-modal>Cancelar</button><button class="btn btn-primary" data-form-submit="availabilityForm">Guardar</button>`); }
function openReportForm(){ openModal('Registar relatório', `<form id="reportForm" class="form-grid">${select('prova','Prova',state.provas[0]?.id,state.provas.map(p=>[p.id,p.nome]))}${select('arb','Árbitro responsável',state.arbitros[0]?.id,state.arbitros.map(a=>[a.id,a.nome]))}${select('estado','Estado','Entregue',['Pendente','Entregue','Em atraso','Validado','Devolvido'])}<div class="field full"><label>Observações</label><textarea class="textarea" name="obs" rows="4">Relatório registado na plataforma operacional.</textarea></div></form>`, `<button class="btn" data-close-modal>Cancelar</button><button class="btn btn-primary" data-form-submit="reportForm">Guardar</button>`); }
function openConflictForm(opts={}){ openModal('Registar conflito de interesse', `<form id="conflictForm" class="form-grid">${select('arb','Árbitro',opts.arb||state.arbitros[0]?.id,state.arbitros.map(a=>[a.id,a.nome]))}${select('prova','Prova',opts.prova||state.ui.selectedRace,state.provas.map(p=>[p.id,p.nome]))}${select('tipo','Tipo','ligação a clube',['ligação a clube','ligação a atleta','ligação a equipa','relação familiar','relação profissional','interesse financeiro','participação anterior relevante','outro'])}${select('estado','Estado','declarado',['declarado','em análise','sem impedimento','impedimento parcial','impedimento total','resolvido','arquivado'])}${field('responsavel','Responsável pela decisão','Conselho de Arbitragem')}<div class="field full"><label>Descrição</label><textarea class="textarea" name="descricao" rows="3"></textarea></div><div class="field full"><label>Decisão</label><textarea class="textarea" name="decisao" rows="3">A aguardar análise.</textarea></div><div class="field full"><label>Observações</label><textarea class="textarea" name="obs" rows="3"></textarea></div></form>`, `<button class="btn" data-close-modal>Cancelar</button><button class="btn btn-primary" data-form-submit="conflictForm">Guardar</button>`); }
function openDocumentForm(opts={}){ openModal('Adicionar documento', `<form id="documentForm" class="form-grid">${field('nome','Nome do documento','Novo documento.pdf',true)}${select('tipo','Tipo','relatórios',['regulamentos','regras de regata','prescrições','avisos de regata','instruções de regata','relatórios','mapas de disponibilidade','atas','decisões','protestos','formulários','avaliações','certificados','outros'])}${select('prova','Prova associada',opts.prova||0,[[0,'Sem prova'],...state.provas.map(p=>[p.id,p.nome])])}${select('arb','Árbitro associado',opts.arb||0,[[0,'Sem árbitro'],...state.arbitros.map(a=>[a.id,a.nome])])}${field('versao','Versão','1.0')}${select('estado','Estado','por validar',['válido','em falta','por validar','rejeitado','arquivado'])}</form>`, `<button class="btn" data-close-modal>Cancelar</button><button class="btn btn-primary" data-form-submit="documentForm">Guardar</button>`); }

function submitForm(id){
  const f=formData(id);
  if(id==='refForm') return saveReferee(f);
  if(id==='raceForm') return saveRace(f);
  if(id==='appointmentForm') return saveAppointment(f);
  if(id==='availabilityForm') return saveAvailability(f);
  if(id==='reportForm') return saveReport(f);
  if(id==='conflictForm') return saveConflict(f);
  if(id==='documentForm') return saveDocument(f);
  showToast('Formulário não reconhecido.');
}
function saveReferee(f){ mutate(()=>{ const id=Number(f.id), old=id?getRef(id):null; const obj={id:id||nextId(state.arbitros),cod:f.cod,nome:f.nome,cat:f.cat,grad:f.grad,lic:f.lic,valid:f.valid,reg:f.reg,contacto:f.contacto,disp:f.disp,form:f.form,seminarios:f.seminarios,provas:Number(f.provas||0),aval:Number(f.aval||0),relAtraso:Number(f.relAtraso||0),estado:f.estado,obs:f.obs,docs:old?.docs||[]}; if(old) Object.assign(old,obj); else state.arbitros.push(obj); addAudit(id?'Dados de árbitro alterados':'Árbitro criado', obj.nome, id?'Ficha anterior':'Inexistente', obj.estado, 'Registo administrativo', 'Módulo Árbitros'); state.ui.selectedRef=obj.id; }); closeModal(); showToast('Árbitro guardado.'); }
function saveRace(f){ mutate(()=>{ const id=Number(f.id), old=id?getRace(id):null; const obj={id:id||nextId(state.provas),nome:f.nome,tipo:f.tipo,amb:f.amb,ini:f.ini,fim:f.fim,local:f.local,clube:f.clube,classes:f.classes,barcos:Number(f.barcos||0),campos:f.campos,estado:f.estado,docs:f.docs,relatorio:f.relatorio,necessidades:old?.necessidades||{'Oficial de Regata':1,'Juiz':1},checklist:old?.checklist||{'Anúncio de Regata':false,'Instruções de Regata':false,'Resultados':false,'Protestos':false,'Decisões':false,'Aditamentos':false,'Relatório de prova':false,'Mapa de nomeações':false,'Documentos de medição':false}}; if(old) Object.assign(old,obj); else state.provas.push(obj); addAudit(id?'Prova alterada':'Prova criada', obj.nome, id?'Dados anteriores':'Inexistente', obj.estado, 'Gestão de calendário', 'Módulo Provas'); state.ui.selectedRace=obj.id; }); closeModal(); showToast('Prova guardada.'); }
function saveAppointment(f){ const p=getRace(Number(f.prova)), a=getRef(Number(f.arb)), risk=appointmentRisk(a,p,f.funcao); if(risk.block.length) return showToast(`Nomeação bloqueada: ${risk.block.join(', ')}.`); if(risk.critical.length && !String(f.motivo||'').trim()) return showToast('Justificação obrigatória para alertas críticos.'); mutate(()=>{ state.nomeacoes.push({id:nextId(state.nomeacoes),prova:Number(f.prova),arb:Number(f.arb),funcao:f.funcao,estado:f.estado,motivo:f.motivo||risk.moderate.concat(risk.critical).join('; ')}); addAudit('Árbitro nomeado', p.nome, 'Sem nomeação', `${a.nome} · ${f.funcao} · ${f.estado}`, f.motivo||'Validação operacional', 'Módulo Nomeações'); }); closeModal(); showToast(risk.critical.length?'Nomeação guardada com alertas críticos.':'Nomeação guardada.'); }
function saveAvailability(f){ mutate(()=>{ const id=Number(f.id), old=id?state.disponibilidades.find(d=>d.id===id):null; const obj={id:id||nextId(state.disponibilidades),arb:Number(f.arb),data:f.data,prova:Number(f.prova)||null,estado:f.estado,obs:f.obs}; if(old) Object.assign(old,obj); else state.disponibilidades.push(obj); const a=getRef(obj.arb); if(a) a.disp=obj.estado; addAudit('Disponibilidade registada', a?.nome||'Árbitro', old?.estado||'Sem registo', obj.estado, obj.obs||'Mapa de disponibilidade', 'Módulo Disponibilidades'); }); closeModal(); showToast('Disponibilidade guardada.'); }
function saveReport(f){ const p=getRace(Number(f.prova)); mutate(()=>{ const prazo=addDays(p.fim,5); state.relatorios.unshift({id:nextId(state.relatorios),prova:Number(f.prova),arb:Number(f.arb),prazo,estado:f.estado,obs:f.obs}); p.relatorio=f.estado; addAudit('Relatório entregue', p.nome, 'Pendente', f.estado, f.obs, 'Módulo Relatórios'); }); closeModal(); showToast('Relatório registado.'); }
function saveConflict(f){ mutate(()=>{ state.conflitos.unshift({id:nextId(state.conflitos),arb:Number(f.arb),prova:Number(f.prova),tipo:f.tipo,estado:f.estado,descricao:f.descricao,decisao:f.decisao,responsavel:f.responsavel,obs:f.obs}); addAudit('Conflito de interesse declarado', getRace(Number(f.prova))?.nome||'Prova', 'Sem registo', f.estado, f.descricao||'Declaração registada', 'Módulo Conflitos'); }); closeModal(); showToast('Conflito registado.'); }
function saveDocument(f){ mutate(()=>{ state.documentos.unshift({id:nextId(state.documentos),nome:f.nome,tipo:f.tipo,prova:Number(f.prova)||null,arb:Number(f.arb)||null,versao:f.versao||'1.0',data:TODAY,estado:f.estado}); addAudit('Documento adicionado', f.nome, 'Inexistente', f.estado, 'Registo documental', 'Módulo Documentos'); }); closeModal(); showToast('Documento guardado.'); }

function selectProfile(id){ state.ui.selectedRef=id; saveState(); renderAll(); navigate('perfil'); }
function markUnavailable(id){ const a=getRef(id); mutate(()=>{ const old=a.disp; a.disp='Indisponível'; addAudit('Disponibilidade alterada', a.nome, old, 'Indisponível', 'Atualização operacional', 'Módulo Árbitros'); }); showToast(`${a.nome} marcado como indisponível.`); }
function showRefHistory(id){ const a=getRef(id); openModal(`Histórico — ${a.nome}`, `<div class="list">${timelineForRef(a).map(t=>`<div class="item"><div><strong>${esc(t.title)}</strong><p>${esc(t.text)}</p></div><small>${esc(t.date)}</small></div>`).join('')}</div>`); }
function showRaceHistory(id){ const p=getRace(id); const rows=state.auditoria.filter(a=>a.ent.includes(p.nome)||a.ent===p.nome); openModal(`Histórico — ${p.nome}`, rows.length?`<div class="list">${rows.map(a=>`<div class="item"><div><strong>${esc(a.acao)}</strong><p>${esc(a.ant)} → ${esc(a.novo)} · ${esc(a.just)}</p></div><small>${esc(a.data)}</small></div>`).join('')}</div>`:empty('Sem histórico específico para esta prova.')); }
function showRaceDetail(id){ const p=getRace(id); openModal(`Detalhe da prova — ${p.nome}`, `<div class="grid two-col"><div class="profile-box">${metric('Tipo',p.tipo)}${metric('Âmbito',p.amb)}${metric('Datas',`${fmtDate(p.ini)} — ${fmtDate(p.fim)}`)}${metric('Local',p.local)}${metric('Organização',p.clube)}${metric('Classes',p.classes)}${metric('Barcos previstos',p.barcos)}${metric('Campos de regata',p.campos)}${metric('Equipa',`${appointedCount(p.id)}/${requiredCount(p.id)}`)}</div><div class="card flat"><h4>Checklist documental</h4><div class="list">${Object.entries(p.checklist||{}).map(([k,v])=>`<div class="item"><div><strong>${esc(k)}</strong></div>${badge(v?'ok':'warn',v?'Completo':'Pendente')}</div>`).join('')}</div></div></div>`, `<button class="btn" data-close-modal>Fechar</button><button class="btn btn-primary" data-close-modal data-race-appoint="${p.id}">Gerir nomeações</button>`); document.querySelector('[data-race-appoint]')?.addEventListener('click',()=>{state.ui.selectedRace=id;saveState();renderAll();navigate('nomeacoes');}); }
function showAvailabilityDetail(id){ const d=state.disponibilidades.find(x=>x.id===id); openModal('Detalhe de disponibilidade', `<div class="profile-box">${metric('Árbitro',getRef(d.arb)?.nome)}${metric('Data',fmtDate(d.data))}${metric('Prova',getRace(d.prova)?.nome||'Disponibilidade geral')}${metric('Estado',d.estado)}${metric('Observações',d.obs||'—')}</div>`); }
function showCredentialDetail(id){ const a=getRef(id); openModal(`Credenciação — ${a.nome}`, `<div class="profile-box">${metric('Licença',a.lic)}${metric('Validade',fmtDate(a.valid))}${metric('Categoria',a.cat)}${metric('Graduação',a.grad)}${metric('Formação',a.form)}${metric('Seminários',a.seminarios)}${metric('Avaliações',a.aval)}${metric('Requisitos',requirements(a))}${metric('Estado',credText(a))}</div>`); }
function showReportDetail(id){ const r=state.relatorios.find(x=>x.id===id); openModal('Detalhe do relatório', `<div class="profile-box">${metric('Prova',getRace(r.prova)?.nome)}${metric('Árbitro',getRef(r.arb)?.nome)}${metric('Prazo',fmtDate(r.prazo))}${metric('Estado',isLateReport(r)?'Em atraso':r.estado)}${metric('Observações',r.obs)}</div>`); }
function showConflictDetail(id){ const c=state.conflitos.find(x=>x.id===id); openModal('Detalhe do conflito de interesse', `<div class="profile-box">${metric('Árbitro',getRef(c.arb)?.nome)}${metric('Prova',getRace(c.prova)?.nome)}${metric('Tipo',c.tipo)}${metric('Estado',c.estado)}${metric('Descrição',c.descricao)}${metric('Decisão',c.decisao)}${metric('Responsável',c.responsavel)}${metric('Impacto',conflictImpact(c.estado))}</div>`); }
function showDocumentDetail(id){ const d=state.documentos.find(x=>x.id===id); openModal('Detalhe documental', `<div class="profile-box">${metric('Nome',d.nome)}${metric('Tipo',d.tipo)}${metric('Prova',getRace(d.prova)?.nome||'—')}${metric('Árbitro',getRef(d.arb)?.nome||'—')}${metric('Versão',d.versao)}${metric('Data',fmtDate(d.data))}${metric('Estado',d.estado)}</div>`); }
function showCommunicationDetail(id){ const c=state.comunicacoes.find(x=>x.id===id); openModal('Detalhe da comunicação', `<div class="profile-box">${metric('Destinatário',c.dest)}${metric('Tipo',c.tipo)}${metric('Estado',c.estado)}${metric('Prioridade',c.prio)}${metric('Data',c.data)}${metric('Mensagem',c.msg)}</div>`); }

function setAppointmentStatus(id,status,motivo=''){ mutate(()=>{ const n=state.nomeacoes.find(x=>x.id===id), old=n.estado; n.estado=status; if(motivo) n.motivo=motivo; addAudit(`Nomeação ${status.toLowerCase()}`, getRace(n.prova)?.nome||'Prova', old, status, motivo||'Alteração de estado', 'Módulo Nomeações'); }); showToast(`Nomeação marcada como ${status}.`); }
function promptAppointmentStatus(id,status){ const motivo=prompt(`Motivo para ${status.toLowerCase()}:`) || `Estado alterado para ${status}.`; setAppointmentStatus(id,status,motivo); }
function deliverReport(id){ setReportStatus(id,'Entregue'); }
function setReportStatus(id,status){ mutate(()=>{ const r=state.relatorios.find(x=>x.id===id), old=r.estado; r.estado=status; const p=getRace(r.prova); if(p) p.relatorio=status; addAudit('Estado de relatório alterado', p?.nome||'Prova', old, status, 'Gestão pós-prova', 'Módulo Relatórios'); }); showToast(`Relatório marcado como ${status}.`); }
function promptReportReturn(id){ const motivo=prompt('Motivo da devolução:')||'Relatório devolvido para correção.'; mutate(()=>{ const r=state.relatorios.find(x=>x.id===id), old=r.estado; r.estado='Devolvido'; r.obs=motivo; addAudit('Relatório devolvido', getRace(r.prova)?.nome||'Prova', old, 'Devolvido', motivo, 'Módulo Relatórios'); }); showToast('Relatório devolvido.'); }
function decideConflict(id,status){ mutate(()=>{ const c=state.conflitos.find(x=>x.id===id), old=c.estado; c.estado=status; c.decisao=`Decisão registada: ${status}.`; addAudit('Decisão de conflito registada', getRace(c.prova)?.nome||'Prova', old, status, c.decisao, 'Módulo Conflitos'); }); showToast('Decisão de conflito registada.'); }
function setDocumentStatus(id,status){ mutate(()=>{ const d=state.documentos.find(x=>x.id===id), old=d.estado; d.estado=status; addAudit(`Documento ${status}`, d.nome, old, status, 'Gestão documental', 'Módulo Documentos'); }); showToast(`Documento marcado como ${status}.`); }
function removeDocument(id){ if(!confirm('Remover documento do registo local?')) return; mutate(()=>{ const i=state.documentos.findIndex(x=>x.id===id); if(i>=0){ const d=state.documentos.splice(i,1)[0]; addAudit('Documento removido', d.nome, d.estado, 'Removido', 'Remoção local', 'Módulo Documentos'); }}); showToast('Documento removido.'); }
function setCommunication(id,status){ mutate(()=>{ const c=state.comunicacoes.find(x=>x.id===id), old=c.estado; c.estado=status; addAudit('Comunicação atualizada', c.tipo, old, status, c.dest, 'Módulo Comunicações'); }); showToast(`Comunicação marcada como ${status}.`); }
function sendMessage(){ mutate(()=>{ state.comunicacoes.unshift({id:nextId(state.comunicacoes),dest:'Árbitros nomeados',tipo:'pedido de confirmação',estado:'enviada',data:nowStamp(),prio:'alta',msg:'Solicitada confirmação das nomeações pendentes.'}); addAudit('Comunicação enviada','Nomeações pendentes','Pendente','Enviada','Pedido operacional','Módulo Comunicações'); }); showToast('Comunicação registada.'); }
function generateMissingMapMessages(){ const missing=state.arbitros.filter(a=>!state.disponibilidades.some(d=>d.arb===a.id)); mutate(()=>{ missing.forEach(a=>state.comunicacoes.unshift({id:nextId(state.comunicacoes),dest:a.nome,tipo:'mapa de disponibilidade em falta',estado:'pendente',data:nowStamp(),prio:'alta',msg:'Enviar mapa de disponibilidade mensal.'})); addAudit('Alertas de mapa gerados','Disponibilidades','Sem alerta',`${missing.length} pedidos`,'Controlo operacional','Módulo Disponibilidades'); }); showToast(`${missing.length} pedido(s) de mapa registados.`); }
function resetData(){ if(!confirm('Repor dados de teste neste dispositivo?')) return; state=defaultData(); saveState(); renderAll(); navigate('dashboard'); showToast('Dados de teste repostos.'); }

function appointmentRisk(a,p,funcao){
  const risk={block:[],critical:[],moderate:[]}; if(!a||!p){risk.block.push('Dados insuficientes'); return risk;}
  if(['Expirada','Suspensa'].includes(a.lic)) risk.block.push(`Licença ${a.lic.toLowerCase()}`);
  if(['Suspenso','Inativo'].includes(a.estado)) risk.block.push(`Árbitro ${a.estado.toLowerCase()}`);
  if(hasUnavailable(a.id,p)) risk.block.push('Indisponível na data da prova');
  if(state.conflitos.some(c=>c.arb===a.id&&c.prova===p.id&&c.estado==='impedimento total')) risk.block.push('Conflito com impedimento total');
  if(a.lic==='Por validar') risk.critical.push('Licença por validar');
  if(state.conflitos.some(c=>c.arb===a.id&&c.prova===p.id&&['declarado','em análise','impedimento parcial'].includes(c.estado))) risk.critical.push('Conflito pendente ou parcial');
  if(a.relAtraso>0) risk.critical.push('Relatório anterior em atraso');
  if(funcao && funcao.includes('Presidente') && !['Nacional','Nacional/Grau 2'].includes(a.grad)) risk.critical.push('Graduação possivelmente insuficiente');
  if(funcao && !categoryFits(a.cat,funcao)) risk.critical.push('Nomeação fora da categoria principal');
  if(a.disp==='Por confirmar'||a.disp==='Condicionado') risk.moderate.push(`Disponibilidade ${a.disp.toLowerCase()}`);
  if(a.lic==='Válida' && daysUntil(a.valid)<=60) risk.moderate.push('Licença a expirar brevemente');
  if(a.provas>=45) risk.moderate.push('Elevada carga de provas recentes');
  if(!String(a.reg).toLowerCase().includes(regionHint(p.local))) risk.moderate.push('Localização potencialmente desfavorável');
  if(state.nomeacoes.some(n=>n.arb===a.id&&n.prova!==p.id&&['Aceite','Enviada','Pendente de resposta'].includes(n.estado)&&overlap(getRace(n.prova),p))) risk.critical.push('Sobreposição com outra prova');
  const currentForFunction=state.nomeacoes.filter(n=>n.prova===p.id&&n.funcao===funcao&&!['Cancelada','Recusada'].includes(n.estado)).length;
  if(funcao && p.necessidades?.[funcao] && currentForFunction>=p.necessidades[funcao]) risk.moderate.push('Necessidade mínima da função já preenchida');
  return risk;
}
function hasUnavailable(arbId,p){ return state.disponibilidades.some(d=>d.arb===arbId && d.estado==='Indisponível' && d.data>=p.ini && d.data<=p.fim); }
function categoryFits(cat,fn){ if(!fn) return true; const map={'Oficial de Regata':['Presidente da Comissão de Regata','Oficial de Regata','Secretariado de prova','Apoio técnico'],'Juiz':['Presidente da Comissão de Protestos','Juiz'],'Juiz-Árbitro':['Juiz-Árbitro','Juiz','Presidente da Comissão de Protestos'],'Medidor':['Medidor'],'Classificador Funcional':['Classificador Funcional']}; return (map[cat]||[]).some(x=>fn.includes(x)) || fn==='Outra função'; }
function riskRows(r){ const rows=[...r.block.map(x=>['block','Bloqueio',x]),...r.critical.map(x=>['critical','Alerta crítico',x]),...r.moderate.map(x=>['moderate','Alerta moderado',x])]; return rows.length?rows.map(([c,t,x])=>`<div class="risk-row ${c}"><strong>${t}</strong><br><span>${esc(x)}</span></div>`).join(''):`<div class="risk-row"><strong>Sem risco</strong><br><span>Validações operacionais sem impedimentos.</span></div>`; }
function riskMessages(r){ return [...r.block.map(x=>badge('bad',x)),...r.critical.map(x=>badge('warn',x)),...r.moderate.map(x=>badge('info',x))]; }
function riskBadge(r){ return r.block.length?badge('bad','Risco bloqueante'):r.critical.length?badge('warn','Risco crítico'):r.moderate.length?badge('info','Risco moderado'):badge('ok','Sem risco'); }

function table(headers, rows){ if(!rows.length) return `<div class="desktop-table">${empty('Sem registos disponíveis.')}</div>`; return `<div class="table-wrap desktop-table"><table><thead><tr>${headers.map(h=>`<th>${esc(h)}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map(c=>`<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`; }
function cards(items){ return `<div class="mobile-cards">${items.length?items.map(c=>`<article class="entity-card"><h4>${esc(c.title)}</h4><p class="row-sub">${esc(c.sub||'')}</p>${(c.rows||[]).map(r=>`<div class="card-row"><span>${esc(r[0])}</span><strong>${esc(r[1])}</strong></div>`).join('')}<div class="row-actions">${c.actions||''}</div></article>`).join(''):empty('Sem registos disponíveis.')}</div>`; }
function filterBar(key,f,defs,placeholder){ return `<div class="toolbar"><div class="filters"><input class="input" data-filter-key="${key}" data-filter-field="q" value="${escAttr(f.q||'')}" placeholder="${escAttr(placeholder)}">${defs.map(([field,label,opts])=>`<select class="select" data-filter-key="${key}" data-filter-field="${field}"><option value="">${esc(label)}</option>${opts.map(o=>`<option value="${escAttr(o)}" ${(f[field]||'')===o?'selected':''}>${esc(o)}</option>`).join('')}</select>`).join('')}</div><button class="btn" data-clear-filter="${key}">Limpar filtros</button></div>`; }
function getFilters(key){ state.ui.filters ||= {}; state.ui.filters[key] ||= {q:''}; setTimeout(()=>bindFilters(key),0); return state.ui.filters[key]; }
function bindFilters(){ document.querySelectorAll('[data-filter-key]').forEach(el=>{ el.oninput=el.onchange=()=>{ const k=el.dataset.filterKey, field=el.dataset.filterField; state.ui.filters[k] ||= {}; state.ui.filters[k][field]=el.value; saveState(); renderAll(); }; }); document.querySelectorAll('[data-clear-filter]').forEach(btn=>btn.onclick=()=>{ state.ui.filters[btn.dataset.clearFilter]={q:''}; saveState(); renderAll(); }); }
function actions(items){ const id='a'+Math.random().toString(36).slice(2); setTimeout(()=>{ items.forEach((it,i)=>{ const el=document.querySelector(`[data-action-id="${id}-${i}"]`); if(el) el.onclick=it[1]; }); },0); return items.map((it,i)=>`<button class="mini" type="button" data-action-id="${id}-${i}">${esc(it[0])}</button>`).join(''); }
function metric(k,v){ return `<div class="metric"><span>${esc(k)}</span><span>${esc(v??'—')}</span></div>`; }
function empty(msg){ return `<div class="empty">${esc(msg)}</div>`; }
function field(n,l,v='',req=false,type='text'){ return `<div class="field"><label>${esc(l)}</label><input class="input" name="${escAttr(n)}" type="${type}" value="${escAttr(v)}" ${req?'required':''}></div>`; }
function hidden(n,v){ return `<input type="hidden" name="${escAttr(n)}" value="${escAttr(v)}">`; }
function select(n,l,v,opts){ return `<div class="field"><label>${esc(l)}</label><select class="select" name="${escAttr(n)}">${opts.map(o=>Array.isArray(o)?`<option value="${escAttr(o[0])}" ${String(o[0])===String(v)?'selected':''}>${esc(o[1])}</option>`:`<option value="${escAttr(o)}" ${o===v?'selected':''}>${esc(o)}</option>`).join('')}</select></div>`; }
function formData(id){ const form=document.getElementById(id); return Object.fromEntries(new FormData(form).entries()); }

function badge(cls,text){ return `<span class="badge ${cls}">${esc(text)}</span>`; }
function licenseBadge(v){ return badge(v==='Válida'?'ok':v==='Por validar'?'warn':'bad',v); }
function availabilityBadge(v){ return badge(v==='Disponível'?'ok':v==='Por confirmar'||v==='Condicionado'?'warn':'bad',v); }
function stateBadge(v){ return badge(v==='Ativo'?'ok':v==='Condicionado'?'warn':v==='Suspenso'?'bad':'neutral',v); }
function statusBadge(v){ return badge(['Equipa completa','Concluída','Encerrada'].includes(v)?'ok':['Nomeações pendentes','Em preparação'].includes(v)?'warn':v==='Em curso'?'info':'neutral',v); }
function docBadge(v){ return badge(['Validado','válido'].includes(v)?'ok':['Incompleto','em falta','rejeitado'].includes(v)?'bad':['Arquivado','arquivado'].includes(v)?'neutral':'warn',v); }
function reportBadge(v){ return badge(['Entregue','Validado'].includes(v)?'ok':['Em atraso','Devolvido'].includes(v)?'bad':'warn',v); }
function nomBadge(v){ return badge(['Aceite','Concluída'].includes(v)?'ok':['Recusada','Cancelada'].includes(v)?'bad':v==='Substituída'?'neutral':'warn',v); }
function conflictBadge(v){ return badge(v==='sem impedimento'||v==='resolvido'?'ok':v==='impedimento total'?'bad':['em análise','impedimento parcial','declarado'].includes(v)?'warn':'neutral',v); }
function commBadge(v){ return badge(['respondida','lida'].includes(v)?'ok':v==='pendente'?'warn':v==='arquivada'?'neutral':'info',v); }
function priorityBadge(v){ return badge(v==='crítica'?'bad':v==='alta'?'warn':'info',v); }
function credBadge(a){ const t=credText(a); return badge(t==='Regular'?'ok':t==='Suspenso'?'bad':t==='Incompleto'?'bad':'warn',t); }
function credText(a){ if(a.estado==='Suspenso'||a.lic==='Suspensa') return 'Suspenso'; if(['Expirada','Por validar'].includes(a.lic)) return 'Incompleto'; if(daysUntil(a.valid)<=60) return 'Em risco'; return 'Regular'; }
function requirements(a){ if(a.lic!=='Válida') return 'Regularizar Licença Desportiva de Árbitro.'; if(a.grad==='Clube') return 'Mais avaliações e formação para progressão regional.'; if(daysUntil(a.valid)<=60) return 'Renovação de licença recomendada.'; return 'Requisitos principais completos.'; }
function conflictImpact(s){ return s==='impedimento total'?'Bloqueia nomeação':s==='impedimento parcial'||s==='em análise'||s==='declarado'?'Alerta crítico em nomeação':'Sem impedimento ativo'; }

function getRef(id){ return state.arbitros.find(a=>a.id===Number(id)); } function getRace(id){ return state.provas.find(p=>p.id===Number(id)); }
function requiredCount(provaId){ const p=getRace(provaId); return p?Object.values(p.necessidades||{}).reduce((a,b)=>a+Number(b||0),0):0; }
function appointedCount(provaId){ return state.nomeacoes.filter(n=>n.prova===Number(provaId)&&!['Cancelada','Recusada'].includes(n.estado)).length; }
function activeConflicts(arbId){ return state.conflitos.filter(c=>c.arb===arbId&&!['sem impedimento','resolvido','arquivado'].includes(c.estado)).length; }
function timelineForRef(a){ return [{date:fmtDate(a.valid),title:'Validade da licença',text:`Licença ${a.lic}.`},{date:TODAY,title:'Formação registada',text:a.form},...state.nomeacoes.filter(n=>n.arb===a.id).map(n=>({date:getRace(n.prova)?.ini||TODAY,title:'Nomeação',text:`${getRace(n.prova)?.nome} · ${n.funcao} · ${n.estado}`})),...state.conflitos.filter(c=>c.arb===a.id).map(c=>({date:TODAY,title:'Conflito de interesse',text:`${c.tipo} · ${c.estado}`}))]; }
function addAudit(acao,ent,ant,novo,just='Registo operacional',origem='Sistema'){ state.auditoria.unshift({id:nextId(state.auditoria),data:nowStamp(),user:'Conselho de Arbitragem',acao,ent,ant,novo,just,origem}); }
function exportCSV(name){ const data=state[name]; if(!Array.isArray(data)) return showToast('Exportação indisponível.'); const rows=data.map(flatten); const headers=unique(rows.flatMap(r=>Object.keys(r))); const csv=[headers.join(';'),...rows.map(r=>headers.map(h=>csvCell(r[h])).join(';'))].join('\n'); const blob=new Blob([csv],{type:'text/csv;charset=utf-8'}); const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download=`fpv-${name}.csv`; a.click(); URL.revokeObjectURL(url); addAudit('Exportação CSV', name, 'Dados locais', 'Ficheiro CSV', 'Exportação local', 'Módulo Exportações'); saveState(); renderAll(); showToast(`Exportação CSV criada: ${name}.`); }
function flatten(obj){ const out={}; Object.entries(obj).forEach(([k,v])=>out[k]=typeof v==='object'&&v!==null?JSON.stringify(v):v); return out; } function csvCell(v){ return `"${String(v??'').replace(/"/g,'""')}"`; }
function match(v,f){ return !f || v===f; } function matchText(obj,q,fields){ if(!q) return true; const s=fields.map(k=>obj[k]).join(' ').toLowerCase(); return s.includes(String(q).toLowerCase()); }
function unique(a){ return [...new Set(a.filter(Boolean))].sort(); } function nextId(arr){ return arr.length?Math.max(...arr.map(x=>Number(x.id)||0))+1:1; }
function fmtDate(d){ if(!d) return '—'; return new Intl.DateTimeFormat('pt-PT',{day:'2-digit',month:'short',year:'numeric'}).format(new Date(d+'T00:00:00')); }
function nowStamp(){ return '2026-05-13 12:00'; } function addDays(d,n){ const x=new Date(d+'T00:00:00'); x.setDate(x.getDate()+n); return x.toISOString().slice(0,10); }
function dateLt(a,b){ return new Date(a+'T00:00:00') < new Date(b+'T00:00:00'); } function daysUntil(d){ return Math.ceil((new Date(d+'T00:00:00')-new Date(TODAY+'T00:00:00'))/86400000); }
function isLateReport(r){ return !['Entregue','Validado'].includes(r.estado) && dateLt(r.prazo,TODAY); } function overlap(a,b){ return a&&b&&a.ini<=b.fim&&b.ini<=a.fim; }
function regionHint(local){ const l=String(local).toLowerCase(); if(['porto','viana'].some(x=>l.includes(x))) return 'norte'; if(['faro','portimão','vilamoura'].some(x=>l.includes(x))) return 'sul'; if(['cascais','lisboa','sesimbra','setúbal'].some(x=>l.includes(x))) return 'lisboa'; return ''; }
function initials(n){ return String(n).split(' ').slice(0,2).map(x=>x[0]).join('').toUpperCase(); } function stripHtml(s){ const d=document.createElement('div'); d.innerHTML=s; return d.textContent||''; }
function esc(v){ return String(v??'').replace(/[&<>"']/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[s])); } function escAttr(v){ return esc(v).replace(/`/g,'&#96;'); }
function setText(id,text){ const el=document.getElementById(id); if(el) el.textContent=text; }
function showToast(msg){ const t=document.getElementById('toast'); if(!t) return; t.textContent=msg; t.classList.add('show'); clearTimeout(showToast.timer); showToast.timer=setTimeout(()=>t.classList.remove('show'),3200); }
function registerServiceWorker(){ if('serviceWorker' in navigator && location.protocol !== 'file:') navigator.serviceWorker.register('./service-worker.js').catch(err=>console.warn('Service worker não registado.', err)); }

document.addEventListener('DOMContentLoaded', initApp);

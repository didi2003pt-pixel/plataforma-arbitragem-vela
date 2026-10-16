'use strict';
// PILOTO-AVAIL-01 — Áreas de disponibilidade, sem alterar as funções de nomeação.
// A escolha de cada área é expandida apenas para as vagas concretas já
// configuradas para a prova (o backend continua a validar a lista de funções).
const PILOT_AVAIL_AREAS = Object.freeze([
  { key: 'RACE_OFFICER', title: 'Comissão de Regatas',
    hint: 'Disponibilidade para integrar a comissão; o CA define a função.' },
  { key: 'JUDGE', title: 'Comissão de Protestos / Júri',
    hint: 'Disponibilidade para integrar o júri da prova.' },
  { key: 'UMPIRE', title: 'Juiz-Árbitro',
    hint: 'Inclui provas que exigem esta qualificação, como Team Racing.' },
  { key: 'MEASURER', title: 'Medição',
    hint: 'Disponibilidade para funções de medidor.' },
  { key: 'FUNCTIONAL_CLASSIFIER', title: 'Classificação funcional',
    hint: 'Quando a prova exige classificação na Vela Adaptada.' },
]);
const PILOT_AVAIL_LEGACY_TYPES = Object.freeze({
  'Presidente da Comissão de Regatas': 'RACE_OFFICER',
  'Vogal da Comissão de Regatas': 'RACE_OFFICER',
  'Formando — Oficial de Regata': 'RACE_OFFICER',
  'Presidente da Comissão de Protestos': 'JUDGE',
  'Juiz — Vogal': 'JUDGE',
  'Formando — Juiz': 'JUDGE',
  'Juiz-Árbitro': 'UMPIRE',
  'Medidor': 'MEASURER',
  'Classificador Funcional': 'FUNCTIONAL_CLASSIFIER',
});

function pilotAvailGroups(requiredFunctions) {
  const catalog = new Map(PILOT_AVAIL_AREAS.map(a => [a.key, { ...a, functions: [] }]));
  // Preserve legacy/unknown types instead of silently hiding a requirement.
  for (const f of requiredFunctions || []) {
    const key = PILOT_AVAIL_LEGACY_TYPES[f.functionType] || f.category || ('OTHER:' + f.functionType);
    if (!catalog.has(key)) {
      catalog.set(key, { key, title: f.functionType,
        hint: 'Função específica desta prova.', functions: [] });
    }
    const group = catalog.get(key);
    if (!group.functions.includes(f.functionType)) group.functions.push(f.functionType);
  }
  return [...catalog.values()].filter(a => a.functions.length);
}

openRefereeAvailability314 = function (event, current, me, apps) {
  if (!event || !event.id) return;
  const functions = compatibleFunctions314(event, me);
  const areas = pilotAvailGroups(functions);
  const overlap = overlappingAppointment314(apps, event);
  const selected = new Set((current?.functions || []).map(f => f.functionType));
  const choices = areas.map(area => {
    const checked = area.functions.some(f => selected.has(f));
    return '<label class="pilot-avail-option">' +
      '<input type="checkbox" name="availabilityArea" value="' + escAttr(area.key) + '"' +
        (checked ? ' checked' : '') + '>' +
      '<span class="pilot-avail-option-content"><strong>' + esc(area.title) + '</strong>' +
      '<small>' + esc(area.hint) + '</small></span></label>';
  }).join('');

  openSimpleForm('Disponibilidade — ' + event.name,
    (overlap ? '<div class="notice-box full"><strong>Atenção à sobreposição</strong><p>Tem um compromisso em ' +
      esc(overlap.event.name) + ' (' + humanDateRange314(overlap.event) +
      '). Uma nova nomeação incompatível será bloqueada.</p></div>' : '') +
    '<div class="field full"><label>Resposta</label><select class="select" name="status">' +
      ['AVAILABLE','CONDITIONAL','UNAVAILABLE'].map(status =>
        '<option value="' + status + '"' + (current?.status === status ? ' selected' : '') + '>' +
        ({AVAILABLE:'Disponível',CONDITIONAL:'Condicionado',UNAVAILABLE:'Indisponível'}[status]) +
        '</option>').join('') + '</select></div>' +
    '<div class="field full"><label for="pilotAvailConditionNote">Condição / observação</label>' +
      '<textarea id="pilotAvailConditionNote" class="textarea" name="notes" aria-describedby="pilotAvailConditionHint">' +
      esc(current?.notes || '') + '</textarea>' +
      '<small id="pilotAvailConditionHint" class="pilot-avail-footnote">Obrigatório se a resposta for «Condicionado».</small></div>' +
    '<div class="field full pilot-avail-area-field"><span class="pilot-avail-label">Áreas para as quais se declara disponível</span>' +
      '<p class="pilot-avail-lead">Pode selecionar mais do que uma comissão. O Conselho de Arbitragem decide posteriormente a função concreta.</p>' +
      (choices ? '<div class="pilot-avail-choices">' + choices + '</div>' :
        '<div class="pilot-avail-empty">Nesta prova ainda não existem áreas compatíveis com as suas qualificações. Contacte o Conselho de Arbitragem para confirmar a equipa necessária.</div>') +
      '<p class="pilot-avail-footnote">As opções dependem das necessidades definidas para esta prova. Esta resposta não é uma nomeação.</p></div>',
    async (_values, form) => {
      const data = new FormData(form);
      const status = String(data.get('status') || '');
      const notes = String(data.get('notes') || '');
      const chosen = new Set(data.getAll('availabilityArea'));
      if (status === 'CONDITIONAL' && !notes.trim())
        throw { status: 400, data: { message: 'Se escolher «Condicionado», indique em que condições está disponível.' } };
      if (status !== 'UNAVAILABLE' && functions.length && !chosen.size)
        throw new Error('Selecione pelo menos uma área em que está disponível.');
      const selectedFunctions = [...new Set(areas
        .filter(a => chosen.has(a.key))
        .flatMap(a => a.functions))];
      await api.put('/availability/event/' + encodeURIComponent(event.id) + '/me',
        { status, notes: notes || undefined, functions: status === 'UNAVAILABLE' ? [] : selectedFunctions });
      toast('Disponibilidade guardada. A função concreta será definida pelo Conselho de Arbitragem.');
      await navigate('disponibilidades');
    }
  );
  // Clear, inline validation: reportValidity() now explains the missing condition
  // before the save handler runs. No API calls or database rules change.
  const form = document.getElementById('genericForm');
  const statusInput = form?.querySelector('select[name="status"]');
  const noteInput = form?.querySelector('textarea[name="notes"]');
  const hint = form?.querySelector('#pilotAvailConditionHint');
  const refreshConditionHint = () => {
    if (!statusInput || !noteInput) return;
    const conditional = statusInput.value === 'CONDITIONAL';
    noteInput.required = conditional;
    if (hint) hint.textContent = conditional
      ? 'Obrigatório: explique em que condições poderá participar.'
      : 'Opcional para respostas «Disponível» ou «Indisponível».';
  };
  statusInput?.addEventListener('change', refreshConditionHint);
  refreshConditionHint();
};

// CA: tornar explícito onde são definidas as categorias e graduações exigidas
// por cada prova, sem criar botões extra nem alterar regras do backend.
const pilotAvailOriginalTeamManager = openTeamManager;
openTeamManager = function (event) {
  pilotAvailOriginalTeamManager(event);
  if (!['ARBITRATION_ADMIN', 'NATIONAL_COUNCIL', 'FPV_ADMIN', 'ADMIN'].includes(ui.user?.role)) return;
  const body = document.getElementById('modalBody');
  if (!body || body.querySelector('.pilot-avail-team-note')) return;
  const tip = document.createElement('div');
  tip.className = 'pilot-avail-team-note';
  tip.innerHTML = '<strong>Credenciações exigidas pela prova</strong>' +
    '<p>Em «Adicionar função / vaga», defina as funções necessárias e a graduação mínima. ' +
    'O sistema associa cada função à sua categoria oficial. Exemplos: ' +
    '<b>Juiz-Árbitro</b> para Team Racing; <b>Medidor</b> para medições; ' +
    '<b>Classificador Funcional</b> para Vela Adaptada, quando aplicável. ' +
    'Só as áreas configuradas aparecerão nas disponibilidades.</p>';
  body.prepend(tip);
};

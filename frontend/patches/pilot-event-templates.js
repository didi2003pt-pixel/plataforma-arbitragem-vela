'use strict';
// PILOTO-EVENT-TEMPLATE-01: starting templates only, never official normative requirements.
// Uses existing /events and /events/:id/required-functions endpoints. Nothing touches old events.
const pilotEventTemplateFunctions = Object.freeze({
  FLEET: [
    ['Presidente da Comissão de Regatas','RACE_OFFICER','PRESIDENT'],
    ['Vogal da Comissão de Regatas','RACE_OFFICER','MEMBER'],
    ['Presidente da Comissão de Protestos','JUDGE','PRESIDENT'],
  ],
  TEAM: [
    ['Presidente da Comissão de Regatas','RACE_OFFICER','PRESIDENT'],
    ['Juiz-Árbitro','UMPIRE','MEMBER'],
  ],
  MATCH: [
    ['Presidente da Comissão de Regatas','RACE_OFFICER','PRESIDENT'],
    ['Juiz-Árbitro','UMPIRE','MEMBER'],
  ],
  ADAPTIVE: [
    ['Presidente da Comissão de Regatas','RACE_OFFICER','PRESIDENT'],
    ['Classificador Funcional','FUNCTIONAL_CLASSIFIER','SPECIALIST'],
  ],
  OTHER: [],
});
const pilotEventTemplateNames = Object.freeze({
  FLEET:'Regata de Frota',TEAM:'Team Racing',MATCH:'Match Racing',
  ADAPTIVE:'Vela Adaptada',OTHER:'Outro tipo de prova',
});
function pilotEventTemplateRequirements(key) {
  if (!Object.prototype.hasOwnProperty.call(pilotEventTemplateFunctions,key))
    throw new Error('Escolha um tipo de prova válido.');
  return pilotEventTemplateFunctions[key].map(([functionType,category,position])=>({
    functionType,category,position,requiredQuantity:1,acceptsTrainee:false
  }));
}

const pilotEventPreviousForm = openEventForm;
openEventForm = function(existing=null) {
  // Never modify events already created, regional flow or imported source.
  if (existing || !['ARBITRATION_ADMIN','NATIONAL_COUNCIL','FPV_ADMIN','ADMIN'].includes(ui.user?.role))
    return pilotEventPreviousForm(existing);

  const isCouncil = ['ARBITRATION_ADMIN','NATIONAL_COUNCIL'].includes(ui.user.role);
  const scopeOptions = (isCouncil?['NATIONAL','INTERNATIONAL']:['NATIONAL','INTERNATIONAL','REGIONAL','CLUB'])
    .map(s=>'<option value="'+s+'">'+esc(label(s))+'</option>').join('');
  const selectOptions = Object.keys(pilotEventTemplateNames)
    .map(k=>'<option value="'+k+'">'+esc(pilotEventTemplateNames[k])+'</option>').join('');
  const markup =
    '<div class="field full"><label for="pilotTemplateEventName">Nome da prova</label>' +
      '<input class="input" id="pilotTemplateEventName" name="name" maxlength="220" required></div>' +
    '<div class="field full"><label for="pilotTemplateType">Tipo de prova</label>' +
      '<select id="pilotTemplateType" class="select" name="template" required>' +
      '<option value="">Escolha o tipo…</option>'+selectOptions+'</select></div>' +
    '<div id="pilotTemplateCustomWrap" class="field full" hidden><label for="pilotTemplateCustomType">Designação do tipo</label>' +
      '<input id="pilotTemplateCustomType" class="input" name="customType" placeholder="Indique o tipo de prova" maxlength="100"></div>' +
    '<div class="pilot-template-preview full" id="pilotTemplatePreview" aria-live="polite">' +
      'Ao escolher o tipo de prova, aparece uma proposta inicial de equipa.</div>' +
    '<div class="field"><label>Âmbito</label><select class="select" name="scope" required>'+scopeOptions+'</select></div>' +
    '<div class="field"><label>Início</label><input class="input" type="date" name="startDate" required></div>' +
    '<div class="field"><label>Fim</label><input class="input" type="date" name="endDate" required></div>' +
    '<div class="field"><label>Local</label><input class="input" name="location" maxlength="220" required></div>' +
    '<div class="field full"><label>Classes (opcional)</label><input class="input" name="classes"></div>' +
    '<div class="field full"><label>Observações (opcional)</label><textarea class="textarea" name="notes"></textarea></div>' +
    (isCouncil?
      '<p class="offline-note full">As provas criadas pelo CA ficam sujeitas a nomeação pelo Conselho de Arbitragem.</p>':
      '<label class="check-pill full"><input type="checkbox" name="requiresNationalAppointment" value="true"> Nomeação pelo Conselho de Arbitragem</label>') +
    '<p class="pilot-template-footnote full">Estes modelos são sugestões de organização, não requisitos regulamentares automáticos. ' +
      'Cada função começa com uma vaga e sem graduação mínima predefinida. ' +
      'O CA deve rever quantidades, categorias e graduações em «Equipa necessária» antes de abrir disponibilidades.</p>';

  openSimpleForm('Nova prova',markup,async f=>{
    const key = String(f.template || '');
    const proposed = pilotEventTemplateRequirements(key);
    const type = key==='OTHER'?String(f.customType||'').trim():pilotEventTemplateNames[key];
    if (!type || type==='Outro tipo de prova') throw new Error('Indique o tipo da prova.');
    if (!f.startDate || !f.endDate || f.endDate < f.startDate)
      throw new Error('A data final não pode ser anterior à inicial.');
    const payload = {
      name:String(f.name||'').trim(),type,scope:f.scope,
      startDate:f.startDate,endDate:f.endDate,location:String(f.location||'').trim(),
      requiresNationalAppointment:isCouncil?true:f.requiresNationalAppointment==='true'
    };
    for(const k of ['classes','notes']) if(f[k] && String(f[k]).trim())payload[k]=String(f[k]).trim();
    if(!payload.name||!payload.location)throw new Error('Preencha o nome e o local da prova.');
    // Existing backend rules and authorization remain fully in force.
    const event = await api.post('/events',payload);
    let applied=0,failed=null;
    for(const requirement of proposed){
      try {
        await api.post('/events/'+encodeURIComponent(event.id)+'/required-functions',requirement);
        applied++;
      } catch(err) {failed=err;break;}
    }
    await navigate('provas');
    if(failed) {
      toast('Prova criada, mas só '+applied+'/'+proposed.length+
        ' funções foram registadas. Verifique «Equipa necessária»: '+errorMessage(failed),true);
    } else if(proposed.length) {
      toast('Prova criada com '+applied+
        ' funções sugeridas. Reveja e ajuste a equipa antes de abrir disponibilidades.');
    } else {
      toast('Prova criada. Configure a equipa necessária antes de abrir disponibilidades.');
    }
  });
  const selector = document.getElementById('pilotTemplateType');
  const preview = document.getElementById('pilotTemplatePreview');
  const other = document.getElementById('pilotTemplateCustomWrap');
  const custom = document.getElementById('pilotTemplateCustomType');
  selector.onchange = ()=>{
    const key = selector.value;
    other.hidden = key!=='OTHER';
    custom.required = key==='OTHER';
    if(!key){preview.textContent='Escolha um tipo para ver a equipa sugerida.';return;}
    const req = pilotEventTemplateRequirements(key);
    if(!req.length){
      preview.innerHTML='<strong>Configuração manual</strong><p>O CA definirá as funções e qualificações em «Equipa necessária».</p>';
      return;
    }
    preview.innerHTML='<strong>Equipa sugerida para '+esc(pilotEventTemplateNames[key])+'</strong>' +
      '<ul>'+req.map(x=>'<li>'+esc(x.functionType)+' — '+esc(label(x.category))+'</li>').join('')+'</ul>'+
      '<small>Vagas iniciais: 1 por função. Graduação mínima: a definir pelo CA.</small>';
  };
};

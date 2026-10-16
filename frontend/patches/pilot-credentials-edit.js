'use strict';
// PILOTO-CRED-01: existing official qualifications can be corrected by the CA.
// No extra global toolbar buttons; the edit option lives inside Credenciação.
const pilotCredRoles = ['ARBITRATION_ADMIN','NATIONAL_COUNCIL'];
const pilotCredOriginalRender = renderCredentials;
renderCredentials = async function(root,actions) {
  await pilotCredOriginalRender(root,actions);
  if (!pilotCredRoles.includes(ui.user?.role)) return;
  const refs=await api.get('/referees');
  const panel=document.createElement('details');
  panel.className='pilot-cred-panel card';
  panel.innerHTML='<summary><strong>Gerir qualificações oficiais</strong><span class="row-sub">Consultar e corrigir registos existentes</span></summary>' +
    '<div class="pilot-cred-inner">' +
    '<p class="offline-note">Use apenas para corrigir dados oficiais já confirmados pelo CA. Todas as correções ficam registadas em auditoria.</p>' +
    '<label for="pilotCredReferee">Árbitro</label>' +
    '<select class="select" id="pilotCredReferee"><option value="">Selecione um árbitro…</option>' +
      refs.map(r => '<option value="' + escAttr(r.id) + '">' +
        esc(r.name + ' · ' + r.code) + '</option>').join('') + '</select>' +
    '<div id="pilotCredList" aria-live="polite"></div></div>';
  root.prepend(panel);
  const selector=panel.querySelector('#pilotCredReferee');
  const list=panel.querySelector('#pilotCredList');
  selector.onchange=async()=>{
    list.innerHTML='<p class="offline-note">A consultar qualificações…</p>';
    if (!selector.value) { list.innerHTML=''; return; }
    try {
      const r=await api.get('/referees/'+encodeURIComponent(selector.value));
      const quals=r.qualifications||[];
      if (!quals.length) {
        list.innerHTML='<p class="offline-note">Ainda não há qualificações oficiais registadas. Utilize «Registar qualificação» para adicionar a primeira.</p>';
        return;
      }
      list.innerHTML=quals.map(q=>
        '<div class="pilot-cred-item"><div>' +
        '<strong>'+esc(label(q.category))+' · '+esc(label(q.grade))+'</strong>' +
        '<div class="row-sub">'+esc(label(q.status))+
        ' · '+esc((q.validFrom||'').slice(0,10))+
        (q.validUntil?' → '+esc(q.validUntil.slice(0,10)):' · Sem data final')+'</div></div>'+
        '<button type="button" class="btn pilot-cred-edit" data-qual-id="'+escAttr(q.id)+'">Editar</button></div>'
      ).join('');
      list.querySelectorAll('[data-qual-id]').forEach(button=>{
        button.onclick=()=> {
          const q=quals.find(x=>x.id===button.dataset.qualId);
          if (q) pilotCredEditOne(r,q);
        };
      });
    } catch(e) { list.textContent=errorMessage(e); }
  };
};

function pilotCredEditOne(referee, q) {
  const pick=(values,current)=>values.map(value=>
    '<option value="'+escAttr(value)+'"'+(current===value?' selected':'')+'>'+esc(label(value))+'</option>'
  ).join('');
  const date=x=>x?String(x).slice(0,10):'';
  openSimpleForm('Corrigir qualificação oficial',
    '<div class="pilot-cred-summary full"><strong>'+esc(referee.name)+'</strong>' +
    '<span>Esta correção mantém o histórico da qualificação e fica registada em auditoria.</span></div>' +
    '<div class="field"><label>Categoria</label><select class="select" name="category" required>'+
       pick(['RACE_OFFICER','JUDGE','UMPIRE','MEASURER','FUNCTIONAL_CLASSIFIER'],q.category)+'</select></div>'+
    '<div class="field"><label>Graduação</label><select class="select" name="grade" required>'+
       pick(['REGIONAL','NATIONAL','INTERNATIONAL'],q.grade)+'</select></div>'+
    '<div class="field"><label>Estado</label><select class="select" name="status" required>'+
       pick(['PENDING','VALID','EXPIRED','SUSPENDED','REVOKED'],q.status)+'</select></div>'+
    '<div class="field"><label>Válida desde</label><input class="input" type="date" name="validFrom" value="'+escAttr(date(q.validFrom))+'" required></div>'+
    '<div class="field"><label>Válida até (opcional)</label><input class="input" type="date" name="validUntil" value="'+escAttr(date(q.validUntil))+'"></div>'+
    '<div class="field full"><label>Observações</label><textarea class="textarea" name="notes">'+esc(q.notes||'')+'</textarea></div>'+
    '<div class="field full"><label>Motivo da correção (obrigatório)</label><textarea class="textarea" name="reason" minlength="5" required placeholder="Explique o que foi corrigido"></textarea></div>',
    async values=>{
      if (values.validUntil && values.validUntil < values.validFrom)
        throw new Error('A validade final não pode ser anterior à data inicial.');
      if (String(values.reason||'').trim().length<5)
        throw new Error('Indique o motivo da correção (mínimo 5 caracteres).');
      if (!confirm('Confirma a correção desta qualificação oficial de '+referee.name+'?'))
        throw new Error('Correção cancelada.');
      await api.patch('/credentials/referees/'+encodeURIComponent(referee.id)+
        '/qualifications/'+encodeURIComponent(q.id),{
          category:values.category,grade:values.grade,status:values.status,
          validFrom:values.validFrom,validUntil:values.validUntil||null,
          notes:values.notes||'',reason:values.reason.trim()
        });
      toast('Qualificação corrigida. A alteração ficou registada.');
      await navigate('credenciacao');
    }
  );
}

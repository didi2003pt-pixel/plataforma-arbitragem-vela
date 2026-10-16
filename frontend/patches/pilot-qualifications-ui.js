'use strict';
// PILOTO-QUAL-01: one existing action, used to view/add/edit official qualifications.
const pilotQualOriginalRenderCredentials = renderCredentials;
renderCredentials = async function(root,actions) {
  await pilotQualOriginalRenderCredentials(root,actions);
  if (!['ARBITRATION_ADMIN','NATIONAL_COUNCIL'].includes(ui.user?.role)) return;
  const action = document.getElementById('caAddQualification314') ||
    document.getElementById('addQualification');
  if (!action) return;
  action.textContent = 'Gerir qualificações';
  action.onclick = pilotQualManage;
};

async function pilotQualManage() {
  try {
    const refs = await api.get('/referees');
    if (!refs.length) {
      toast('Não existem árbitros registados.',true);
      return;
    }
    const select = '<div class="field full"><label>Árbitro</label><select id="pilotQualRefSelect" class="select">' +
      refs.map(r => '<option value="' + escAttr(r.id) + '">' +
        esc(r.name + ' · ' + r.code) + '</option>').join('') + '</select></div>';
    openModal('Qualificações oficiais',
      '<div class="pilot-qual-layout">' + select +
      '<p class="offline-note">Selecione uma qualificação para corrigir. As alterações são feitas pelo CA e ficam registadas em auditoria.</p>' +
      '<div id="pilotQualRecords"></div></div>',
      '<button class="btn" id="pilotQualClose">Fechar</button>');
    document.getElementById('pilotQualClose').onclick = closeModal;
    const selector = document.getElementById('pilotQualRefSelect');
    const refresh = () => {
      const r = refs.find(x => x.id === selector.value);
      const list = (r?.qualifications || []);
      document.getElementById('pilotQualRecords').innerHTML =
        (list.length ? '<div class="pilot-qual-records">' +
          list.map(q => '<div class="pilot-qual-record"><div><strong>' +
            esc(label(q.category)) + ' · ' + esc(label(q.grade)) +
            '</strong><span>' + esc(label(q.status)) +
            ' · ' + esc(fmtDate(q.validFrom)) + ' – ' + esc(fmtDate(q.validUntil)) +
            '</span></div><button type="button" class="btn" data-qual-edit="' +
            escAttr(q.id) + '">Editar</button></div>').join('') + '</div>' :
          '<div class="empty compact-empty">Ainda não existem qualificações oficiais registadas.</div>') +
        '<button class="pilot-qual-add" id="pilotQualAdd" type="button">+ Registar nova qualificação</button>';
      document.querySelectorAll('[data-qual-edit]').forEach(btn => {
        const q = list.find(x => x.id === btn.dataset.qualEdit);
        btn.onclick = () => pilotQualEdit(r,q);
      });
      document.getElementById('pilotQualAdd').onclick = () => openQualificationForm(refs);
    };
    selector.onchange = refresh;
    refresh();
  } catch(e) { toast(errorMessage(e),true); }
}

function pilotQualEdit(referee,q) {
  if (!referee || !q) return;
  const opts = (list,current) => list.map(value =>
    '<option value="' + value + '"' + (value === current ? ' selected' : '') +
    '>' + esc(label(value)) + '</option>').join('');
  openSimpleForm('Corrigir qualificação',
    '<p class="offline-note full"><strong>' + esc(referee.name) +
    '</strong> · Os dados oficiais devem corresponder à certificação comprovada. A edição pode alterar a elegibilidade para futuras nomeações.</p>' +
    '<div class="field"><label>Categoria</label><select class="select" name="category">' +
      opts(['RACE_OFFICER','JUDGE','UMPIRE','MEASURER','FUNCTIONAL_CLASSIFIER'],q.category) +
      '</select></div>' +
    '<div class="field"><label>Graduação</label><select class="select" name="grade">' +
      opts(['REGIONAL','NATIONAL','INTERNATIONAL'],q.grade) + '</select></div>' +
    '<div class="field full"><label>Estado</label><select class="select" name="status">' +
      opts(['VALID','PENDING','EXPIRED','SUSPENDED','REVOKED'],q.status) +
      '</select></div>' +
    '<div class="field"><label>Válida desde</label><input type="date" class="input" name="validFrom" required value="' +
      escAttr(dateInput(q.validFrom)) + '"></div>' +
    '<div class="field"><label>Válida até (opcional)</label><input type="date" class="input" name="validUntil" value="' +
      escAttr(dateInput(q.validUntil)) + '"></div>' +
    '<div class="field full"><label>Notas</label><textarea class="textarea" name="notes" maxlength="1500">' +
      esc(q.notes || '') + '</textarea></div>' +
    '<div class="field full"><label>Motivo da correção (obrigatório)</label><textarea class="textarea" name="reason" minlength="4" maxlength="500" required placeholder="Ex.: corrigir graduação conforme certificado oficial"></textarea></div>',
    async f => {
      const payload = {
        category:f.category,grade:f.grade,status:f.status,validFrom:f.validFrom,
        validUntil:f.validUntil || null, notes:f.notes || '',reason:f.reason.trim()
      };
      if (!confirm('Confirmas a correção da qualificação oficial de ' + referee.name + '?')) {
        throw new Error('Operação cancelada.');
      }
      await api.patch('/credentials/referees/' + encodeURIComponent(referee.id) +
        '/qualifications/' + encodeURIComponent(q.id),payload);
      toast('Qualificação corrigida e alteração registada.');
      await navigate('credenciacao');
    });
}

'use strict';
// PILOTO-REG-05. Contextual editing replaces toolbar clutter.
// Admin: open the referee, then edit their identity/contact.
// Referee: edit personal contact; ask for official name correction via existing submission workflow.

const reg05Roles = ['ARBITRATION_ADMIN', 'NATIONAL_COUNCIL', 'FPV_ADMIN', 'ADMIN'];
function reg05CanEdit() { return reg05Roles.includes(ui.user?.role); }

const reg05OriginalAdminDetail = adminOpenReferee;
adminOpenReferee = async function (id) {
  await reg05OriginalAdminDetail(id);
  if (!reg05CanEdit()) return;
  reg05InsertEdit(id);
};

function reg05InsertEdit(id) {
  const actions = document.getElementById('modalActions');
  if (!actions || actions.querySelector('.reg05-detail-edit')) return;
  const edit = document.createElement('button');
  edit.className = 'btn reg05-detail-edit';
  edit.type = 'button';
  edit.textContent = 'Editar dados';
  edit.onclick = () => reg05OpenAdminEdit(id);
  actions.insertBefore(edit, actions.firstChild);
}

const reg05OriginalReferees = renderReferees;
renderReferees = async function (root) {
  await reg05OriginalReferees(root);
  // For CA roles the original list is read-only text; make the existing name
  // itself the detail trigger. Do not introduce extra action columns.
  if (!['ARBITRATION_ADMIN', 'NATIONAL_COUNCIL'].includes(ui.user?.role)) return;
  const refs = await api.get('/referees');
  const names = root.querySelectorAll('table tbody tr td:first-child strong');
  if (names.length !== refs.length) return;
  names.forEach((strong, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'reg05-name-link';
    button.textContent = refs[index].name;
    button.onclick = () => reg05OpenCouncilDetail(refs[index].id);
    strong.replaceWith(button);
  });
};

async function reg05OpenCouncilDetail(id) {
  try {
    const r = await api.get('/referees/' + encodeURIComponent(id));
    const qs = (r.qualifications || []).map(q =>
      esc(label(q.category)) + ' · ' + esc(label(q.grade))
    ).join(', ') || 'Nenhuma registada';
    openModal('Ficha do árbitro',
      '<div class="reg05-profile-summary"><div class="reg05-round-avatar">' + esc(initials(r.name)) + '</div>' +
      '<div><h3>' + esc(r.name) + '</h3><span class="row-sub">' + esc(r.code) + '</span></div></div>' +
      metrics([['Email', r.email], ['Telefone', r.phone || '—'], ['Região', r.region?.name || '—'],
        ['Licença', label(r.licenseStatus)], ['Qualificações', qs]]),
      '<button type="button" class="btn reg05-detail-edit" id="reg05EditDetail">Editar dados</button>' +
      '<button type="button" class="btn" id="reg05CloseDetail">Fechar</button>');
    document.getElementById('reg05EditDetail').onclick = () => reg05OpenAdminEdit(id);
    document.getElementById('reg05CloseDetail').onclick = closeModal;
  } catch (error) { toast(errorMessage(error), true); }
}

async function reg05OpenAdminEdit(id) {
  try {
    const r = await api.get('/referees/' + encodeURIComponent(id));
    openSimpleForm('Editar dados do árbitro',
      '<div class="field full"><label for="reg05Name">Nome completo</label><input id="reg05Name" class="input" name="name" minlength="3" maxlength="160" required value="' + escAttr(r.name) + '"></div>' +
      '<div class="field full"><label for="reg05Phone">Telefone (opcional)</label><input id="reg05Phone" class="input" name="phone" maxlength="50" value="' + escAttr(r.phone || '') + '"></div>' +
      '<div class="field full reg05-email-panel"><div class="reg05-label">Email de acesso</div><strong>' + esc(r.email) + '</strong>' +
      '<button class="reg05-inline-action" type="button" id="reg05EmailLink">Corrigir email do convite <span aria-hidden="true">↗</span></button>' +
      '<p class="offline-note">A correção do email é feita separadamente, para proteger a conta e os convites emitidos.</p></div>',
      async f => {
        const data = {};
        if (String(f.name).trim() !== r.name) data.name = String(f.name).trim();
        if (String(f.phone || '').trim() !== String(r.phone || '').trim()) data.phone = String(f.phone || '').trim();
        if (Object.keys(data).length) {
          await api.patch('/referees/' + encodeURIComponent(id) + '/identity', data);
          toast('Dados atualizados e alteração registada.');
        }
        await navigate('arbitros');
      });
    document.getElementById('reg05EmailLink').onclick = () => openPilotCorrectRefereeEmail(id);
  } catch (error) { toast(errorMessage(error), true); }
}

const reg05OriginalProfile = renderProfile;
renderProfile = async function (root) {
  await reg05OriginalProfile(root);
  const button = root.querySelector('#editMe');
  if (!button) return;
  button.textContent = 'Editar dados';
  button.classList.add('reg05-profile-edit');
  button.onclick = () => reg05OpenMyData();
};

async function reg05OpenMyData() {
  try {
    const me = await api.get('/referees/me');
    const profile = me.privateProfile || {};
    openSimpleForm('Os meus dados',
      '<div class="reg05-form-lead full">Atualize os seus contactos. A identificação oficial é validada pela FPV.</div>' +
      '<div class="field full"><label>Nome registado</label><input class="input" readonly value="' + escAttr(me.name) + '"></div>' +
      '<div class="field full reg05-request-row">O nome está incorreto? <button type="button" class="reg05-inline-action" id="reg05RequestName">Pedir correção</button></div>' +
      '<div class="field full"><label>Telefone</label><input class="input" name="phone" maxlength="50" value="' + escAttr(me.phone || '') + '"></div>' +
      '<div class="field full"><label>Morada</label><input class="input" name="address" maxlength="220" value="' + escAttr(profile.address || '') + '"></div>' +
      '<div class="field"><label>Localidade</label><input class="input" name="city" maxlength="120" value="' + escAttr(profile.city || '') + '"></div>' +
      '<div class="field"><label>Código postal</label><input class="input" name="postalCode" maxlength="24" value="' + escAttr(profile.postalCode || '') + '"></div>',
      async f => {
        await api.patch('/referees/me', {
          phone: f.phone || '', address: f.address || '', city: f.city || '', postalCode: f.postalCode || ''
        });
        toast('Os seus contactos foram atualizados.');
        await navigate('perfil');
      });
    document.getElementById('reg05RequestName').onclick = () => reg05RequestNameCorrection(me.name);
  } catch (error) { toast(errorMessage(error), true); }
}

function reg05RequestNameCorrection(currentName) {
  openSimpleForm('Pedir correção do nome',
    '<div class="reg05-form-lead full">O pedido será analisado pelos responsáveis da FPV. Até ser validado, o nome oficial mantém-se.</div>' +
    '<div class="field full"><label>Nome atualmente registado</label><input class="input" readonly value="' + escAttr(currentName) + '"></div>' +
    '<div class="field full"><label>Nome correto</label><input class="input" name="correctName" minlength="3" maxlength="160" required></div>' +
    '<div class="field full"><label>Observações (opcional)</label><textarea class="textarea" name="notes" rows="3"></textarea></div>',
    async f => {
      const correct = String(f.correctName || '').trim();
      if (correct === currentName) throw new Error('Indique um nome diferente do atual.');
      await api.post('/credentials/me/submissions', {
        type: 'CORRECTION',
        title: 'Correção de nome na ficha de árbitro',
        details: 'Nome atualmente registado: ' + currentName + '\nNome correto: ' + correct +
          (f.notes?.trim() ? '\nObservações: ' + f.notes.trim() : '')
      });
      toast('Pedido enviado para validação pela FPV.');
      await navigate('perfil');
    });
}

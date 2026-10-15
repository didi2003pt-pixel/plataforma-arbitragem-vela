'use strict';
// FPV PILOTO-REG-01 — Registo inicial, sem validar a licença ou qualificações.
// Esta extensão é carregada depois de app.js e das correções MOBILE1.

const _reg01RenderReferees = renderReferees;
renderReferees = async function (root) {
  await _reg01RenderReferees(root);
  if (!['ARBITRATION_ADMIN', 'NATIONAL_COUNCIL', 'FPV_ADMIN', 'ADMIN'].includes(ui.user?.role)) return;
  const actions = document.getElementById('pageActions');
  if (!actions) return;
  const button = document.createElement('button');
  button.className = 'btn btn-primary';
  button.type = 'button';
  button.textContent = 'Registar árbitro';
  button.onclick = () => openPilotRegisterReferee();
  actions.appendChild(button);
};

const _reg01RenderUsers = renderUsers;
renderUsers = async function (root, actions) {
  await _reg01RenderUsers(root, actions);
  if (!['ARBITRATION_ADMIN', 'NATIONAL_COUNCIL', 'FPV_ADMIN', 'ADMIN'].includes(ui.user?.role)) return;
  const button = document.createElement('button');
  button.className = 'btn';
  button.type = 'button';
  button.textContent = 'Registar e convidar árbitro';
  button.onclick = () => openPilotRegisterReferee(true);
  actions.appendChild(button);
};

async function openPilotRegisterReferee(inviteByDefault = true) {
  try {
    const regions = await api.get('/referees/registration-options');
    if (!regions.length) {
      toast('Não existem regiões ativas configuradas. Contacte a administração para configurar uma região.', true);
      return;
    }
    const regionOptions = regions.map(r =>
      '<option value="' + escAttr(r.id) + '">' + esc(r.name) + '</option>'
    ).join('');
    openSimpleForm('Registar árbitro',
      '<p class="offline-note full">O registo cria a ficha administrativa, mas não valida licença, categoria nem graduação. O código interno é gerado automaticamente.</p>' +
      '<div class="field full"><label>Nome completo</label><input class="input" name="name" minlength="3" maxlength="160" autocomplete="name" required></div>' +
      '<div class="field full"><label>E-mail</label><input class="input" type="email" name="email" maxlength="254" autocomplete="email" required></div>' +
      '<div class="field"><label>Região</label><select class="select" name="regionId" required><option value="">Selecione…</option>' + regionOptions + '</select></div>' +
      '<div class="field"><label>N.º licença desportiva (se conhecido)</label><input class="input" name="licenseNumber" maxlength="60"></div>' +
      '<div class="field full"><label>Telefone (opcional)</label><input class="input" name="phone" maxlength="50" autocomplete="tel"></div>' +
      '<label class="check-pill full"><input type="checkbox" name="sendInvite" value="true" ' + (inviteByDefault ? 'checked' : '') + '> Enviar convite para criar a conta</label>',
      async f => {
        const payload = {
          name: f.name.trim(),
          email: f.email.trim(),
          regionId: f.regionId,
          ...(f.phone?.trim() ? { phone: f.phone.trim() } : {}),
          ...(f.licenseNumber?.trim() ? { licenseNumber: f.licenseNumber.trim() } : {})
        };
        const referee = await api.post('/referees', payload);
        if (f.sendInvite !== 'true') {
          toast('Árbitro registado. Pode convidá-lo no menu Utilizadores.');
          await navigate('arbitros');
          return;
        }
        try {
          const result = await api.post('/users/invite', {
            role: 'REFEREE', refereeId: referee.id, email: referee.email
          });
          toast(result.emailSent === false
            ? 'Ficha e convite criados, mas o email não foi enviado. Verifique o envio e use Reenviar convite.'
            : 'Árbitro registado e convite criado. Confirme a receção do email.',
            result.emailSent === false);
        } catch (err) {
          toast('Árbitro registado, mas o convite falhou. Utilize Utilizadores → Convidar árbitro. ' + errorMessage(err), true);
        }
        await navigate('arbitros');
      }
    );
  } catch (err) {
    toast(errorMessage(err), true);
  }
}

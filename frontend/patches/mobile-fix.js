/* FPV Arbitragem — MOBILE1
   Melhoria exclusivamente visual: prepara tabelas simples para leitura mobile. */
(() => {
  const MOBILE_QUERY = '(max-width: 860px)';

  function prepareTable(table) {
    if (!(table instanceof HTMLTableElement)) return;
    if (table.closest('.desktop-table, .bogolab-table')) return;

    const headers = Array.from(table.querySelectorAll('thead th'))
      .map(th => (th.textContent || '').trim());
    if (!headers.length) return;

    const rows = Array.from(table.querySelectorAll('tbody tr'));
    if (!rows.length) return;

    for (const row of rows) {
      const cells = Array.from(row.children).filter(el => el.tagName === 'TD');
      cells.forEach((cell, index) => {
        if (!cell.hasAttribute('data-label') && headers[index]) {
          cell.setAttribute('data-label', headers[index]);
        }
      });
    }

    table.classList.add('mobile-stack-ready');
  }

  function prepareTables(root = document) {
    if (!window.matchMedia(MOBILE_QUERY).matches) return;
    root.querySelectorAll?.('.table-wrap table').forEach(prepareTable);
  }

  let queued = false;
  function queuePrepare() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      prepareTables(document);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      prepareTables(document);
      new MutationObserver(queuePrepare).observe(document.body, { childList: true, subtree: true });
    }, { once: true });
  } else {
    prepareTables(document);
    new MutationObserver(queuePrepare).observe(document.body, { childList: true, subtree: true });
  }

  window.matchMedia(MOBILE_QUERY).addEventListener?.('change', queuePrepare);
})();

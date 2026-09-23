(() => {
  const links = [...document.querySelectorAll('a[data-external-url]')];
  if (!links.length) return;

  links.forEach(link => {
    link.classList.add('external-link');
    link.setAttribute('aria-haspopup', 'dialog');
    link.removeAttribute('target');
  });

  const dialog = document.createElement('dialog');
  dialog.className = 'external-link-dialog';
  dialog.setAttribute('aria-labelledby', 'externalLinkTitle');
  dialog.innerHTML = `
    <div class="external-dialog-card">
      <p class="external-dialog-kicker">외부 사이트 안내</p>
      <h2 id="externalLinkTitle">GEA Brief를 벗어나시겠습니까?</h2>
      <p>선택한 출처는 GEA Brief가 아닌 외부 사이트입니다. 현재 페이지는 그대로 유지되고 외부 사이트는 새 탭에서 열립니다.</p>
      <div class="external-destination"><span>이동할 사이트</span><strong></strong></div>
      <div class="external-dialog-actions">
        <button type="button" class="external-cancel">이 사이트에 머물기</button>
        <a class="external-confirm" href="#" target="_blank" rel="noopener noreferrer nofollow">외부 사이트 열기</a>
      </div>
    </div>`;
  document.body.append(dialog);

  const destination = dialog.querySelector('.external-destination strong');
  const confirm = dialog.querySelector('.external-confirm');
  const cancel = dialog.querySelector('.external-cancel');
  let opener = null;

  const closeDialog = () => {
    dialog.close();
    opener?.focus();
  };

  links.forEach(link => link.addEventListener('click', event => {
    event.preventDefault();
    const rawUrl = link.dataset.externalUrl;
    try {
      const url = new URL(rawUrl);
      if (!['http:', 'https:'].includes(url.protocol)) return;
      opener = link;
      destination.textContent = url.hostname.replace(/^www\./, '');
      confirm.href = url.href;
      dialog.showModal();
      cancel.focus();
    } catch (error) {
      console.warn('유효하지 않은 외부 링크', rawUrl);
    }
  }));

  cancel.addEventListener('click', closeDialog);
  confirm.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target === dialog) closeDialog();
  });
  dialog.addEventListener('cancel', event => {
    event.preventDefault();
    closeDialog();
  });
})();

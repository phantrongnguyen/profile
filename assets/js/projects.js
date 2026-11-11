document.addEventListener('DOMContentLoaded', () => {
  const previewChips = document.querySelectorAll('.preview-chip');
  if (!previewChips.length || typeof HTMLDialogElement === 'undefined') return;

  const dialog = document.createElement('dialog');
  dialog.className = 'diagram-lightbox';
  dialog.setAttribute('aria-label', 'Project diagram preview');
  dialog.innerHTML = `
    <div class="diagram-lightbox-bar">
      <span class="diagram-lightbox-title"></span>
      <div class="diagram-lightbox-actions">
        <a class="project-btn diagram-lightbox-raw" target="_blank" rel="noopener noreferrer">Open original ↗</a>
        <button type="button" class="diagram-lightbox-close" aria-label="Close preview">ESC ✕</button>
      </div>
    </div>
    <div class="diagram-lightbox-body">
      <img alt="">
    </div>
  `;
  document.body.append(dialog);

  const titleEl = dialog.querySelector('.diagram-lightbox-title');
  const rawLink = dialog.querySelector('.diagram-lightbox-raw');
  const bodyEl = dialog.querySelector('.diagram-lightbox-body');
  const previewImg = dialog.querySelector('.diagram-lightbox-body img');
  const closeBtn = dialog.querySelector('.diagram-lightbox-close');

  previewChips.forEach(chip => {
    chip.addEventListener('click', event => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0) return;
      event.preventDefault();
      const href = chip.getAttribute('href');
      if (!href) return;
      const label = chip.dataset.caption || chip.textContent.trim();
      titleEl.textContent = label;
      rawLink.href = href;
      bodyEl.classList.toggle('dark-frame', chip.classList.contains('dark-frame'));
      previewImg.src = href;
      previewImg.alt = label;
      dialog.showModal();
    });
  });

  closeBtn.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target === dialog) dialog.close();
  });
});

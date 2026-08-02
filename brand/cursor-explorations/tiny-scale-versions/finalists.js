const frame = document.querySelector('.hero-card iframe');
for (const button of document.querySelectorAll('[data-action]')) {
  button.addEventListener('click', () => {
    frame?.contentWindow?.postMessage({ channel: 'identity-lab', action: button.dataset.action }, location.origin);
  });
}

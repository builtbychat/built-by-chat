const frame = document.querySelector('[data-ident]');
for (const control of document.querySelectorAll('[data-action]')) {
  control.addEventListener('click', () => frame?.contentWindow?.postMessage({ channel: 'tiny-signal-ident', action: control.dataset.action }, location.origin));
}

function fitApplication(frameElement) {
  const svg = frameElement.contentDocument?.documentElement;
  if (svg?.tagName.toLowerCase() !== 'svg') return;
  svg.setAttribute('width', '100%');
  svg.setAttribute('height', '100%');
  svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
}

for (const application of document.querySelectorAll('[data-application]')) {
  application.addEventListener('load', () => fitApplication(application));
  fitApplication(application);
}

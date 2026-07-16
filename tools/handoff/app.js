const form = document.querySelector('#handoff-form');
const saveButton = document.querySelector('#save-button');
const downloadButton = document.querySelector('#download-button');
const saveState = document.querySelector('#save-state');
const savePath = document.querySelector('#save-path');
const completion = document.querySelector('#form-completion');

function setNested(target, path, value) {
  const parts = path.split('.');
  let cursor = target;
  for (const part of parts.slice(0, -1)) cursor = cursor[part] ??= {};
  cursor[parts.at(-1)] = value;
}

function formFields() {
  const fields = {};
  for (const element of form.elements) {
    if (!element.name) continue;
    if (element.type === 'radio' && !element.checked) continue;
    const value = element.type === 'checkbox' ? element.checked : element.value.trim();
    setNested(fields, element.name, value);
  }
  return fields;
}

function populate(fields, prefix = '') {
  for (const [key, value] of Object.entries(fields || {})) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === 'object' && !Array.isArray(value)) populate(value, path);
    else {
      const element = form.elements.namedItem(path);
      if (!element) continue;
      if (element instanceof RadioNodeList) element.value = value ?? '';
      else if (element.type === 'checkbox') element.checked = Boolean(value);
      else element.value = value ?? '';
    }
  }
}

function updateCompletion() {
  const elements = [...form.elements].filter((element, index, all) => element.name && (element.type !== 'radio' || all.findIndex((candidate) => candidate.name === element.name) === index));
  const filled = elements.filter((element) => {
    if (element.type === 'checkbox') return element.checked;
    if (element.type === 'radio') return Boolean(form.elements.namedItem(element.name).value);
    return element.value.trim() && !['not-started'].includes(element.value);
  }).length;
  completion.textContent = `${filled} field${filled === 1 ? '' : 's'} filled`;
}

function statusCounts(progress) {
  const tasks = progress.workstreams.flatMap((stream) => stream.tasks);
  return { done: tasks.filter((task) => task.status === 'done').length, total: tasks.length };
}

function renderProgress(progress) {
  const counts = statusCounts(progress);
  const percent = Math.round(counts.done / counts.total * 100);
  document.querySelector('#overall-percent').textContent = `${percent}%`;
  document.querySelector('#overall-meter').value = percent;
  document.querySelector('#overall-count').textContent = `${counts.done} of ${counts.total} tracked tasks complete`;
  document.querySelector('#last-verified').textContent = `Last verified ${progress.lastVerified}`;
  const grid = document.querySelector('#progress-grid');
  grid.replaceChildren(...progress.workstreams.map((stream) => {
    const done = stream.tasks.filter((task) => task.status === 'done').length;
    const value = Math.round(done / stream.tasks.length * 100);
    const article = document.createElement('article');
    article.className = 'progress-item';
    article.innerHTML = `<div><strong></strong><span>${value}%</span></div><progress class="meter" max="100" value="${value}">${value}%</progress><small>${done}/${stream.tasks.length} complete</small>`;
    article.querySelector('strong').textContent = stream.name;
    return article;
  }));
}

function renderTasks(selector, tasks) {
  const list = document.querySelector(selector);
  list.replaceChildren(...tasks.map((task) => {
    const item = document.createElement('li');
    item.textContent = task;
    return item;
  }));
}

async function bootstrap() {
  try {
    const response = await fetch('/api/bootstrap');
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const value = await response.json();
    renderProgress(value.progress);
    renderTasks('#agent-tasks', value.agentTasks);
    renderTasks('#human-tasks', value.humanTasks);
    savePath.textContent = value.savePath;
    if (value.handoff?.fields) {
      populate(value.handoff.fields);
      saveState.textContent = `Loaded save from ${new Date(value.handoff.savedAt).toLocaleString()}`;
      saveState.className = 'success';
    }
    updateCompletion();
  } catch (error) {
    saveState.textContent = 'Dashboard server is unavailable';
    saveState.className = 'error';
    savePath.textContent = `Run npm run handoff from the repository. ${error.message}`;
  }
}

async function save() {
  saveButton.disabled = true;
  saveState.textContent = 'Saving private handoff…';
  saveState.className = '';
  try {
    const response = await fetch('/api/handoff', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ version: 1, fields: formFields() })
    });
    const value = await response.json();
    if (!response.ok) throw new Error(value.message || value.error || `HTTP ${response.status}`);
    saveState.textContent = `Saved for Codex · ${new Date(value.savedAt).toLocaleTimeString()}`;
    saveState.className = 'success';
    savePath.textContent = value.savePath;
  } catch (error) {
    saveState.textContent = 'Save failed';
    saveState.className = 'error';
    savePath.textContent = error.message;
  } finally { saveButton.disabled = false; }
}

form.addEventListener('submit', (event) => { event.preventDefault(); save(); });
form.addEventListener('input', updateCompletion);
form.addEventListener('change', updateCompletion);
downloadButton.addEventListener('click', () => {
  const data = JSON.stringify({ version: 1, exportedAt: new Date().toISOString(), fields: formFields() }, null, 2);
  const anchor = document.createElement('a');
  anchor.href = URL.createObjectURL(new Blob([data], { type: 'application/json' }));
  anchor.download = 'launch-studio-handoff.json';
  anchor.click();
  URL.revokeObjectURL(anchor.href);
});

bootstrap();

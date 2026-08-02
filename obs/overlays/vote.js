const params = new URLSearchParams(location.search);
const showId = params.get('showId') || 'show-001';
const protocol = location.protocol === 'https:' ? 'wss:' : 'ws:';
const statusElement = document.querySelector('#status');
const questionElement = document.querySelector('#question');
const optionsElement = document.querySelector('#options');
const connectionElement = document.querySelector('#connection');
let state = { counts: {} };
let retryTimer;

function render() {
  if (!state.poll) return;
  questionElement.textContent = state.poll.question;
  statusElement.textContent = state.poll.status === 'closed' ? 'VERIFIED RESULT' : 'VOTING OPEN';
  const total = Object.values(state.counts).reduce((sum, count) => sum + Number(count), 0) || 1;
  optionsElement.replaceChildren(...state.poll.options.map((option) => {
    const count = Number(state.counts[option.id] || 0);
    const card = document.createElement('article');
    card.className = 'option';
    const title = document.createElement('div');
    title.className = 'option-title';
    const label = document.createElement('span');
    label.textContent = option.label;
    const number = document.createElement('b');
    number.textContent = String(count);
    title.append(label, number);
    const bar = document.createElement('progress');
    bar.className = 'bar';
    bar.max = total;
    bar.value = Math.max(0, Math.min(total, count));
    bar.textContent = `${Math.round(count / total * 100)}%`;
    card.append(title, bar);
    return card;
  }));
}

function connect() {
  clearTimeout(retryTimer);
  const socket = new WebSocket(`${protocol}//${location.host}/api/live/${encodeURIComponent(showId)}/socket`);
  connectionElement.textContent = 'CONNECTING TO THE CLUB FEED';
  connectionElement.className = 'connection';
  socket.addEventListener('open', () => {
    connectionElement.textContent = 'CLUB FEED CONNECTED';
    connectionElement.className = 'connection ready';
  });
  socket.addEventListener('message', (event) => {
    try {
      const message = JSON.parse(event.data);
      state = message.state || { ...state, ...message };
      render();
    } catch {
      connectionElement.textContent = 'IGNORED MALFORMED OVERLAY EVENT';
      connectionElement.className = 'connection retrying';
    }
  });
  socket.addEventListener('close', () => {
    connectionElement.textContent = 'RECONNECTING TO THE CLUB FEED';
    connectionElement.className = 'connection retrying';
    retryTimer = setTimeout(connect, 1500);
  });
}

connect();

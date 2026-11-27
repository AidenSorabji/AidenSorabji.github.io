const frame = document.querySelector('#soundcloud-player');
const title = document.querySelector('.audio-title');
let widget;
let playerReady = false;
let requestedPlayback = sessionStorage.getItem('aiden-music-state') !== 'paused';

// Shared Y2K UI sounds. Lower volumes keep them as interface feedback, not music.
const effects = Object.fromEntries(Object.entries({
  hover: 'sound-effects/hover.mp3',
  select: 'sound-effects/select.mp3',
  selectProject: 'sound-effects/select1.mp3',
  sectionSwitch: 'sound-effects/sectionSwitch.mp3',
  playPause: 'sound-effects/playPause.mp3'
}).map(([name, source]) => {
  const sound = new Audio(source);
  sound.preload = 'auto';
  sound.volume = name === 'sectionSwitch' ? 0.28 : 0.2;
  return [name, sound];
}));
let lastHoverSound = 0;

function playEffect(name) {
  const sound = effects[name];
  if (!sound) return;
  if (name === 'hover') {
    const now = performance.now();
    if (now - lastHoverSound < 75) return;
    lastHoverSound = now;
  }
  sound.pause();
  sound.currentTime = 0;
  sound.play().catch(() => {});
}

// Live Server can enforce iframe autoplay differently than a direct file preview.
// Request that permission explicitly and start the SoundCloud embed in autoplay mode.
if (frame) {
  const playerUrl = new URL(frame.src);
  playerUrl.searchParams.set('auto_play', 'true');
  frame.setAttribute('allow', 'autoplay');
  frame.src = playerUrl.toString();
}

function setPlayState(isPlaying) {
  requestedPlayback = isPlaying;
  sessionStorage.setItem('aiden-music-state', isPlaying ? 'playing' : 'paused');
  document.body.classList.toggle('music-playing', isPlaying);
  document.querySelectorAll('.play').forEach((button) => { button.textContent = isPlaying ? 'Ⅱ' : '▶'; });
}

function shuffleAndPlay() {
  if (!widget || !playerReady) return;
  widget.getSounds((sounds) => {
    if (sounds?.length) widget.skip(Math.floor(Math.random() * sounds.length));
    widget.play();
  });
}

if (frame && window.SC) {
  widget = SC.Widget(frame);
  widget.bind(SC.Widget.Events.READY, () => {
    playerReady = true;
    if (requestedPlayback) shuffleAndPlay();
    widget.bind(SC.Widget.Events.PLAY, () => setPlayState(true));
    widget.bind(SC.Widget.Events.PAUSE, () => setPlayState(false));
    widget.bind(SC.Widget.Events.FINISH, shuffleAndPlay);
    widget.bind(SC.Widget.Events.PLAY_PROGRESS, () => widget.getCurrentSound((sound) => {
      const currentTitle = document.querySelector('.audio-title');
      if (sound && currentTitle) currentTitle.innerHTML = `${sound.title}<span>${sound.user.username}</span>`;
    }));
  });
}

function bindPageControls() {
  const staticButton = document.querySelector('.static-toggle');
  const playButton = document.querySelector('.play');
  const audioControl = document.querySelector('.audio-control');
  const staticIsOff = sessionStorage.getItem('aiden-static') === 'off';
  document.body.classList.toggle('no-static', staticIsOff);
  document.body.classList.toggle('music-playing', requestedPlayback);
  if (audioControl && !audioControl.querySelector('.visualizer')) {
    const visualizer = document.createElement('span');
    visualizer.className = 'visualizer';
    visualizer.setAttribute('aria-hidden', 'true');
    visualizer.innerHTML = '<i></i><i></i><i></i><i></i><i></i>';
    audioControl.prepend(visualizer);
  }
  if (playButton) playButton.textContent = requestedPlayback ? 'Ⅱ' : '▶';
  if (staticButton) {
    staticButton.setAttribute('aria-pressed', String(!staticIsOff));
    staticButton.setAttribute('aria-label', 'Toggle CRT scanlines');
    staticButton.innerHTML = '<span class="switch-track" aria-hidden="true"><i></i></span><span class="switch-label">CRT</span>';
    staticButton.addEventListener('click', () => {
      const disabled = document.body.classList.toggle('no-static');
      sessionStorage.setItem('aiden-static', disabled ? 'off' : 'on');
      staticButton.setAttribute('aria-pressed', String(!disabled));
      document.body.classList.remove('crt-degauss');
      void document.body.offsetWidth;
      document.body.classList.add('crt-degauss');
      window.setTimeout(() => document.body.classList.remove('crt-degauss'), 470);
    });
  }
  playButton?.addEventListener('click', () => {
    playEffect('playPause');
    if (!playerReady) { setPlayState(true); return; }
    if (requestedPlayback) widget.pause();
    else shuffleAndPlay();
  });
  document.querySelectorAll('button, .nav-link, .action, .project-card, .contact-card').forEach((item) => {
    if (item.dataset.sfxBound) return;
    item.dataset.sfxBound = 'true';
    item.addEventListener('pointerenter', () => playEffect('hover'));
    item.addEventListener('click', () => {
      if (item.classList.contains('play')) return;
      playEffect(item.classList.contains('project-card') || item.classList.contains('static-toggle') ? 'selectProject' : 'select');
    });
  });
  loadCaseFile();
}

function loadCaseFile() {
  const caseId = new URLSearchParams(location.search).get('case');
  const files = {
    'asl-keyboard': ['01', 'cvv.ASL-Keyboard', 'ASL to simulated keyboard presses within macOS.', 'A macOS accessibility experiment that converts American Sign Language gestures into simulated keyboard input.', 'Python / OpenCV'],
    macgpt: ['02', 'MacGPT', 'Java application to interact visually with the built-in LLMs in macOS 26+.', 'A visual Java interface for exploring the built-in language-model capabilities in modern macOS.', 'Java / macOS'],
    'face-detection': ['03', 'cv.Face Detection', 'Basic facial recognition in Python using OpenCV.', 'An OpenCV project exploring real-time face detection, computer vision fundamentals, and camera input.', 'Python / OpenCV'],
    portfolio: ['04', 'aidensorabji.github.io', 'My website, built with HTML, CSS, and JavaScript.', 'A Y2K-inspired portfolio system that turns projects, skills, and contact details into a cohesive digital archive.', 'HTML / CSS / JavaScript'],
    'future-one': ['05', 'Future module', 'Reserved bandwidth for the next idea that refuses to stay in the notes app.', 'This case file is ready for the next experiment. Replace this copy with its purpose, build process, and result.', 'In development'],
    'future-two': ['06', 'Future module', 'Reserved bandwidth for the next idea that refuses to stay in the notes app.', 'This case file is ready for the next experiment. Replace this copy with its purpose, build process, and result.', 'In development']
  };
  const file = files[caseId];
  if (!file || !document.querySelector('.hero-copy')) return;
  const [number, name, intro, summary, stack] = file;
  document.title = `Aiden / ${name}`;
  document.querySelector('.hero-copy').innerHTML = `<div class="eyebrow">// CASE FILE / ${number}</div><h1>${name}</h1><p>${intro}</p>`;
  const detail = document.querySelector('.about-copy p');
  if (detail) detail.textContent = summary;
  const stackLabel = [...document.querySelectorAll('.spec span:first-child')].find((item) => item.textContent.trim() === 'stack');
  if (stackLabel?.nextElementSibling) stackLabel.nextElementSibling.textContent = stack;
}

async function navigate(url, push = true) {
  playEffect('sectionSwitch');
  document.body.classList.add('page-leaving');
  await new Promise((resolve) => window.setTimeout(resolve, 260));
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Could not load page');
    const nextDocument = new DOMParser().parseFromString(await response.text(), 'text/html');
    const nextMain = nextDocument.querySelector('main.shell');
    if (!nextMain) throw new Error('Portfolio shell missing');
    document.querySelector('main.shell').replaceWith(nextMain);
    nextMain.classList.add('page-entering');
    document.title = nextDocument.title;
    if (push) history.pushState({}, '', url);
    window.scrollTo(0, 0);
    bindPageControls();
    document.body.classList.remove('page-leaving');
    window.setTimeout(() => nextMain.classList.remove('page-entering'), 340);
  } catch (error) {
    window.location.href = url;
  }
}

document.addEventListener('click', (event) => {
  const link = event.target.closest('a[href*=".html"]');
  if (!link || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  event.preventDefault();
  navigate(link.href);
});
window.addEventListener('popstate', () => navigate(location.href, false));
bindPageControls();

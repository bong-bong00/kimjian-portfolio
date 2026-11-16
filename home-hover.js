// Keep the same original Flutter home mounted at rest and during hover.
// Hover sends only a replay signal; it never swaps the screen or app state.
const homes = {
  ploggo: {src: 'previews/ploggo/index.html', title: 'Ploggo 원본 홈 화면'},
  alkong: {src: 'previews/alkong/index.html', title: '알콩약콩 원본 홈 화면'}
};
for (const [key, config] of Object.entries(homes)) {
  const link = document.querySelector(`.${key} .work-image`);
  if (!link || location.protocol === 'file:') continue;
  const screen = document.createElement('span');
  screen.className = `live-home-screen live-home-${key}`;
  screen.setAttribute('aria-hidden', 'true');
  const frame = document.createElement('iframe');
  frame.title = config.title;
  frame.tabIndex = -1;
  frame.setAttribute('inert', '');
  frame.setAttribute('aria-hidden', 'true');
  screen.append(frame);
  (key === 'alkong' ? link.querySelector('.alkong-device') : link).append(screen);
  let ready = false;
  let hovered = false;
  let focused = false;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const send = type => { if (ready) frame.contentWindow?.postMessage({type}, location.origin); };
  const resize = () => {
    const scale = screen.getBoundingClientRect().width / 390;
    frame.style.width = '390px';
    frame.style.height = `${key === 'ploggo' ? screen.getBoundingClientRect().height / scale : 844}px`;
    frame.style.transform = `scale(${scale})`;
  };
  new ResizeObserver(resize).observe(screen);
  window.addEventListener('message', event => {
    if (event.origin !== location.origin || event.source !== frame.contentWindow) return;
    if (event.data?.type !== 'flutter-home-ready') return;
    ready = true;
    screen.classList.add('ready');
    if (key === 'alkong') link.querySelector('.alkong-device')?.classList.add('live-ready');
    if ((hovered || focused) && !reduced.matches) send('play-home');
  });
  link.addEventListener('pointerenter', event => {
    if (event.pointerType === 'touch') return;
    hovered = true;
    if (!reduced.matches) send('play-home');
  });
  link.addEventListener('pointerleave', () => { hovered = false; if (!focused) send('stop-home'); });
  link.addEventListener('focus', () => { focused = true; if (!reduced.matches) send('play-home'); });
  link.addEventListener('blur', () => {
    setTimeout(() => {
      if (document.activeElement === frame) return;
      focused = false;
      if (!hovered) send('stop-home');
    }, 0);
  });
  frame.src = config.src;
  resize();
}

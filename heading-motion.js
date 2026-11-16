// Keep section labels still; ring only their pictograms on downward entry.
if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const headings = [...document.querySelectorAll('#projects > .sh h2, #approach > .sh h2, #awards > .sh h2')];
  let previousY = window.scrollY;
  let queued = false;
  const armed = new Set(headings);
  const animations = new Map();
  // 맨 아래까지 내렸을 때 윗변이 화면 가운데(50%)까지 올라오는 제목은 50%에서,
  // 페이지 끝이라 못 올라오는 제목(#awards 등)은 화면 80% 지점에서 흔든다.
  const lines = new Map();
  const measure = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    for (const heading of headings) {
      const top = heading.getBoundingClientRect().top + window.scrollY;
      lines.set(heading, top - max <= window.innerHeight * .6 ? .6 : .8);
    }
  };
  measure();
  window.__triggerLines = headings.map(el => ({el, get l() { return lines.get(el); }}));   // 점검용
  const update = (initial = false) => {
    const currentY = window.scrollY;
    const downward = initial || currentY > previousY;
    // 윗변이 시작 선(보통 화면 가운데 50%, 끝부분은 80%)에 닿아야 흔든다. 그래도 못 닿으면 바닥에서 흔든다.
    const atBottom = window.innerHeight + currentY >= document.documentElement.scrollHeight - 4;
    for (const heading of headings) {
      const rect = heading.getBoundingClientRect();
      if (rect.top >= window.innerHeight * lines.get(heading) && !(atBottom && rect.top < window.innerHeight)) {
        armed.add(heading);
      } else if (downward && rect.bottom > 0 && armed.has(heading) && !(initial && heading.closest('#projects'))) {
        const icon = heading.querySelector('.section-pictogram');
        armed.delete(heading);
        if (!icon) continue;
        animations.get(heading)?.cancel();
        animations.set(heading, icon.animate([
          {transform:'rotate(0deg)'},
          {transform:'rotate(-16deg)',offset:.15},
          {transform:'rotate(14deg)',offset:.3},
          {transform:'rotate(-19deg)',offset:.45},
          {transform:'rotate(9deg)',offset:.6},
          {transform:'rotate(-5deg)',offset:.75},
          {transform:'rotate(0deg)'}
        ], {duration:1500,easing:'ease-in-out'}));
      }
    }
    previousY = currentY;
    queued = false;
  };
  update(true);
  window.addEventListener('scroll', () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => update());
  }, {passive: true});
  window.addEventListener('resize', () => { measure(); update(); });
  window.addEventListener('load', () => { measure(); update(); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { measure(); });
}

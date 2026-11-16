// 지금 보고 있는 섹션의 메뉴를 진하게 표시한다.
(() => {
  const links = [...document.querySelectorAll('.nav nav a[href^="#"]')];
  const targets = links.map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);
  if (!targets.length) return;
  let ticking = false;
  function update() {
    ticking = false;
    const line = innerHeight * 0.35;
    let current = null;
    for (const t of targets) if (t.getBoundingClientRect().top <= line) current = t;
    // 맨 아래에 닿으면 마지막 섹션
    if (innerHeight + scrollY >= document.documentElement.scrollHeight - 4) current = targets[targets.length - 1];
    links.forEach(a => {
      const on = current && a.getAttribute('href') === '#' + current.id;
      a.classList.toggle('is-current', !!on);
      if (on) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
    });
  }
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  addEventListener('resize', update);
  update();
})();

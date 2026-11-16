// Reveal complete Hangul characters without shifting the centered lines.
const introTitle = document.querySelector('.intro h1');
if (introTitle && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  let characterIndex = 0;
  const interval = 95;
  introTitle.querySelectorAll('.intro-line').forEach(line => {
    const text = line.textContent;
    line.setAttribute('aria-label', text);
    const characters = Array.from(text, character => {
      const span = document.createElement('span');
      span.className = 'intro-character';
      span.setAttribute('aria-hidden', 'true');
      span.textContent = character;
      span.style.setProperty('--character-delay', `${300 + characterIndex * interval}ms`);
      characterIndex++;
      return span;
    });
    line.replaceChildren(...characters);
    characterIndex += 3;
  });
  introTitle.classList.add('intro-typing');
}

// 글자 타이핑이 끝난 뒤 글 뒤로 물감이 번지기 시작한다.
(() => {
  const glow = document.querySelector('.intro-glow');
  if (!glow) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) { glow.classList.add('static'); return; }
  const chars = document.querySelectorAll('.intro h1 .intro-character');
  let end = 0;
  chars.forEach(c => { end = Math.max(end, parseFloat(c.style.getPropertyValue('--character-delay')) || 0); });
  setTimeout(() => glow.classList.add('bloom'), end + 100);
})();

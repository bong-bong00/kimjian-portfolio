// Draw a fresh trace from left to right; existing samples never move.
(() => {
  const link = document.querySelector('.alkong .work-image');
  const path = link?.querySelector('.alkong-heartbeat path');
  if (!path) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let frame = null, start = null, hover = false, focus = false;
  // Deliberate P wave, sharp QRS, rounded T wave, and a quiet baseline.
  const knots = [[0,0],[.12,0],[.16,-.12],[.20,0],[.29,0],[.325,.15],[.365,-.90],[.405,.43],[.445,-.035],[.48,0],[.55,0],[.62,-.23],[.70,0],[1,0]];
  function signal(phase) {
    for (let i=1;i<knots.length;i++) {
      if (phase<=knots[i][0]) {
        const [x0,y0]=knots[i-1], [x1,y1]=knots[i];
        let t=(phase-x0)/(x1-x0);
        // Retain crisp straight edges around QRS; soften only the small waves.
        if (phase<.29 || phase>.48) t=t*t*(3-2*t);
        return y0+(y1-y0)*t;
      }
    }
    return 0;
  }
  function draw(now) {
    if (start === null) start = now;
    const elapsed = now - start;
    const duration = 3200;
    const hold = 500;
    const cycle = duration + hold;
    const local = elapsed % cycle;
    const progress = Math.min(1, local / duration);
    // Phone occupies 64.05%..93.4% of the thumbnail; the SVG starts at 43%.
    const hiddenStart = (64.05 - 43) / 57 * 240;
    const hiddenEnd = (93.4 - 43) / 57 * 240;
    const visibleWidth = hiddenStart + (240 - hiddenEnd);
    const distance = progress * visibleWidth;
    const head = distance <= hiddenStart ? distance : hiddenEnd + distance - hiddenStart;
    const phaseAt = x => x >= hiddenEnd ? .26 + (x-hiddenEnd)/80 : (x/120)%1;
    let d = '';
    // Sample locations stay fixed: only reveal new ink at the moving pen tip.
    for (let x=0; x<=head; x+=.6) {
      const phase = phaseAt(x);
      const y = 65 + signal(phase)*43;
      d += (x ? ' L' : 'M') + x.toFixed(2) + ' ' + y.toFixed(2);
    }
    const tipY = 65 + signal(phaseAt(head))*43;
    d += ' L' + head.toFixed(2) + ' ' + tipY.toFixed(2);
    path.setAttribute('d', d);
    frame = requestAnimationFrame(draw);
  }
  function update() {
    cancelAnimationFrame(frame); frame=null;
    if ((hover||focus) && !reduced.matches) { start=null; frame=requestAnimationFrame(draw); }
    else { path.setAttribute('d','M0 65'); }
  }
  link.addEventListener('pointerenter',e=>{if(e.pointerType==='touch')return;hover=true;update();});
  link.addEventListener('pointerleave',()=>{hover=false;update();});
  link.addEventListener('focus',()=>{focus=true;update();});
  link.addEventListener('blur',()=>{focus=false;update();});
  reduced.addEventListener('change',update);
})();

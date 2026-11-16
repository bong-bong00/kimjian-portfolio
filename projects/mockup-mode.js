if (new URLSearchParams(location.search).has('mockup')) {
  const isPloggo = location.pathname.includes('ploggo');
  const target = document.querySelector(isPloggo ? '#reward .phone' : '#heart .phone');
  if (target) {
    const stage = document.createElement('main');
    stage.className = 'standalone-mockup';
    stage.append(target);
    document.body.querySelectorAll('style,link[rel="stylesheet"]').forEach(style => document.head.append(style));
    document.body.replaceChildren(stage);
    const style = document.createElement('style');
    style.textContent = `
      html,body{margin:0!important;padding:0!important;min-height:100%;background:#f5f7fa!important;overflow-x:hidden}
      body::before,body::after{display:none!important}
      .standalone-mockup{min-height:100vh;display:flex;justify-content:center;align-items:center;padding:24px;box-sizing:border-box}
      .standalone-mockup>.phone{width:260px!important;max-width:90vw!important;margin:0!important;flex-shrink:0;opacity:1!important;transform:none!important}
      @media(min-height:700px){.standalone-mockup>.phone{width:290px!important}}
      @media(max-height:540px){.standalone-mockup>.phone{width:210px!important}}
    `;
    document.head.append(style);
  }
}

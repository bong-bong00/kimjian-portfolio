// Web reimplementation of animations in the app repositories, not the landing pages.
// Source paths and timing values are documented in ANIMATION_SOURCES.md.
const project = new URLSearchParams(location.search).get('project');
const app = document.querySelector('#app');
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
let timers = [];
let raf;
function resetTimers(){timers.forEach(clearTimeout);timers=[];cancelAnimationFrame(raf);}
function ploggo(){
  document.querySelector('.phone').classList.remove('alkong');
  app.innerHTML = `<div class="app-body"><div class="location"><span>인천 부평구</span><span>맑음 · 21°</span></div><div class="greeting"><div class="ready">READY</div><h1>오늘도 가볍게,<br><mark>플로깅</mark> 해볼까요?</h1><img class="mascot" src="assets/ploggo/ploggo_1.png" alt="플로고 캐릭터"></div><div class="ticker"><b>뉴스</b><div class="ticker-window"><span class="ticker-line">우리 동네 환경 소식을 확인해 보세요</span></div></div><section class="impact"><div class="impact-blob"></div><h2>나의 환경 영향력</h2><div class="impact-content"><div class="gauge"><div>연간 목표<strong><span class="ratio">0</span>%</strong></div></div><div class="impact-values">온실가스 감축<br><strong>6.6</strong> kgCO₂eq<br>소나무 <strong>1.0</strong> 그루 효과</div></div></section><button type="button" class="start-card">지금 바로 시작합시다!<span>가볍게 걷고, 함께 줍고</span></button></div><nav class="bottom-nav"><span class="active">홈</span><span>내 활동</span><span>그룹</span><span>내 정보</span></nav>`;
  const gauge = app.querySelector('.gauge');
  const number = app.querySelector('.ratio');
  const start = performance.now();
  const draw = now => {
    const t = reduce ? 1 : Math.min(1,(now-start)/1250);
    const eased = t<.5 ? 4*t*t*t : 1-Math.pow(-2*t+2,3)/2;
    gauge.style.setProperty('--progress', `${eased*66}%`);
    number.textContent=Math.round(eased*66);
    if(t<1) raf=requestAnimationFrame(draw);
  };
  raf=requestAnimationFrame(draw);
  const headlines=['우리 동네 환경 소식을 확인해 보세요','함께 걷고 줍는 플로깅 이야기','생활 속 자원순환 소식을 만나보세요'];
  let index=0;
  const roll=()=>{
    const window=app.querySelector('.ticker-window');
    const old=window.firstElementChild;
    const next=document.createElement('span');next.className='ticker-line';next.textContent=headlines[(++index)%headlines.length];window.append(next);
    if(!reduce){old.animate([{transform:'translateY(0)'},{transform:'translateY(-21px)'}],{duration:560,easing:'ease-in-out',fill:'forwards'});next.animate([{transform:'translateY(21px)'},{transform:'translateY(0)'}],{duration:560,easing:'ease-in-out',fill:'forwards'});}
    timers.push(setTimeout(()=>{old.remove();timers.push(setTimeout(roll,3200));},560));
  };
  timers.push(setTimeout(roll,3200));
  app.querySelector('.start-card').addEventListener('click',render);
}
function alkong(){
  document.querySelector('.phone').classList.add('alkong');
  app.innerHTML=`<div class="app-body"><div class="date">10월 2일 금요일</div><div class="patient">김복자 님</div><h1 class="dose-title">오늘 드실 약이 <b>1번 남았어요</b></h1><div class="slots"><div class="slot first">아침<small>08:04</small></div><div class="slot">점심<small>없음</small></div><div class="slot last">저녁<small>미복용</small></div></div><p class="dose-hint">어느 때 약인지 고르고 복용 완료를 누르세요</p><div class="dose-area"><button class="dose-button" type="button"><span>✓</span>복용 완료</button></div><div class="dose-actions"><div><b>◷</b>18:00</div><div><b>♡</b>센서 연결</div></div><div class="prescription">처방약이 12일분 남았어요</div></div><nav class="bottom-nav"><span class="active">오늘</span><span>기록</span><span>내 정보</span></nav>`;
  const button=app.querySelector('.dose-button');
  button.addEventListener('click',()=>{
    const done=button.classList.toggle('done');
    button.innerHTML=done?'취소하기':'<span>✓</span>복용 완료';
    app.querySelector('.dose-title').textContent=done?'오늘 드실 약을 다 드셨어요':'오늘 드실 약이 1번 남았어요';
    app.querySelector('.slot.last small').textContent=done?'복용 완료':'미복용';
  });
}
function render(){resetTimers();project==='alkong'?alkong():ploggo();}
document.querySelector('.replay').addEventListener('click',render);
render();

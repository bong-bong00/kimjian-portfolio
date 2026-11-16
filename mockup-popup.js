const modal = document.querySelector('.mockup-dialog');
const frame = modal.querySelector('iframe');
const closeButton = modal.querySelector('.mockup-close');
let opener;
const previews = {
  ploggo: {title: 'Ploggo', description: '홈 캐릭터 진입 · 뉴스 롤링 · 환경 영향력 게이지'},
  alkong: {title: '알콩약콩', description: '복용 버튼의 두 번 뛰는 펄스 · 완료 시 멈춤'}
};
document.addEventListener('click', event => {
  const link = event.target.closest('[data-mockup]');
  if (!link || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
  event.preventDefault();
  opener = link;
  const info = previews[link.dataset.mockup];
  modal.querySelector('h2').textContent = info.title;
  modal.querySelector('.mockup-description').textContent = info.description;
  modal.querySelector('.mockup-detail').href = link.getAttribute('href');
  frame.title = `${info.title} 목업 애니메이션`;
  frame.src = `mockups.html?project=${link.dataset.mockup}`;
  document.body.style.overflow = 'hidden';
  modal.showModal();
  closeButton.focus();
});
closeButton.addEventListener('click', () => modal.close());
modal.addEventListener('click', event => {
  if (event.target !== modal) return;
  const box = modal.getBoundingClientRect();
  if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) modal.close();
});
modal.addEventListener('close', () => {
  frame.removeAttribute('src');
  document.body.style.overflow = '';
  opener?.focus({preventScroll:true});
});

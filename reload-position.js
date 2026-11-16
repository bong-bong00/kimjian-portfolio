// A refresh starts at the introduction, even after section navigation.
const startEveryVisitAtTop = document.currentScript?.dataset.start === 'top';
if (startEveryVisitAtTop || performance.getEntriesByType('navigation')[0]?.type === 'reload') {
  history.scrollRestoration = 'manual';
  if (location.hash) {
    history.replaceState(history.state, '', location.pathname + location.search);
  }
  window.scrollTo({top: 0, left: 0, behavior: 'instant'});
  window.addEventListener('pageshow', event => {
    if (startEveryVisitAtTop || !event.persisted) window.scrollTo({top: 0, left: 0, behavior: 'instant'});
  });
}

// Keep the original raster fixed; animate only a crisp outline around the window.
const jobmoaCard = document.querySelector('.jobmoa .work-image');
if (jobmoaCard) {
  const fx = document.createElement('div');
  fx.className = 'jm-fx';
  fx.setAttribute('aria-hidden', 'true');
  fx.innerHTML = '<span class="jm-frame"></span>';
  jobmoaCard.append(fx);
}

(function(){
  const slides = Array.from(document.querySelectorAll('.slide'));
  const total = slides.length;
  const page = document.body.dataset.page;
  const prevHref = document.body.dataset.prev;
  const nextHref = document.body.dataset.next;
  let idx = location.hash === '#last' ? total - 1 : 0;

  const dotsWrap = document.getElementById('navDots');
  const progressFill = document.getElementById('progressFill');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const curNum = document.getElementById('curNum');
  const totNum = document.getElementById('totNum');
  const countEl = document.querySelector('.slide-count');
  const blobA = document.getElementById('blobA'), blobB = document.getElementById('blobB'), blobC = document.getElementById('blobC');

  slides.forEach((_, i) => {
    const el = document.createElement('button'); el.className = 'dot';
    el.setAttribute('aria-label', 'Go to slide ' + (i + 1));
    el.addEventListener('click', () => go(i));
    dotsWrap.appendChild(el);
  });

  function replay(sel){
    slides[idx].querySelectorAll(sel).forEach(el => {
      el.style.width = '0%'; const w = el.getAttribute('data-w');
      requestAnimationFrame(() => requestAnimationFrame(() => { el.style.width = w + '%'; }));
    });
  }
  function playTower(){
    const hero = slides[idx].querySelector('.tw-hero');
    if (hero) { hero.classList.remove('on'); hero.getBoundingClientRect(); setTimeout(() => hero.classList.add('on'), 80); }
  }
  function render(){
    slides.forEach((s, i) => s.classList.toggle('active', i === idx));
    Array.from(dotsWrap.children).forEach((el, i) => el.classList.toggle('on', i === idx));
    progressFill.style.width = ((idx + 1) / total * 100) + '%';
    countEl.style.visibility = page === 'hub' ? 'hidden' : 'visible';
    curNum.textContent = idx + 1; totNum.textContent = total;
    prevBtn.disabled = idx === 0 && !prevHref;
    nextBtn.disabled = idx === total - 1 && !nextHref;
    const t = total > 1 ? idx / (total - 1) : 0;
    blobA.style.transform = `translate(${t*40}px, ${t*-30}px)`;
    blobB.style.transform = `translate(${t*-30}px, ${t*20}px)`;
    blobC.style.transform = `translate(${t*-50}px, ${t*30}px)`;
    playTower();
    if (slides[idx].querySelector('.ladder-fill')) replay('.ladder-fill');
    if (slides[idx].querySelector('.sal-fill')) replay('.sal-fill');
  }
  function go(i){
    if (i >= total) { if (nextHref) location.href = nextHref; return; }
    if (i < 0) { if (prevHref) location.href = prevHref + '#last'; return; }
    idx = i; render();
  }
  prevBtn.addEventListener('click', () => go(idx - 1));
  nextBtn.addEventListener('click', () => go(idx + 1));
  window.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight' || e.key === 'PageDown') go(idx + 1);
    if (e.key === 'ArrowLeft' || e.key === 'PageUp') go(idx - 1);
  });
  let touchStartX = null;
  window.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  window.addEventListener('touchend', e => {
    if (touchStartX === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 50) go(dx < 0 ? idx + 1 : idx - 1);
    touchStartX = null;
  }, { passive: true });
  document.addEventListener('click', e => {
    if (e.target.classList && e.target.classList.contains('org-zoom') || e.target.id === 'orgImg') {
      const z = e.target.style.width !== '100%';
      e.target.style.width = z ? '100%' : '260%';
      e.target.style.cursor = z ? 'zoom-in' : 'zoom-out';
    }
  });
  render();
})();

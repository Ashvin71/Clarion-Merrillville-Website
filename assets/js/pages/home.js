(() => {
  const slides=[...document.querySelectorAll('.hero-slide')]; if(!slides.length) return;
  let i=0, timer;
  const dots=document.querySelector('.hero-dots');
  slides.forEach((_,n)=>dots.insertAdjacentHTML('beforeend',`<button type="button" aria-label="Show hero slide ${n+1}" ${n===0?'aria-current="true"':''}></button>`));
  const show=n=>{slides[i].classList.remove('active'); dots.children[i].removeAttribute('aria-current'); i=(n+slides.length)%slides.length; slides[i].classList.add('active'); dots.children[i].setAttribute('aria-current','true');};
  const start=()=>{ if(!matchMedia('(prefers-reduced-motion: reduce)').matches) timer=setInterval(()=>show(i+1),6500); };
  dots.addEventListener('click',e=>{const n=[...dots.children].indexOf(e.target);if(n>=0){clearInterval(timer);show(n);start();}}); start();
})();


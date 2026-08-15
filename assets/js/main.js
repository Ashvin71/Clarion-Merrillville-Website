(() => {
  'use strict';
  const root = document.documentElement;
  const base = document.body.dataset.root || '';
  const cfg = HOTEL_CONFIG;
  const page = document.body.dataset.page || '';
  const nav = [
    ['Home','index.html','home'],['Rooms','rooms.html','rooms'],['Amenities','amenities.html','amenities'],
    ['Gallery','gallery.html','gallery'],['Things To Do','things-to-do.html','things'],
    ['Groups & Meetings','groups-meetings.html','groups'],['About','about.html','about'],['Contact','contact.html','contact']
  ];
  const href = f => `${base}${f}`;
  const phoneHref = `tel:${cfg.phoneLink}`;
  const mailHref = `mailto:${cfg.email}`;

  const header = document.querySelector('[data-site-header]');
  if (header) header.innerHTML = `
    <div class="announcement">Now welcoming guests as Clarion Inn Merrillville <span aria-hidden="true">•</span> Reservations: <a href="${phoneHref}">${cfg.phoneDisplay}</a></div>
    <header class="site-header"><div class="header-inner">
      <a class="brand" href="${href('index.html')}" aria-label="Clarion Inn Merrillville home"><span>CLARION</span><small>INN · MERRILLVILLE</small></a>
      <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="site-nav"><span></span><span></span><span></span><b class="sr-only">Menu</b></button>
      <nav id="site-nav" class="site-nav" aria-label="Primary navigation">${nav.map(([label,file,key]) => `<a href="${href(file)}"${page===key?' aria-current="page"':''}>${label}</a>`).join('')}</nav>
      <div class="header-actions"><a class="header-phone" href="${phoneHref}">${cfg.phoneDisplay}</a><button class="button button-primary booking-trigger" type="button">Book Now</button></div>
    </div></header>`;

  const footer = document.querySelector('[data-site-footer]');
  if (footer) footer.innerHTML = `
    <footer class="site-footer"><div class="footer-grid wrap">
      <div><a class="brand brand-light" href="${href('index.html')}"><span>CLARION</span><small>INN · MERRILLVILLE</small></a><address>${cfg.address.replace(', Merrillville', '<br>Merrillville')}</address><a href="${phoneHref}">${cfg.phoneDisplay}</a><a href="${mailHref}">${cfg.email}</a></div>
      <div><h2>Explore</h2>${nav.slice(1,5).map(([l,f])=>`<a href="${href(f)}">${l}</a>`).join('')}</div>
      <div><h2>Hotel</h2>${nav.slice(5).map(([l,f])=>`<a href="${href(f)}">${l}</a>`).join('')}<a href="${href('privacy.html')}">Privacy</a><a href="${href('accessibility.html')}">Accessibility</a></div>
      <div class="footer-cta"><h2>Plan your stay</h2><p>Our front desk is ready to help with reservations and questions.</p><button class="button button-light booking-trigger" type="button">Book Your Stay</button></div>
    </div><div class="footer-bottom wrap"><span>© <span data-year></span> Clarion Inn Merrillville</span><span>Website information subject to confirmation during brand transition.</span></div></footer>
    <div class="mobile-actions"><a href="${phoneHref}">Call</a><button class="booking-trigger" type="button">Book Now</button></div>`;

  document.querySelectorAll('[data-phone]').forEach(el => { el.textContent=cfg.phoneDisplay; el.href=phoneHref; });
  document.querySelectorAll('[data-email]').forEach(el => { el.textContent=cfg.email; el.href=mailHref; });
  document.querySelectorAll('[data-address]').forEach(el => { el.textContent=cfg.address; });
  document.querySelectorAll('[data-year]').forEach(el => el.textContent=new Date().getFullYear());

  let modal = document.querySelector('#reservation-modal');
  if (!modal) {
    document.body.insertAdjacentHTML('beforeend', `<dialog id="reservation-modal" class="reservation-modal" aria-labelledby="reservation-title"><button class="modal-close" type="button" aria-label="Close reservation dialog">×</button><p class="eyebrow">Stay with us</p><h2 id="reservation-title">Reservations</h2><p>Online booking is being updated during our transition to Clarion Inn. Please call our front desk and we'll be happy to assist with your stay.</p><div class="modal-actions"><a class="button button-primary" href="${phoneHref}">Call ${cfg.phoneDisplay}</a><a class="button button-outline" href="${mailHref}">Email Hotel</a></div></dialog>`);
    modal = document.querySelector('#reservation-modal');
  }
  function book() { if (cfg.bookingUrl) window.location.href=cfg.bookingUrl; else modal.showModal(); }
  document.addEventListener('click', e => {
    const booking = e.target.closest('.booking-trigger'); if (booking) { e.preventDefault(); book(); }
    if (e.target.closest('.modal-close')) modal.close();
    if (e.target === modal) modal.close();
  });
  const menu = document.querySelector('.menu-toggle');
  const siteNav = document.querySelector('.site-nav');
  if (menu) menu.addEventListener('click', () => { const open=menu.getAttribute('aria-expanded')==='true'; menu.setAttribute('aria-expanded',String(!open)); siteNav.classList.toggle('open',!open); root.classList.toggle('menu-open',!open); });
  document.addEventListener('keydown', e => { if(e.key==='Escape' && siteNav?.classList.contains('open')) { siteNav.classList.remove('open'); menu.setAttribute('aria-expanded','false'); root.classList.remove('menu-open'); } });

  document.querySelectorAll('[data-directions]').forEach(el => {
    el.href = cfg.mapsUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(cfg.address)}`;
    el.target='_blank'; el.rel='noopener';
  });
  const inDate=document.querySelector('#check-in'), outDate=document.querySelector('#check-out');
  if(inDate && outDate) {
    const iso=d=>d.toISOString().slice(0,10), today=new Date(); today.setMinutes(today.getMinutes()-today.getTimezoneOffset());
    inDate.min=iso(today); outDate.min=iso(today);
    inDate.addEventListener('change',()=>{outDate.min=inDate.value; if(outDate.value && outDate.value<=inDate.value) outDate.value='';});
  }
  const arrivalDate=document.querySelector('#arrival'), departureDate=document.querySelector('#departure');
  if(arrivalDate && departureDate) {
    const today=new Date(); today.setMinutes(today.getMinutes()-today.getTimezoneOffset());
    arrivalDate.min=today.toISOString().slice(0,10); departureDate.min=arrivalDate.min;
    arrivalDate.addEventListener('change',()=>{departureDate.min=arrivalDate.value||arrivalDate.min; if(departureDate.value && arrivalDate.value && departureDate.value<=arrivalDate.value) departureDate.value='';});
  }
})();

(() => {
  const cards=[...document.querySelectorAll('.gallery-card')], filters=[...document.querySelectorAll('[data-filter]')];
  const dlg=document.querySelector('#lightbox'); if(!dlg) return; let visible=cards, index=0;
  filters.forEach(btn=>btn.addEventListener('click',()=>{filters.forEach(b=>b.setAttribute('aria-pressed','false'));btn.setAttribute('aria-pressed','true');const f=btn.dataset.filter;cards.forEach(c=>c.hidden=f!=='all'&&c.dataset.category!==f);visible=cards.filter(c=>!c.hidden);}));
  function render(){const c=visible[index], image=dlg.querySelector('.lightbox-image');image.src=c.dataset.src;image.alt=c.querySelector('img')?.alt||c.dataset.title;dlg.querySelector('.lightbox-title').textContent=c.dataset.title;dlg.querySelector('.lightbox-count').textContent=`${index+1} of ${visible.length}`;}
  cards.forEach(c=>c.addEventListener('click',()=>{visible=cards.filter(x=>!x.hidden);index=visible.indexOf(c);render();dlg.showModal();}));
  dlg.addEventListener('click',e=>{if(e.target===dlg||e.target.closest('[data-close]'))dlg.close();if(e.target.closest('[data-prev]')){index=(index-1+visible.length)%visible.length;render();}if(e.target.closest('[data-next]')){index=(index+1)%visible.length;render();}});
  document.addEventListener('keydown',e=>{if(!dlg.open)return;if(e.key==='Escape'){dlg.close();return;}if(e.key==='ArrowLeft'){index=(index-1+visible.length)%visible.length;render();}if(e.key==='ArrowRight'){index=(index+1)%visible.length;render();}});
})();

const qs=(s,c=document)=>c.querySelector(s);const qsa=(s,c=document)=>[...c.querySelectorAll(s)];

const year=qs('[data-year]');if(year)year.textContent=new Date().getFullYear();

const toggle=qs('[data-menu-toggle]');const menu=qs('[data-menu]');
if(toggle&&menu){toggle.addEventListener('click',()=>{const open=menu.classList.toggle('open');toggle.setAttribute('aria-expanded',String(open));});qsa('a',menu).forEach(a=>a.addEventListener('click',()=>{menu.classList.remove('open');toggle.setAttribute('aria-expanded','false');}));}

const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('in-view');observer.unobserve(entry.target);}});},{threshold:.14});
qsa('.reveal').forEach(el=>observer.observe(el));

function sparkle(wrap,count=6){const layer=qs('[data-spark-layer]',wrap);if(!layer)return;for(let i=0;i<count;i++){const s=document.createElement('i');s.className='spark'+(Math.random()>.55?' star':'');s.style.left=(20+Math.random()*60)+'%';s.style.top=(18+Math.random()*62)+'%';s.style.setProperty('--dx',((Math.random()-.5)*70)+'px');s.style.setProperty('--dy',((Math.random()-.5)*58)+'px');s.style.animationDelay=(Math.random()*.12)+'s';layer.appendChild(s);setTimeout(()=>s.remove(),1000);}}
qsa('[data-buy-wrap]').forEach(wrap=>{const btn=qs('[data-amazon-button]',wrap);if(!btn)return;btn.addEventListener('mouseenter',()=>sparkle(wrap,7));btn.addEventListener('focus',()=>sparkle(wrap,6));});
setInterval(()=>{const first=qs('[data-buy-wrap]');if(first)sparkle(first,3);},5200);

const form=qs('[data-contact-form]');
if(form){
  const next=qs('[data-next-url]',form);if(next){const clean=location.origin+location.pathname;next.value=clean+'?sent=1#contact';}
  const params=new URLSearchParams(location.search);if(params.get('sent')==='1'){const status=qs('[data-form-status]',form);if(status)status.textContent='Merci, votre message a bien été envoyé.';}
  form.addEventListener('submit',()=>{const button=qs('[data-submit-button]',form);if(button){button.disabled=true;button.innerHTML='Envoi en cours…';}});
}






// --- Flying books ambient effect (isolated; no existing layout changes) ---
(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (document.getElementById('pm-flying-books-layer')) return;

  const style = document.createElement('style');
  style.id = 'pm-flying-books-style';
  style.textContent = `
    #pm-flying-books-layer{
      position:fixed; inset:0; overflow:hidden; pointer-events:none;
      z-index:3; contain:layout style paint;
    }
    .pm-flying-book{
      position:absolute; left:0; top:0;
      width:var(--bw); height:var(--bh);
      opacity:0; transform-style:preserve-3d;
      will-change:transform,opacity;
      filter:drop-shadow(0 4px 8px rgba(0,0,0,.28));
    }
    .pm-flying-book .pm-book-body{
      position:absolute; inset:0;
      transform-style:preserve-3d;
      perspective:180px;
    }
    .pm-flying-book .pm-pages{
      position:absolute; inset:2px 2px 2px 5px;
      border-radius:1px 3px 3px 1px;
      background:
        repeating-linear-gradient(
          to bottom,
          rgba(255,255,255,.92) 0 2px,
          rgba(216,196,156,.72) 2px 3px
        );
      border:1px solid rgba(217,173,85,.45);
      box-shadow:inset 2px 0 0 rgba(185,145,76,.22);
    }
    .pm-flying-book .pm-cover{
      position:absolute; inset:0;
      border-radius:2px 4px 4px 2px;
      transform-origin:left center;
      transform:rotateY(0deg);
      background:
        linear-gradient(135deg,rgba(239,204,125,.98),rgba(133,86,27,.96));
      border:1px solid rgba(255,226,159,.55);
      box-shadow:inset 2px 0 0 rgba(66,42,18,.24);
      backface-visibility:hidden;
      will-change:transform;
    }
    .pm-flying-book .pm-cover::after{
      content:"";
      position:absolute; left:28%; right:18%; top:22%; height:1px;
      background:rgba(30,19,8,.45);
      box-shadow:
        0 5px 0 rgba(30,19,8,.28),
        0 10px 0 rgba(30,19,8,.22);
    }
    .pm-flying-book.pm-dark .pm-cover{
      background:linear-gradient(135deg,#2a241d,#0e0d0b 72%);
      border-color:rgba(214,171,91,.55);
    }
    .pm-flying-book.pm-dark .pm-cover::after{
      background:rgba(225,188,111,.58);
      box-shadow:
        0 5px 0 rgba(225,188,111,.35),
        0 10px 0 rgba(225,188,111,.24);
    }
  `;
  document.head.appendChild(style);

  const layer = document.createElement('div');
  layer.id = 'pm-flying-books-layer';
  layer.setAttribute('aria-hidden', 'true');
  document.body.appendChild(layer);

  let timer = null;
  let stopped = false;

  const rand = (min, max) => Math.random() * (max - min) + min;
  const maxBooks = () => window.innerWidth < 700 ? 3 : 5;

  function spawnBook() {
    if (stopped || document.hidden || layer.childElementCount >= maxBooks()) return;

    const book = document.createElement('div');
    book.className = 'pm-flying-book' + (Math.random() > .55 ? ' pm-dark' : '');

    const width = rand(18, 31);
    const height = width * rand(1.32, 1.5);
    book.style.setProperty('--bw', width.toFixed(1) + 'px');
    book.style.setProperty('--bh', height.toFixed(1) + 'px');

    const body = document.createElement('div');
    body.className = 'pm-book-body';
    const pages = document.createElement('div');
    pages.className = 'pm-pages';
    const cover = document.createElement('div');
    cover.className = 'pm-cover';
    body.append(pages, cover);
    book.appendChild(body);
    layer.appendChild(book);

    const fromLeft = Math.random() > .5;
    const startX = fromLeft ? -70 : innerWidth + 70;
    const endX = fromLeft ? innerWidth + 90 : -90;
    const startY = rand(innerHeight * .12, innerHeight * .82);
    const endY = Math.max(
      40,
      Math.min(innerHeight - 60, startY + rand(-innerHeight * .24, innerHeight * .24))
    );
    const midY = (startY + endY) / 2 + rand(-80, 80);
    const spin = rand(28, 95) * (Math.random() > .5 ? 1 : -1);
    const duration = rand(9000, 16000);

    const flight = book.animate([
      {
        transform:`translate3d(${startX}px,${startY}px,0) rotate(${rand(-18,18)}deg) scale(.7)`,
        opacity:0
      },
      {
        transform:`translate3d(${(startX+endX)*.28}px,${midY}px,0) rotate(${spin*.32}deg) scale(1)`,
        opacity:rand(.34,.56),
        offset:.25
      },
      {
        transform:`translate3d(${(startX+endX)*.68}px,${(midY+endY)/2}px,0) rotate(${spin*.7}deg) scale(.92)`,
        opacity:rand(.30,.50),
        offset:.72
      },
      {
        transform:`translate3d(${endX}px,${endY}px,0) rotate(${spin}deg) scale(.68)`,
        opacity:0
      }
    ], {
      duration,
      easing:'linear',
      fill:'forwards'
    });

    const openings = Math.floor(rand(2, 5));
    cover.animate([
      { transform:'rotateY(0deg)' },
      { transform:`rotateY(-${rand(125,160)}deg)`, offset:.34 },
      { transform:`rotateY(-${rand(125,160)}deg)`, offset:.58 },
      { transform:'rotateY(0deg)' }
    ], {
      duration: duration / openings,
      iterations: openings,
      easing:'ease-in-out'
    });

    body.animate([
      { transform:'translateY(0) rotateX(0deg)' },
      { transform:`translateY(${rand(-7,-2)}px) rotateX(${rand(-10,10)}deg)` },
      { transform:'translateY(0) rotateX(0deg)' }
    ], {
      duration: rand(1500, 2800),
      iterations: Infinity,
      easing:'ease-in-out'
    });

    flight.finished
      .catch(() => {})
      .finally(() => book.remove());
  }

  function scheduleNext() {
    clearTimeout(timer);
    if (stopped) return;
    timer = setTimeout(() => {
      spawnBook();
      if (Math.random() > .72) setTimeout(spawnBook, rand(350, 1000));
      scheduleNext();
    }, rand(2600, 6200));
  }

  // A couple of gentle starters, then random looping.
  setTimeout(spawnBook, 700);
  setTimeout(spawnBook, 2200);
  scheduleNext();

  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && !stopped) scheduleNext();
  });

  window.addEventListener('pagehide', () => {
    stopped = true;
    clearTimeout(timer);
  }, { once:true });
})();

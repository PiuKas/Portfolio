/* ===== ANCLAS DE LA WEB ANTERIOR =====
   Los enlaces viejos usaban #ab-experiencia, #ab-skills… Si el ancla no existe, se lleva a la sección nueva. */
(function(){
  function fix(){
  var h=location.hash.slice(1); if(!h||document.getElementById(h))return;
  var OLD={'ab-proyectos':['proyectos','projects'],'ab-experiencia':['experiencia','experience'],'ab-skills':['que-hago','what-i-do'],'ab-proceso':['proceso','process'],'ab-ia':['ia','ai'],'ab-sobre':['sobre-mi','about'],'ab-contacto':['contacto','contact']};
  var to=OLD[h]; if(!to)return;
  var id=document.getElementById(to[0])?to[0]:to[1], el=document.getElementById(id); if(!el)return;
  try{history.replaceState(null,'','#'+id);}catch(e){}
  el.scrollIntoView();
  }
  fix(); window.addEventListener('hashchange',fix);
})();

/* Interacciones de la web. Cada bloque es independiente y no hace nada si su sección no está en la página. */

/* ===== INTRO: solo en la home y una vez por sesión =====
   El script del <head> decide si se reproduce (clase is-loading) o no (is-ready). */
(function(){
  var root=document.documentElement, intro=document.getElementById('ab-intro'), fly=document.getElementById('ab-fly');
  if(!intro||!fly)return;
  if(!root.classList.contains('is-loading')){ intro.remove(); fly.remove(); return; }
  try{ sessionStorage.setItem('ab-intro','1'); }catch(e){}
})();
(function(){
  var root=document.documentElement, intro=document.getElementById('ab-intro'); if(!intro)return;
  var nameEl=document.getElementById('ab-intro-name'), fly=document.getElementById('ab-fly'), logo=document.getElementById('ab-logo');
  var FINAL='Andrea Blanco', GLYPHS='abcdefghijklmnopqrstuvwxyz', timers=[];
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function clear(){timers.forEach(clearTimeout);timers=[];}
  function done(){fly.classList.add('is-gone');root.classList.remove('is-loading');root.classList.add('is-ready');intro.classList.add('is-gone');}
  function finish(){
    clear();
    if(!fly.classList.contains('is-on')){intro.classList.add('is-out');fly.classList.remove('is-on');timers.push(setTimeout(done,700));return;}
    var a=fly.getBoundingClientRect(), b=logo.getBoundingClientRect();
    var sc=b.height/a.height, dx=(b.left+b.width/2)-(a.left+a.width/2), dy=(b.top+b.height/2)-(a.top+a.height/2);
    fly.classList.add('is-flying');
    fly.style.transform='translate(calc(-50% + '+dx+'px), calc(-50% + '+dy+'px)) scale('+sc+')';
    fly.style.color='var(--ab-text)';
    intro.classList.add('is-out');
    timers.push(setTimeout(done,950));
  }
  function run(){
    clear();root.classList.add('is-loading');root.classList.remove('is-ready');
    intro.classList.remove('is-out','is-gone','is-mono');fly.className='ab-fly';fly.style.transform='';fly.style.color='';
    if(reduce){finish();return;}
    var start=performance.now(), dur=1100;
    function frame(now){
      var t=Math.min(1,(now-start)/dur), out='';
      for(var i=0;i<FINAL.length;i++){
        var c=FINAL[i], lock=i/FINAL.length < t*1.05;
        if(c===' '||lock) out+=c.replace('&','&amp;');
        else out+='<span class="g">'+GLYPHS[Math.floor(Math.random()*GLYPHS.length)]+'</span>';
      }
      nameEl.innerHTML=out;
      if(t<1) raf=requestAnimationFrame(frame);
      else { nameEl.textContent=FINAL;
        timers.push(setTimeout(function(){intro.classList.add('is-mono');fly.classList.add('is-on')},650));
        timers.push(setTimeout(finish,1500)); }
    }
    var raf=requestAnimationFrame(frame);
  }
  document.getElementById('ab-intro-skip').addEventListener('click',finish);
  run();
})();

(function(){
  var pal=document.getElementById('ab-pal'), btn=document.getElementById('ab-pal-btn'), msg=document.getElementById('ab-pal-msg'), qs=document.getElementById('ab-pal-qs'), cv=document.getElementById('ab-pal-cv');
  if(!pal)return;
  var st={look:[0,0],eyes:'open',mouth:'smile'};
  function rd(){PX.draw(cv,PX.compose(st),4,{dark:pal.classList.contains('on-dark')})}
  rd();
  var hero=document.querySelector('.ab-hero'), reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches, appeared=false;
  var HELLO='¡Hola! Soy Pixel. Si tienes prisa, te cuento en 30 segundos por qué Andrea encaja en tu equipo.';
  var A={
    why:'Plantea la solución y la lleva hasta el final. Entiende qué necesita el usuario, lo prototipa hasta que funciona y lo entrega con el detalle técnico que desarrollo necesita. Además es ordenada y disciplinada: archivos limpios, componentes documentados y decisiones explicadas.',
    dev:'Participa desde antes de que el producto exista. Trabaja de la mano de Producto, busca lo que no se ha valorado y puede sumar, se apoya en Frontend para las dudas técnicas, acompaña la implementación con metodología Agile y revisa que el resultado cumple los objetivos.',
    ai:'Construye con ella: skills propios como su compilador de prompts para Figma Agent, y webs como esta, hecha en Astro con Claude Code. También la usa para revisar entregas y automatizar procesos. Las decisiones de producto las toma ella.',
    a11y:'Para Andrea es el pilar del diseño: la tiene en cuenta desde el primer boceto, no al final. Auditó el sistema de color componente a componente con criterios WCAG y rediseñó los formularios con etiquetas claras y foco visible. Un diseño que no puede usar todo el mundo está sin terminar.',
    next:'Escríbele a <a href="/#contacto">andreapwyt@gmail.com</a> o <a href="/cv/CV_Andrea_Blanco_Lopez_ES.pdf" download>descarga su CV</a>. También la encuentras en LinkedIn, en el pie de página.'
  };
  function pulse(c,ms){pal.classList.remove(c);void pal.offsetWidth;pal.classList.add(c);setTimeout(function(){pal.classList.remove(c)},ms)}
  function showCard(){pal.classList.add('has-card');btn.setAttribute('aria-expanded','true')}
  function closeCard(){pal.classList.remove('has-card','is-open');btn.setAttribute('aria-expanded','false');qs.querySelectorAll('button').forEach(function(x){x.classList.remove('is-on')})}
  function openQs(){pal.classList.add('is-open');showCard();msg.textContent='Elige una pregunta.';ABL.apply(msg)}
  var t0=performance.now(), greeted=false, hidden=false;
  function greet(){
    if(greeted||hidden||!appeared)return;
    if(pal.classList.contains('has-card'))return;
    greeted=true; msg.textContent=HELLO; ABL.apply(msg); showCard(); setTimeout(guard,60); if(!reduce){pulse('is-hello',900); st.eyes='happy'; rd(); setTimeout(function(){st.eyes='open';rd()},1000);}
  }
  function appear(){
    if(appeared||hidden)return; appeared=true; pal.classList.add('is-in'); if(!reduce)setTimeout(function(){pulse('is-hop',420)},500);
    var wait=reduce?0:700; /* la burbuja sale justo después de Pixel, al pasar el hero */
    setTimeout(greet,wait);
  }
  /* Sobre fondo oscuro (bloque de IA) Pixel cambia a su versión con contorno claro */
  var darks=document.querySelectorAll('.ab-ia'), ticking=false;
  function checkDark(){
    ticking=false; var r=btn.getBoundingClientRect(), y=r.top+r.height/2, on=false;
    darks.forEach(function(d){var b=d.getBoundingClientRect(); if(y>b.top&&y<b.bottom)on=true;});
    if(pal.classList.contains('on-dark')!==on){pal.classList.toggle('on-dark',on);rd();}
  }
  window.addEventListener('scroll',function(){if(!ticking){ticking=true;requestAnimationFrame(checkDark)}},{passive:true});
  window.addEventListener('resize',checkDark);
  /* Pixel nunca baja de la línea del pie: cuando el pie entra en pantalla, sube con él y deja libres los enlaces */
  var foot=document.querySelector('.ab-footer'), lifting=false;
  function lift(){
    lifting=false; if(!foot)return;
    var over=Math.max(0,window.innerHeight-foot.getBoundingClientRect().top);
    pal.style.setProperty('--pal-lift',Math.round(over)+'px');
    guard();
  }
  function onLift(){if(!lifting){lifting=true;requestAnimationFrame(lift)}}
  window.addEventListener('scroll',onLift,{passive:true}); window.addEventListener('resize',onLift); lift();
  /* El saludo de Pixel nunca tapa los botones principales (hero y contacto): si se superpone a ellos, la burbuja se recoge y Pixel se queda */
  var ctas=[].slice.call(document.querySelectorAll('.ab-hero__ctas,.ab-contacto__ctas')), card=pal.querySelector('.ab-pal__card');
  function hits(a,b){return !(a.right<b.left||a.left>b.right||a.bottom<b.top||a.top>b.bottom)}
  function guard(){
    if(!card||!pal.classList.contains('has-card')||pal.classList.contains('is-open'))return;
    var r=card.getBoundingClientRect();
    if(ctas.some(function(c){return hits(r,c.getBoundingClientRect())}))closeCard();
  }
  /* Ocultar a Pixel (botón visible en móvil) */
  document.getElementById('ab-pal-hide').addEventListener('click',function(){hidden=true;closeCard();pal.classList.remove('is-in');});
  /* aparece en cuanto el hero sale de pantalla */
  if(hero&&'IntersectionObserver' in window){
    new IntersectionObserver(function(es){es.forEach(function(e){if(!e.isIntersecting&&e.boundingClientRect.top<0)appear()})},{threshold:0}).observe(hero);
  } else appear();

  btn.addEventListener('click',function(){ if(!reduce)pulse('is-hop',520); if(pal.classList.contains('has-card'))closeCard(); else openQs(); });
    document.getElementById('ab-pal-more').addEventListener('click',openQs);
  document.getElementById('ab-pal-close').addEventListener('click',closeCard);
  qs.addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;
    qs.querySelectorAll('button').forEach(function(x){x.classList.toggle('is-on',x===b)});
    msg.innerHTML=A[b.dataset.q]; ABL.apply(msg); if(!reduce){pulse('is-hop',420); var seq=['open','flat','open','flat','open','smile'],k=0; (function talk(){st.mouth=seq[k];rd();if(++k<seq.length)setTimeout(talk,140)})();}
  });
  /* clic fuera: se cierra la burbuja, la mascota se queda */
  document.addEventListener('pointerdown',function(e){ if(pal.classList.contains('has-card')&&!pal.contains(e.target))closeCard(); });
  document.addEventListener('keydown',function(e){ if(e.key==='Escape')closeCard(); });

  document.addEventListener('pointermove',function(e){
    if(!pal.classList.contains('is-in'))return;
    var r=btn.getBoundingClientRect(), cx=r.left+r.width*.5, cy=r.top+r.height*.4;
    var dx=e.clientX-cx, dy=e.clientY-cy, d=Math.hypot(dx,dy)||1;
    var ox=d<30?0:Math.max(-1,Math.min(1,Math.round(dx/d*1.4))), oy=d<30?0:Math.max(-1,Math.min(1,Math.round(dy/d*1.4)));
    if(ox!==st.look[0]||oy!==st.look[1]){st.look=[ox,oy];rd();}
  });
  setInterval(function(){if(!reduce&&pal.classList.contains('is-in')&&st.eyes==='open'){st.eyes='blink';rd();setTimeout(function(){st.eyes='open';rd()},120)}},3800);
})();

(function(){
  var bg=document.getElementById('ab-burger'), panel=document.getElementById('ab-panel'); if(!bg)return;
  function set(o){panel.classList.toggle('is-open',o);bg.setAttribute('aria-expanded',o?'true':'false');bg.firstElementChild.textContent=o?'✕':'≡';}
  bg.addEventListener('click',function(){set(!panel.classList.contains('is-open'))});
  panel.addEventListener('click',function(e){if(e.target.closest('a'))set(false)});
})();

(function(){
  var list=document.getElementById('ab-exp-list'), fill=document.getElementById('ab-exp-fill'); if(!list)return;
  var rows=[].slice.call(list.querySelectorAll('.ab-experiencia__row')), track=list.querySelector('.ab-exp-track'), ticking=false;
  function update(){
    ticking=false;
    var tr=track.getBoundingClientRect(), line=window.innerHeight*0.62;
    var h=Math.max(0,Math.min(tr.height,line-tr.top));
    fill.style.height=h+'px';
    rows.forEach(function(r){var d=r.querySelector('.ab-exp-dot').getBoundingClientRect(); r.classList.toggle('is-reached',d.top+d.height/2<=tr.top+h+1);});
  }
  function req(){if(!ticking){ticking=true;requestAnimationFrame(update)}}
  window.addEventListener('scroll',req,{passive:true}); window.addEventListener('resize',req); update();
})();

(function(){
  /* Selección de Figma: medida real de la frase */
  /* Cursor multijugador: entra, hace clic en la frase, la selecciona un instante y se queda al lado */
  var sel=document.getElementById('ab-sel'), cur=document.getElementById('ab-cursor'), nm=document.getElementById('ab-cursor-name'), root=document.documentElement, ran=false, tids=[];
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function target(){ var box=sel.closest('.ab-container'), c=box.getBoundingClientRect(), r=sel.getBoundingClientRect();
    var cw=cur.offsetWidth||90, pad=parseFloat(getComputedStyle(box).paddingRight)||16;
    var x=Math.min(r.right-c.left-6, c.width-pad-cw+8);   /* nunca se sale por la derecha (móvil) */
    return {x:Math.max(0,x), y:r.bottom-c.top-10}; }
  function place(){ if(!cur.classList.contains('is-idle'))return; var t=target(); cur.style.transform='translate('+t.x+'px,'+t.y+'px)'; }
  function play(){
    tids.forEach(clearTimeout); tids=[]; sel.classList.remove('is-selected'); cur.className='ab-cursor'; nm.textContent='¡Hola! Soy Andrea'; ABL.apply(nm);
    if(reduce)return;
    var t=target(), c=sel.closest('.ab-container').getBoundingClientRect();
    cur.style.transform='translate('+Math.max(0,c.width-(cur.offsetWidth||90)-12)+'px,'+(t.y+(c.width<640?90:140))+'px)';
    tids.push(setTimeout(function(){ cur.classList.add('is-on','is-moving'); cur.style.transform='translate('+t.x+'px,'+t.y+'px)'; },350));
    tids.push(setTimeout(function(){ cur.classList.add('is-click'); sel.classList.add('is-selected'); },1500));
    tids.push(setTimeout(function(){ cur.classList.remove('is-click'); },1650));
    var small=c.width<640;
    tids.push(setTimeout(function(){ sel.classList.remove('is-selected');
      if(small){ /* en móvil no hay sitio libre junto al titular: el cursor se despide y se va */
        cur.classList.add('is-leave'); var tt=target(); cur.style.transform='translate('+(tt.x+40)+'px,'+(tt.y+30)+'px)';
      } else { cur.classList.remove('is-moving'); cur.classList.add('is-idle'); }
    },2500));
    if(!small) tids.push(setTimeout(function(){ nm.textContent='Andrea'; },3300));
  }
  if(sel&&cur){
    var mo=new MutationObserver(function(){ if(root.classList.contains('is-ready')&&!ran){ran=true;play();} if(root.classList.contains('is-loading')){ran=false;} });
    mo.observe(root,{attributes:true,attributeFilter:['class']});
    if(root.classList.contains('is-ready')){ran=true;play();}
    window.addEventListener('resize',place);
  }

  /* Theming en vivo del caso DS */
  var ds=document.getElementById('ab-ds'), out=document.getElementById('ab-ds-tokens'), title=document.getElementById('ab-tk-title');
  var T={a:{name:'Colección permanente',primary:'#141414',accent:'#c8102e',radius:'4px',font:'Hanken Grotesk'},
         b:{name:'Visita al monumento',primary:'#1f5f4a',accent:'#c9822b',radius:'16px',font:'Bricolage Grotesque'},
         c:{name:'Concierto de temporada',primary:'#8b7bff',accent:'#ffd166',radius:'999px',font:'Hanken Grotesk'}};
  function paint(k){ var t=T[k]; ds.setAttribute('data-brand',k); title.textContent=t.name;
    out.innerHTML='<span class="k">--brand-primary:</span> <span class="v">'+t.primary+'</span>;\n<span class="k">--brand-accent:</span>  <span class="v">'+t.accent+'</span>;\n<span class="k">--radius-control:</span> <span class="v">'+t.radius+'</span>;\n<span class="k">--font-brand:</span>   <span class="v">"'+t.font+'"</span>;';
    ds.querySelectorAll('.ab-ds__brands button').forEach(function(b){b.setAttribute('aria-pressed',b.dataset.brand===k?'true':'false')}); }
  if(ds){ ds.querySelector('.ab-ds__brands').addEventListener('click',function(e){var b=e.target.closest('button');if(b)paint(b.dataset.brand)}); paint('a'); }

  /* Proceso: línea que avanza con el scroll */
  var steps=document.getElementById('ab-steps'), fill=document.getElementById('ab-steps-fill'); if(!steps)return;
  var items=[].slice.call(steps.querySelectorAll('.ab-step')), track=steps.querySelector('.ab-steps__track'), ticking=false;
  function upd(){ ticking=false; var tr=track.getBoundingClientRect(), vertical=tr.height>tr.width, line=window.innerHeight*.62;
    if(vertical){ var h=Math.max(0,Math.min(tr.height,line-tr.top)); fill.style.height=h+'px'; fill.style.width='100%';
      items.forEach(function(it){var n=it.querySelector('.ab-step__node').getBoundingClientRect(); it.classList.toggle('is-reached',n.top+n.height/2<=tr.top+h+1)}); }
    else { var sr=steps.getBoundingClientRect(), p=Math.max(0,Math.min(1,(line-sr.top)/(sr.height*0.9))); var w=p*tr.width; fill.style.width=w+'px'; fill.style.height='100%';
      items.forEach(function(it){var n=it.querySelector('.ab-step__node').getBoundingClientRect(); it.classList.toggle('is-reached',n.left+n.width/2<=tr.left+w+1)}); } }
  function req(){if(!ticking){ticking=true;requestAnimationFrame(upd)}}
  window.addEventListener('scroll',req,{passive:true}); window.addEventListener('resize',req); upd();
})();

(function(){
  var notes=document.getElementById('ab-ba-notes'), bef=document.getElementById('ab-ba-before'), aft=document.getElementById('ab-ba-after'); if(!notes)return;
  /* Pares de componentes. Imagen vacía = captura pendiente */
  var P=[
    {before:'/img/antes-ahora/hora-antes.svg',after:'/img/antes-ahora/hora-ahora.png',alt:'selector de hora',
      notes:['Disponibilidad visible en todas las horas.','Segmentos además de color, para no depender solo de él.','El aviso va dentro de cada tarjeta.']},
    {before:'/img/antes-ahora/calendario-antes.png',after:'/img/antes-ahora/calendario-ahora.png',alt:'calendario en móvil',notes:['Hoja inferior: toda la pantalla para elegir el día.','El precio, visible en cada día.','Barra inferior más clara, con un botón que no parece desactivado.']},
    {before:'/img/antes-ahora/datos-antes.png',after:'/img/antes-ahora/datos-ahora.png',alt:'datos personales y temporizador',notes:['El formulario primero; el resumen, a un toque.','Temporizador fijo y discreto.','Etiquetas siempre visibles sobre cada campo.']}
  ];
  function fill(el,src,alt){ el.innerHTML = src ? '<img src="'+src+'" alt="'+alt+'">' : '<span class="ab-ba__ph">Captura pendiente</span>'; }
  function show(i){ var p=P[i];
    fill(bef,p.before,'Antes: '+p.alt); fill(aft,p.after,'Ahora: '+p.alt);
    notes.innerHTML=p.notes.map(function(n){return '<li>'+n+'</li>'}).join(''); ABL.apply(notes); ABL.apply(bef); ABL.apply(aft);
    document.querySelectorAll('.ab-ba__tabs button').forEach(function(b){b.setAttribute('aria-selected',+b.dataset.pair===i?'true':'false')}); }
  document.querySelector('.ab-ba__tabs').addEventListener('click',function(e){var b=e.target.closest('button');if(b)show(+b.dataset.pair)});
  show(0);
})();

(function(){
  var tr=document.getElementById('ab-canvas'); if(!tr)return;
  var prev=document.getElementById('ab-canvas-prev'), next=document.getElementById('ab-canvas-next'), cnt=document.getElementById('ab-canvas-count'), bar=document.getElementById('ab-canvas-bar');
  var frames=[].slice.call(tr.querySelectorAll('.ab-frame')), total=frames.length;
  function step(){ var f=frames[0], g=parseFloat(getComputedStyle(tr).columnGap)||24; return f.getBoundingClientRect().width+g; }
  function idx(){ return Math.min(total-1,Math.round(tr.scrollLeft/step())); }
  function upd(){ var i=idx(), max=tr.scrollWidth-tr.clientWidth;
    cnt.textContent=String(i+1).padStart(2,'0')+' / '+String(total).padStart(2,'0');
    bar.style.width=(max>0?(tr.scrollLeft/max)*100:100)+'%';
    prev.disabled=tr.scrollLeft<4; next.disabled=tr.scrollLeft>max-4; }
  prev.addEventListener('click',function(){tr.scrollBy({left:-step(),behavior:'smooth'})});
  next.addEventListener('click',function(){tr.scrollBy({left:step(),behavior:'smooth'})});
  tr.addEventListener('scroll',function(){requestAnimationFrame(upd)},{passive:true});
  window.addEventListener('resize',upd);
  /* arrastrar con ratón, como mover el lienzo de Figma */
  var down=false, sx=0, sl=0, moved=false;
  tr.addEventListener('pointerdown',function(e){ if(e.pointerType!=='mouse')return; down=true; moved=false; sx=e.clientX; sl=tr.scrollLeft; });
  window.addEventListener('pointermove',function(e){ if(!down)return; var dx=e.clientX-sx; if(Math.abs(dx)>4){moved=true;tr.classList.add('is-drag');} tr.scrollLeft=sl-dx; });
  window.addEventListener('pointerup',function(){ if(!down)return; down=false; if(moved){ var i=Math.round(tr.scrollLeft/step()); tr.classList.remove('is-drag'); tr.scrollTo({left:i*step(),behavior:'smooth'}); } });
  tr.addEventListener('click',function(e){ if(moved){e.preventDefault();moved=false;} },true);
  upd();
})();

/* Mini Pixel de la portada de "Este portfolio" */
document.querySelectorAll('canvas[data-pxmini]').forEach(function(c){ PX.draw(c,PX.compose({}),2); });

/* ===== Portadas de Pixel (tarjeta del canvas y portada de su página) ===== */
(function(){
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var MAIN=[{d:1600},{d:120,eyes:'blink'},{d:900},{d:500,dy:-1},{d:500}];
  function drawCover(cv,f){
    var W=cv.width,H=cv.height,x=cv.getContext('2d'); x.imageSmoothingEnabled=false; x.clearRect(0,0,W,H);
    var s=Math.max(4,Math.floor(H*0.6/20)), ms=Math.max(3,Math.floor(s*0.42));
    var gx=Math.round(W*0.36-10*s), gy=Math.round(H/2-10*s);
    PX.paint(x,PX.compose(f),s,gx,gy);
    var minis=[{eyes:'happy',fx:[[0,1],[15,0]]},{look:[1,-1],mouth:'flat',fx:[[14,1],[16,0],[17,-1]]},{mouth:'open'}];
    var mx=Math.round(W*0.70-10*ms);
    minis.forEach(function(m,i){ var my=Math.round(H*(0.2+i*0.3)-10*ms); PX.paint(x,PX.compose(m),ms,mx,my); });
  }
  document.querySelectorAll('[data-pxcover]').forEach(function(cv){
    var i=0; (function tick(){ drawCover(cv,MAIN[i]); if(reduce)return; var d=MAIN[i].d; i=(i+1)%MAIN.length; setTimeout(tick,d); })();
  });
})();

/* ===== Páginas de proyecto: índice de capítulos y piezas de Pixel ===== */
(function(){
  /* Índice de capítulos: botones (no cambian el hash) y capítulo activo */
  document.querySelectorAll('.ab-cs__toc').forEach(function(toc){
    var btns=[].slice.call(toc.querySelectorAll('button[data-go]'));
    btns.forEach(function(b){b.addEventListener('click',function(){var t=document.getElementById(b.dataset.go); if(t) t.scrollIntoView({behavior:'smooth',block:'start'});})});
    if('IntersectionObserver' in window){
      var io=new IntersectionObserver(function(es){es.forEach(function(e){ if(e.isIntersecting){ btns.forEach(function(b){b.classList.toggle('is-on',b.dataset.go===e.target.id)}); } })},{rootMargin:'-30% 0px -60% 0px'});
      btns.forEach(function(b){var t=document.getElementById(b.dataset.go); if(t) io.observe(t);});
    }
  });

  /* Piezas de Pixel en su página */
  document.querySelectorAll('canvas[data-sketch]').forEach(function(c){ PX.draw(c,PX.fromMap(PX.SK[c.dataset.sketch]),5); });
  var IDLE=[{d:1500},{d:120,eyes:'blink'},{d:900},{d:600,dy:-1}];
  document.querySelectorAll('canvas[data-pxv]').forEach(function(c){ PX.loop(c,IDLE,5,null,c.dataset.pxv); });
  document.querySelectorAll('canvas[data-pxstate]').forEach(function(c){ PX.loop(c,PX.STATES[c.dataset.pxstate].frames,4,{dark:c.hasAttribute('data-dark')}); });
})();

/* Contacto: copiar el email (por si el visitante no tiene cliente de correo) */
(function(){var b=document.getElementById('ab-copy'),ok=document.getElementById('ab-copy-ok');if(!b)return;var t;
function done(msg){ok.textContent=msg;ABL.apply(ok);ok.classList.add('is-on');clearTimeout(t);t=setTimeout(function(){ok.classList.remove('is-on')},2200)}
function sel(){var r=document.createRange();r.selectNodeContents(document.getElementById('ab-mail'));var s=getSelection();s.removeAllRanges();s.addRange(r)}
b.addEventListener('click',function(){var m=b.dataset.mail;try{navigator.clipboard.writeText(m).then(function(){done('Copiado')},function(){sel();done('Seleccionado, pulsa Ctrl+C')})}catch(e){sel();done('Seleccionado, pulsa Ctrl+C')}});})();

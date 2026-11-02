/* ===== IDIOMA =====
   Cada idioma tiene sus propias páginas (/ y /en/), generadas en el build.
   Este script solo traduce los textos que el JavaScript escribe en la página
   (respuestas de Pixel, notas del antes/ahora, avisos), usando el diccionario
   que el build publica en /js/i18n-en.js para las páginas en inglés. */
var ABL=(function(){
  var D=window.AB_I18N_DICT||{t:{},a:{}};
  var lang=document.documentElement.lang==='en'?'en':'es';
  var T=D.t||{}, A=D.a||{};
  var tmp=document.createElement('div');
  function norm(s){return String(s).replace(/\s+/g,' ').trim();}
  var SKIP=/^(SCRIPT|STYLE|svg|SVG|CANVAS|TEMPLATE)$/;
  function units(root){var out=[];(function walk(el){
    if(SKIP.test(el.tagName))return;
    for(var n=el.firstChild;n;n=n.nextSibling) if(n.nodeType===3&&n.nodeValue.trim()){out.push(el);return;}
    for(var c=el.firstElementChild;c;c=c.nextElementSibling) walk(c);
  })(root);return out;}
  function texts(el){var a=[],w=document.createTreeWalker(el,NodeFilter.SHOW_TEXT,null),n;while((n=w.nextNode())) if(n.nodeValue.trim()) a.push(n);return a;}
  function put(el,html){
    tmp.innerHTML=html; var src=texts(tmp), dst=texts(el);
    if(src.length===dst.length && el.children.length===tmp.children.length && !tmp.querySelector('[href]')){ for(var i=0;i<src.length;i++) dst[i].nodeValue=src[i].nodeValue; }
    else el.innerHTML=html;
  }
  function apply(root){
    if(lang!=='en'||!root)return;
    units(root).forEach(function(el){var k=norm(el.textContent); if(T[k]!==undefined) put(el,T[k][1]);});
    [root].concat([].slice.call(root.querySelectorAll('[aria-label],[alt],[title]'))).forEach(function(el){
      if(!el.getAttribute)return;
      ['aria-label','alt','title'].forEach(function(a){var v=el.getAttribute(a); if(v&&A[v]!==undefined) el.setAttribute(a,A[v]);});
    });
  }
  return {apply:apply,get lang(){return lang;}};
})();

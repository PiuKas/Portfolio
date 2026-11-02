/* Genera la versión en inglés (/en/) a partir de las páginas en castellano ya compiladas.
   Se ejecuta después de `astro build` (ver package.json).

   - Traduce cada texto con el diccionario src/i18n/en.json (clave = texto en castellano).
   - Cambia rutas, anclas, enlace al CV, <html lang>, título, descripción, canonical y hreflang.
   - Publica el diccionario en /js/i18n-en.js para los textos que escribe el JavaScript.
   - Escribe sitemap.xml con las dos versiones de cada página.
   - Avisa de los textos que se han quedado sin traducir. */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { parseHTML } from 'linkedom';
import { PAGES, ANCHORS, SITE, CV, toEnglish } from '../src/i18n/routes.mjs';

const DIST = new URL('../dist/', import.meta.url).pathname;
const dict = JSON.parse(readFileSync(new URL('../src/i18n/en.json', import.meta.url), 'utf8'));
const T = dict.t, A = dict.a, KEEP = new Set(dict.keep || []);
const norm = (s) => String(s).replace(/\s+/g, ' ').trim();
const SKIP = /^(SCRIPT|STYLE|SVG|CANVAS|TEMPLATE|CODE)$/i;

/* Enlaces dentro de los textos traducidos (por ejemplo, las respuestas de Pixel) */
function fixHtmlLinks(html) {
  return html.replace(/href="([^"]+)"/g, (m, h) => `href="${toEnglish(h) || h}"`);
}

/* Textos que pueden quedarse igual en inglés no cuentan como pendientes */
const looksSpanish = (s) => /[áéíóúñ¿¡]/i.test(s) || /\b(de|la|el|que|y|en|para|con|los|las|una?|por|del|se|es|mi|sin|más)\b/i.test(s);

function textNodes(el) {
  const out = [];
  (function walk(n) {
    for (let c = n.firstChild; c; c = c.nextSibling) {
      if (c.nodeType === 3) { if (c.nodeValue.trim()) out.push(c); }
      else if (c.nodeType === 1) walk(c);
    }
  })(el);
  return out;
}

/* Igual que en el navegador: si la estructura coincide, cambia solo los textos
   (así se conservan ids y clases); si no, sustituye el HTML. */
function put(document, el, html) {
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  const src = textNodes(tmp), dst = textNodes(el);
  if (src.length === dst.length && el.children.length === tmp.children.length) {
    src.forEach((n, i) => { dst[i].nodeValue = n.nodeValue; });
  } else el.innerHTML = html;
}

function translate(document) {
  const missing = [];
  const units = [];
  (function walk(el) {
    if (SKIP.test(el.tagName)) return;
    if (el.classList && el.classList.contains('ab-lang')) return;
    for (let n = el.firstChild; n; n = n.nextSibling) {
      if (n.nodeType === 3 && n.nodeValue.trim()) { units.push(el); return; }
    }
    for (let c = el.firstElementChild; c; c = c.nextElementSibling) walk(c);
  })(document.body);

  for (const el of units) {
    const key = norm(el.textContent);
    const entry = T[key];
    if (entry) put(document, el, fixHtmlLinks(entry[1]));
    else if (looksSpanish(key) && !KEEP.has(key) && !el.closest('pre')) missing.push(key);
  }
  for (const el of document.querySelectorAll('[aria-label],[alt],[title]')) {
    for (const a of ['aria-label', 'alt', 'title']) {
      const v = el.getAttribute(a);
      if (v && A[v] !== undefined) el.setAttribute(a, A[v]);
    }
  }
  return missing;
}

const report = {};
for (const [esPath, page] of Object.entries(PAGES)) {
  const file = join(DIST, esPath, 'index.html');
  const { document } = parseHTML(readFileSync(file, 'utf8'));

  const missing = translate(document);

  /* Rutas y anclas */
  for (const a of document.querySelectorAll('a[href]')) {
    if (a.closest('.ab-lang')) continue;
    const en = toEnglish(a.getAttribute('href'));
    if (en) a.setAttribute('href', en);
  }
  for (const [es, en] of Object.entries(ANCHORS)) {
    const el = document.getElementById(es);
    if (el) el.id = en;
  }

  /* Selector de idioma */
  for (const sw of document.querySelectorAll('.ab-lang')) {
    for (const a of sw.querySelectorAll('a')) {
      if (a.getAttribute('lang') === 'en') a.setAttribute('aria-current', 'true');
      else a.removeAttribute('aria-current');
    }
    sw.setAttribute('aria-label', 'Language');
  }

  /* <head> */
  const html = document.documentElement;
  html.setAttribute('lang', 'en');
  document.title = page.title;
  const set = (sel, attr, val) => { const el = document.querySelector(sel); if (el) el.setAttribute(attr, val); };
  set('meta[name="description"]', 'content', page.description);
  set('meta[property="og:title"]', 'content', page.title);
  set('meta[property="og:description"]', 'content', page.description);
  set('meta[property="og:locale"]', 'content', 'en_GB');
  set('meta[property="og:url"]', 'content', SITE + page.en);
  set('link[rel="canonical"]', 'href', SITE + page.en);

  /* Diccionario para los textos que escribe el JavaScript, antes de i18n.js */
  const i18n = document.querySelector('script[src="/js/i18n.js"]');
  const dictScript = document.createElement('script');
  dictScript.setAttribute('src', '/js/i18n-en.js');
  dictScript.setAttribute('defer', '');
  i18n.parentNode.insertBefore(dictScript, i18n);

  const out = join(DIST, page.en, 'index.html');
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, '<!DOCTYPE html>' + html.outerHTML);
  if (missing.length) report[page.en] = missing;
}

/* Diccionario para el navegador, con los enlaces ya en inglés */
const browserDict = { t: {}, a: A };
for (const [k, v] of Object.entries(T)) browserDict.t[k] = [v[0], fixHtmlLinks(v[1])];
writeFileSync(join(DIST, 'js/i18n-en.js'), 'window.AB_I18N_DICT=' + JSON.stringify(browserDict) + ';\n');

/* sitemap.xml con hreflang */
const urls = Object.entries(PAGES).flatMap(([es, p]) => [es, p.en].map((loc) => `  <url>
    <loc>${SITE}${loc}</loc>
    <xhtml:link rel="alternate" hreflang="es" href="${SITE}${es}"/>
    <xhtml:link rel="alternate" hreflang="en" href="${SITE}${p.en}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE}${es}"/>
  </url>`));
writeFileSync(join(DIST, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join('\n')}
</urlset>
`);

const total = Object.values(report).reduce((n, m) => n + m.length, 0);
console.log(`[en] ${Object.keys(PAGES).length} páginas en inglés generadas, sitemap.xml escrito.`);
if (total) {
  console.warn(`[en] ${total} textos sin traducción en src/i18n/en.json:`);
  for (const [p, m] of Object.entries(report)) for (const k of m) console.warn(`  ${p}  «${k.slice(0, 90)}»`);
}
void CV;

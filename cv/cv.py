"""Genera el CV en PDF (castellano e inglés) en public/cv/.

Uso:  python3 cv/cv.py
Necesita Python con Playwright y Chrome. El contenido está en cv/content.py.

Criterios para que lo lean bien los filtros automáticos (ATS) y las IAs de selección:
- Una sola columna, en orden de lectura, con encabezados estándar.
- Todo es texto seleccionable; sin iconos, tablas ni texto dentro de imágenes.
- Sin espaciado entre letras en nombre y títulos (rompía las palabras al extraer el texto).
- Contacto en el cuerpo del documento, no en cabecera ni pie.
- Metadatos del PDF (título, autora, palabras clave) e idioma del documento.
"""
import asyncio, html, pathlib, sys
from playwright.async_api import async_playwright

ROOT = pathlib.Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / 'cv'))
from content import CV  # noqa: E402

NM = ROOT / 'node_modules'
FONTS = {
    'Bricolage': NM / '@fontsource-variable/bricolage-grotesque/files/bricolage-grotesque-latin-wght-normal.woff2',
    'Hanken400': NM / '@fontsource/hanken-grotesk/files/hanken-grotesk-latin-400-normal.woff2',
    'Hanken500': NM / '@fontsource/hanken-grotesk/files/hanken-grotesk-latin-500-normal.woff2',
    'Hanken600': NM / '@fontsource/hanken-grotesk/files/hanken-grotesk-latin-600-normal.woff2',
    'Hanken700': NM / '@fontsource/hanken-grotesk/files/hanken-grotesk-latin-700-normal.woff2',
}

CSS = """
@font-face{font-family:"Bricolage Grotesque";src:url("%(Bricolage)s") format("woff2");font-weight:200 800}
@font-face{font-family:"Hanken Grotesk";src:url("%(Hanken400)s") format("woff2");font-weight:400}
@font-face{font-family:"Hanken Grotesk";src:url("%(Hanken500)s") format("woff2");font-weight:500}
@font-face{font-family:"Hanken Grotesk";src:url("%(Hanken600)s") format("woff2");font-weight:600}
@font-face{font-family:"Hanken Grotesk";src:url("%(Hanken700)s") format("woff2");font-weight:700}
@page{size:A4;margin:15mm 16mm 13mm}
:root{--ink:#0e0e0e;--muted:#56564f;--meta:#6f6f68;--line:rgba(0,0,0,.14);--accent:#f2541b;--accent-ink:#b83e10}
*{box-sizing:border-box}
html{-webkit-print-color-adjust:exact;print-color-adjust:exact}
body{margin:0;font-family:"Hanken Grotesk",Arial,sans-serif;font-size:9.3pt;line-height:1.42;color:var(--ink)}
h1,h2,h3,p,ul{margin:0}
a{color:inherit;text-decoration:none}
header{padding-bottom:9pt;border-bottom:1.2pt solid var(--ink)}
h1{font-family:"Bricolage Grotesque",Arial,sans-serif;font-weight:800;font-size:25pt;line-height:1;letter-spacing:0}
h1 .dot{display:inline-block;width:.2em;height:.2em;margin-left:.06em;border-radius:.03em;background:var(--accent)}
.role{margin-top:4pt;font-family:"Bricolage Grotesque",Arial,sans-serif;font-weight:700;font-size:12.5pt}
.contact{margin-top:6pt;color:var(--muted);font-size:8.9pt}
.contact span{white-space:nowrap}
.contact a{color:var(--ink);text-decoration:underline;text-decoration-color:var(--accent);text-decoration-thickness:.7pt;text-underline-offset:1.6pt}
.contact span+span::before{content:" - ";color:var(--meta)}
section{margin-top:11pt}
h2{display:flex;align-items:center;gap:6pt;font-family:"Bricolage Grotesque",Arial,sans-serif;font-weight:700;font-size:11.5pt;line-height:1.1;padding-bottom:4pt;margin-bottom:6pt;border-bottom:.6pt solid var(--line)}
h2::before{content:"";width:5pt;height:5pt;border-radius:1pt;background:var(--accent);flex:none}
.summary{color:#2c2c29}
.job{margin-top:8pt;break-inside:avoid}
.job:first-of-type{margin-top:0}
.job__head{display:flex;justify-content:space-between;align-items:baseline;gap:10pt}
h3{font-size:10.2pt;font-weight:700}
.dates{font-size:8.9pt;color:var(--muted);white-space:nowrap;font-variant-numeric:tabular-nums}
.org{color:var(--muted);font-weight:500}
.intro{margin-top:2pt;color:#2c2c29}
ul{margin-top:3pt;padding-left:11pt}
li{margin-top:1.6pt;padding-left:1pt}
li::marker{color:var(--accent)}
.skills{display:grid;grid-template-columns:auto 1fr;gap:3pt 12pt}
.skills dt{font-weight:600}
.skills dd{margin:0;color:#2c2c29}
.proj li strong{font-weight:600}
"""

def esc(s):
    return html.escape(s, quote=False)

def rich(s):
    """**negrita** -> <strong> sobre texto ya escapado"""
    out, bold = [], False
    for part in esc(s).split('**'):
        out.append(('<strong>%s</strong>' % part) if bold else part)
        bold = not bold
    return ''.join(out)

def render(c):
    contact = ''.join(
        '<span>%s</span>' % (('<a href="%s">%s</a>' % (esc(h), esc(t))) if h else esc(t))
        for t, h in c['contact'])
    jobs = []
    for j in c['experience']:
        bullets = ''.join('<li>%s</li>' % rich(b) for b in j['bullets'])
        jobs.append(
            '<div class="job"><div class="job__head"><h3>%s <span class="org">- %s</span></h3>'
            '<p class="dates">%s</p></div>%s<ul>%s</ul></div>' % (
                esc(j['title']), esc(j['org']), esc(j['dates']),
                ('<p class="intro">%s</p>' % rich(j['intro'])) if j.get('intro') else '', bullets))
    projects = ''.join('<li>%s</li>' % rich(p) for p in c['projects'])
    edu = ''.join(
        '<div class="job"><div class="job__head"><h3>%s <span class="org">- %s</span></h3><p class="dates">%s</p></div></div>'
        % (esc(e['title']), esc(e['org']), esc(e['dates'])) for e in c['education'])
    skills = ''.join('<dt>%s</dt><dd>%s</dd>' % (esc(k), esc(v)) for k, v in c['skills'])
    h = c['headings']
    return """<!doctype html><html lang="%(lang)s"><head><meta charset="utf-8">
<title>%(doc_title)s</title><meta name="author" content="Andrea Blanco López">
<meta name="keywords" content="%(keywords)s"><meta name="description" content="%(doc_title)s">
<style>%(css)s</style></head><body>
<header>
<h1>Andrea Blanco López<span class="dot" aria-hidden="true"></span></h1>
<p class="role">%(headline)s</p>
<p class="contact">%(contact)s</p>
</header>
<section><h2>%(h_summary)s</h2><p class="summary">%(summary)s</p></section>
<section><h2>%(h_exp)s</h2>%(jobs)s</section>
<section class="proj"><h2>%(h_proj)s</h2><ul>%(projects)s</ul></section>
<section><h2>%(h_edu)s</h2>%(edu)s</section>
<section><h2>%(h_skills)s</h2><dl class="skills">%(skills)s</dl></section>
</body></html>""" % dict(
        lang=c['lang'], doc_title=esc(c['doc_title']), keywords=esc(c['keywords']),
        css=CSS % {k: v.as_uri() for k, v in FONTS.items()},
        headline=esc(c['headline']), contact=contact, summary=rich(c['summary']),
        h_summary=h['summary'], h_exp=h['experience'], h_proj=h['projects'], h_edu=h['education'], h_skills=h['skills'],
        jobs=''.join(jobs), projects=projects, edu=edu, skills=skills)

def set_metadata(pdf, c):
    from pypdf import PdfReader, PdfWriter
    r = PdfReader(str(pdf)); w = PdfWriter(clone_from=r)
    w.add_metadata({'/Title': c['doc_title'], '/Author': 'Andrea Blanco López',
                    '/Subject': c['headline'], '/Keywords': c['keywords'], '/Creator': 'andreablancolopez.com'})
    w.write(str(pdf))

async def main():
    out = ROOT / 'public' / 'cv'
    out.mkdir(parents=True, exist_ok=True)
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/usr/bin/google-chrome')
        for c in CV:
            page = await b.new_page()
            src = ROOT / 'cv' / ('cv-%s.html' % c['lang'])
            src.write_text(render(c), encoding='utf-8')
            await page.goto(src.as_uri())
            await page.evaluate('document.fonts.ready')
            pdf = out / c['file']
            await page.pdf(path=str(pdf), format='A4', print_background=True, prefer_css_page_size=True, tagged=True, outline=True)
            src.unlink()
            set_metadata(pdf, c)
            print('ok', pdf.relative_to(ROOT))
        await b.close()

if __name__ == '__main__':
    asyncio.run(main())

/* Rutas y metadatos de cada página en castellano e inglés.
   Lo usan Base.astro (hreflang, selector de idioma) y scripts/build-en.mjs (genera /en/). */

export const SITE = 'https://andreablancolopez.com';

export const CV = {
  es: '/cv/Andrea-Blanco-Lopez-CV-ES.pdf',
  en: '/cv/Andrea-Blanco-Lopez-CV-EN.pdf',
};

/* Página en castellano → página en inglés, con título y descripción de la versión inglesa. */
export const PAGES = {
  '/': {
    en: '/en/',
    title: 'Andrea Blanco - Product Designer',
    description: 'Product Designer with 4+ years of experience. I design products end to end: from the problem to the design system and the build with development.',
  },
  '/proyectos/pixel/': {
    en: '/en/projects/pixel/',
    title: 'Pixel - Andrea Blanco',
    description: 'The little assistant that keeps visitors to this site company. In thirty seconds it answers what a recruiter in a hurry wants to know about me.',
  },
  '/proyectos/este-portfolio/': {
    en: '/en/projects/this-portfolio/',
    title: 'This portfolio - Andrea Blanco',
    description: 'How I went from a website that no longer represented me to a Product Designer portfolio, designed and built by iterating with Claude.',
  },
  '/proyectos/web-entrenador-combate/': {
    en: '/en/projects/combat-coach-website/',
    title: 'Website for a combat sports coach - Andrea Blanco',
    description: 'A landing page for a combat sports strength and conditioning coach. It had to build trust from the first second and lead every visitor to message him on WhatsApp.',
  },
};

/* Anclas de la home */
export const ANCHORS = {
  proyectos: 'projects',
  experiencia: 'experience',
  'que-hago': 'what-i-do',
  proceso: 'process',
  ia: 'ai',
  'sobre-mi': 'about',
  contacto: 'contact',
};

const withSlash = (p) => (p.endsWith('/') ? p : p + '/');

/* Devuelve la ruta equivalente en inglés de un enlace interno en castellano (o null si no es interno). */
export function toEnglish(href) {
  if (!href || !href.startsWith('/') || href.startsWith('//')) return null;
  if (href.startsWith('/en/')) return href;
  if (href === CV.es) return CV.en;
  const [path, hash] = href.split('#');
  const page = PAGES[withSlash(path || '/')];
  if (!page) return null;
  const anchor = hash ? '#' + (ANCHORS[hash] || hash) : '';
  return page.en + anchor;
}

export function alternates(pathname) {
  const p = withSlash(pathname);
  if (PAGES[p]) return { es: p, en: PAGES[p].en };
  const es = Object.keys(PAGES).find((k) => PAGES[k].en === p);
  return es ? { es, en: p } : { es: p, en: p };
}

# andreablancolopez.com

Portfolio de Andrea Blanco, Product Designer. Web estática hecha con [Astro](https://astro.build) a partir del rediseño que diseñé en un simulador y del design system del portfolio.

## Cómo está hecha

- **Diseño:** cada sección se diseñó y aprobó en un simulador de la web, con los componentes del design system.
- **Implementación:** el paso del simulador a Astro lo hizo Claude. Las decisiones de diseño, el contenido y el alcance son míos.
- **Sin dependencias en el navegador:** HTML, CSS y un poco de JavaScript propio para las animaciones, Pixel y el cambio de idioma. Las fuentes se sirven desde la propia web.

## Estructura

```
src/
  styles/
    tokens.css        Tokens del design system (color, tipografía, layout)
    site.css          Estilos por componente, clases .ab-* en BEM
  layouts/
    Base.astro        <head>, navegación, pie y scripts comunes
  components/
    Nav, Footer, Intro, Pixel
    home/             Una sección de la home por archivo
    covers/           Portadas de "Este portfolio" y del entrenador
  pages/
    index.astro       Home
    proyectos/        Una página por caso de estudio
public/
  img/                Fotos y capturas
  cv/                 CV en PDF, en castellano e inglés (los genera cv/cv.py)
  js/
    i18n.js           Traduce en inglés los textos que escribe el JavaScript
    pixel-engine.js   Motor de sprites de Pixel
    site.js           Intro, cursor, timelines, lienzo de proyectos, Pixel
src/i18n/
  en.json             Diccionario castellano → inglés
  routes.mjs          Rutas de cada página en los dos idiomas, títulos y descripciones en inglés
scripts/
  build-en.mjs        Genera las páginas /en/ y el sitemap después del build
cv/
  content.py          Texto del CV en los dos idiomas
  cv.py               Genera los PDF
```

## Idiomas

La web se escribe en castellano. Al compilar, `scripts/build-en.mjs` genera la versión inglesa en `/en/` con el diccionario `src/i18n/en.json`, y añade `hreflang`, canonical y un `sitemap.xml` con las dos versiones. Si cambias un texto en castellano, añade su traducción al diccionario: el build avisa de los textos que se han quedado sin traducir.

## CV

El texto está en `cv/content.py`. Para regenerar los PDF de `public/cv/`:

```
python3 cv/cv.py
```

Está pensado para que lo lean bien los filtros automáticos (ATS): una columna, encabezados estándar, todo en texto seleccionable y sin espaciado entre letras en los títulos.

Para cambiar un texto, se edita el archivo de su sección en `src/components/home/` o la página en `src/pages/proyectos/`.

## Trabajar en local

```
npm install
npm run dev      # http://localhost:4321
npm run build    # genera la web en dist/
```


## Despliegue

La web se publica en Netlify desde la rama `main`: cada push compila y publica sola. La configuración está en `netlify.toml` (comando de build, carpeta `dist/`, redirecciones del CV de la web antigua en WordPress y caché de las fuentes).

Los enlaces viejos con anclas `#ab-…` (por ejemplo `#ab-experiencia`) se reconducen a la sección nueva desde `public/js/site.js`. Las rutas que no existen muestran `src/pages/404.astro`, que no se indexa.

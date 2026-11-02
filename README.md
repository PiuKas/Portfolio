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
  js/
    i18n.js           Textos en inglés y selector ES / EN
    pixel-engine.js   Motor de sprites de Pixel
    site.js           Intro, cursor, timelines, lienzo de proyectos, Pixel
```

Para cambiar un texto, se edita el archivo de su sección en `src/components/home/` o la página en `src/pages/proyectos/`. Si existe en inglés, hay que cambiarlo también en `public/js/i18n.js`.

## Trabajar en local

```
npm install
npm run dev      # http://localhost:4321
npm run build    # genera la web en dist/
```

## Pendiente

- CV en PDF: los botones "CV" llevan por ahora a la sección Sobre mí.
- Versión en inglés con páginas propias en `/en/`. Ahora se traduce en el navegador y Google no la indexa.

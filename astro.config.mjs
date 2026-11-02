import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://andreablancolopez.com',
  trailingSlash: 'ignore',
  integrations: [sitemap()],
});

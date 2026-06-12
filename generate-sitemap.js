import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { gamesData } from './src/data/games.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SITEMAP_FILE = path.join(__dirname, 'public', 'sitemap.xml');
const BASE_URL = 'https://hellyeah-games.com';

const generateSitemap = () => {
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${BASE_URL}/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${BASE_URL}/games</loc>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${BASE_URL}/pricing</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
`;

  gamesData.forEach(game => {
    xml += `  <url>
    <loc>${BASE_URL}/game/${game.id}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>\n`;
  });

  xml += `</urlset>`;

  fs.writeFileSync(SITEMAP_FILE, xml, 'utf8');
  console.log(`Generated sitemap.xml with ${gamesData.length + 3} URLs!`);
};

generateSitemap();

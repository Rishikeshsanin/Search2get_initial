import { existsSync, readFileSync } from 'node:fs';
import { extname } from 'node:path';

const required = [
  'index.html', 'shop.html', 'journal.html', 'reviews.html', 'contact.html', 'account.html', '404.html',
  'store.js', 'storefront.css', 'assets/search2get-logo.svg', 'assets/favicon.svg', 'assets/readme-banner.svg',
  'README.md', 'DATA_SOURCE.md', 'vercel.json'
];

const primaryHtml = ['index.html', 'shop.html', 'journal.html', 'reviews.html', 'contact.html', 'account.html', '404.html'];
const redirects = ['clothes.html', 'bloger.html', 'reviewer.html', 'contacter.html', 'login.html'];
const forbidden = [
  'index.css', 'index.js', 'v3.css', 'visual-refresh.js',
  'hero-1.png', 'main.png', 'i1.png',
  'M1.webp', 'M2.webp', 'M3.webp', 'men1.webp',
  'g1.webp', 'g2.webp', 'g3.webp', 'g4.webp', 'trend1.webp', 'trend2.webp'
];

let failed = false;
const fail = (message) => { console.error(`✖ ${message}`); failed = true; };
const pass = (message) => console.log(`✓ ${message}`);

for (const file of required) {
  if (!existsSync(file)) fail(`Missing required file: ${file}`);
}
if (!failed) pass('Required V4 files are present');

for (const file of forbidden) {
  if (existsSync(file)) fail(`Superseded V1/V3 asset still exists: ${file}`);
}
if (!forbidden.some(existsSync)) pass('Superseded visual/application assets are absent');

const localRefPattern = /(?:src|href)=["']([^"']+)["']/g;
for (const file of [...primaryHtml, ...redirects]) {
  if (!existsSync(file)) continue;
  const html = readFileSync(file, 'utf8');
  for (const match of html.matchAll(localRefPattern)) {
    const value = match[1];
    if (/^(?:https?:|mailto:|tel:|data:|#)/.test(value)) continue;
    const clean = value.split(/[?#]/)[0];
    if (!clean || clean === '/') continue;
    if (!existsSync(clean)) fail(`${file} references missing local file: ${clean}`);
  }
}
if (!failed) pass('Local HTML asset/link references resolve');

for (const file of primaryHtml) {
  if (!existsSync(file)) continue;
  const html = readFileSync(file, 'utf8');
  if (file !== '404.html' && !html.includes('store.js')) fail(`${file} does not load store.js`);
  if (!html.includes('storefront.css')) fail(`${file} does not load storefront.css`);
  if (!html.includes('assets/favicon.svg')) fail(`${file} does not use the V4 favicon`);
  for (const stale of forbidden) {
    if (html.includes(stale)) fail(`${file} still references superseded asset ${stale}`);
  }
}
if (!failed) pass('Primary pages use the V4 storefront bundle');

const app = readFileSync('store.js', 'utf8');
for (const category of ['mens-shirts', 'mens-shoes', 'tops', 'womens-dresses', 'womens-shoes', 'womens-bags']) {
  if (!app.includes(`'${category}'`)) fail(`store.js is missing apparel category ${category}`);
}
if (!app.includes('dummyjson.com')) fail('store.js is missing the catalog API');
if (!app.includes('fallbackProducts')) fail('store.js is missing catalog fallback logic');
if (!app.includes('placeholderDataURI')) fail('store.js is missing image fallback logic');
if (!failed) pass('Catalog API and failure fallbacks are wired');

try {
  JSON.parse(readFileSync('vercel.json', 'utf8'));
  pass('vercel.json is valid JSON');
} catch (error) {
  fail(`Invalid vercel.json: ${error.message}`);
}

if (failed) process.exit(1);
console.log('\nSearch2Get V4 static validation passed.');

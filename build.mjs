import { execSync } from 'child_process';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const { minify } = await import('html-minifier-terser');
const sharp = (await import('sharp')).default;

const SRC = __dirname;
const DIST = path.join(__dirname, 'dist');

const HTML_FILES = [
  'index.html',
  'problem.html',
  'causes.html',
  'effects.html',
  'evidence.html',
  'solutions.html',
  'conclusion.html',
];

const IMAGES = [
  'assets/pine-beetle-damage.png',
  'pdf-images/page-04-image-01.png',
  'pdf-images/page-05-image-01.png',
  'pdf-images/page-08-image-01.png',
  'pdf-images/page-09-image-01.png',
  'pdf-images/page-10-image-01.png',
  'pdf-images/page-11-image-01.png',
];

// Rewrite internal .html links to clean URL paths for Vercel's cleanUrls feature
function rewriteLinks(html) {
  return html
    .replace(/href="index\.html"/g, 'href="/"')
    .replace(/href="([a-z][a-z0-9_-]*)\.html"/g, 'href="/$1"');
}

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

async function buildCSS() {
  console.log('Building CSS...');
  const cleancss = path.join(__dirname, 'node_modules', '.bin', 'cleancss');
  execSync(
    `"${cleancss}" -o "${path.join(DIST, 'styles.css')}" "${path.join(SRC, 'styles.css')}"`,
    { stdio: 'inherit' }
  );
}

async function buildImages() {
  console.log('Optimizing images...');
  for (const imgRel of IMAGES) {
    const srcPath = path.join(SRC, imgRel);
    const destPath = path.join(DIST, imgRel);
    await ensureDir(path.dirname(destPath));

    const stat = await fs.stat(srcPath);
    const sizeMB = stat.size / 1024 / 1024;

    if (sizeMB > 1) {
      // Resize large hero image to max 1400px wide
      await sharp(srcPath)
        .resize({ width: 1400, withoutEnlargement: true })
        .png({ compressionLevel: 9, adaptiveFiltering: true })
        .toFile(destPath);
    } else {
      await sharp(srcPath)
        .png({ compressionLevel: 9, adaptiveFiltering: true })
        .toFile(destPath);
    }
  }
}

async function buildHTML() {
  console.log('Minifying HTML...');
  for (const file of HTML_FILES) {
    const srcPath = path.join(SRC, file);
    const destPath = path.join(DIST, file);
    let html = await fs.readFile(srcPath, 'utf8');

    html = rewriteLinks(html);

    const minified = await minify(html, {
      collapseWhitespace: true,
      removeComments: true,
      removeRedundantAttributes: true,
      removeScriptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true,
      useShortDoctype: false,
      minifyCSS: false,
      minifyJS: false,
    });

    await ensureDir(path.dirname(destPath));
    await fs.writeFile(destPath, minified, 'utf8');
  }
}

async function build() {
  console.log('Cleaning dist/...');
  await fs.rm(DIST, { recursive: true, force: true });
  await ensureDir(DIST);

  await buildCSS();
  await buildImages();
  await buildHTML();

  console.log('Build complete. Output in dist/');
}

build().catch((err) => {
  console.error(err);
  process.exit(1);
});

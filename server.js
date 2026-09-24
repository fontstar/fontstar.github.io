import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { Liquid } from 'liquidjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';

const engine = new Liquid({
  root: [__dirname, path.join(__dirname, '_includes')],
  partials: path.join(__dirname, '_includes'),
  extname: '.html',
  jekyllInclude: true,
  dynamicPartials: false
});

function stripFrontmatter(content) {
  return content.replace(/^---[\s\S]*?---\s*/, '');
}

async function renderHtmlFile(filePath, res) {
  try {
    if (!fs.existsSync(filePath)) {
      return res.status(404).send('Page not found');
    }
    const rawContent = fs.readFileSync(filePath, 'utf-8');
    const cleanContent = stripFrontmatter(rawContent);
    const html = await engine.parseAndRender(cleanContent, {}, {
      root: [path.dirname(filePath), path.join(__dirname, '_includes'), __dirname]
    });
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.send(html);
  } catch (err) {
    console.error(`Error rendering ${filePath}:`, err);
    return res.status(500).send('Internal Server Error');
  }
}

// Routes for the known Jekyll pages
app.get('/', (req, res) => {
  renderHtmlFile(path.join(__dirname, 'index.html'), res);
});

app.get(['/faq', '/faq/'], (req, res) => {
  renderHtmlFile(path.join(__dirname, 'faq', 'index.html'), res);
});

app.get(['/privacy', '/privacy/'], (req, res) => {
  renderHtmlFile(path.join(__dirname, 'privacy', 'index.html'), res);
});

app.get(['/tutorial', '/tutorial/'], (req, res) => {
  renderHtmlFile(path.join(__dirname, 'tutorial', 'index.html'), res);
});

// Middleware to intercept any request ending in .html
app.get('*.html', (req, res, next) => {
  const targetPath = path.join(__dirname, req.path);
  if (fs.existsSync(targetPath)) {
    return renderHtmlFile(targetPath, res);
  }
  next();
});

// Static files (CSS, images, manifests, etc.)
app.use(express.static(__dirname, {
  index: false // Do not serve raw index.html without Liquid processing
}));

// Fallback to homepage for any unmatched navigation
app.use((req, res) => {
  if (req.accepts('html')) {
    renderHtmlFile(path.join(__dirname, 'index.html'), res);
  } else {
    res.status(404).end();
  }
});

app.listen(PORT, HOST, () => {
  console.log(`FontStar server running on http://${HOST}:${PORT}`);
});

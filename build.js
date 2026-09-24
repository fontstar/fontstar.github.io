import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Liquid } from 'liquidjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const engine = new Liquid({
  root: [__dirname, path.join(__dirname, '_includes')],
  partials: path.join(__dirname, '_includes'),
  extname: '.html',
  jekyllInclude: true,
  dynamicPartials: false
});

// Helper to strip Jekyll frontmatter
export function stripFrontmatter(content) {
  return content.replace(/^---[\s\S]*?---\s*/, '');
}

// Function to render a template file
export async function renderTemplate(filePath) {
  const rawContent = fs.readFileSync(filePath, 'utf-8');
  const cleanContent = stripFrontmatter(rawContent);
  const rendered = await engine.parseAndRender(cleanContent, {}, {
    root: [path.dirname(filePath), path.join(__dirname, '_includes'), __dirname]
  });
  return rendered;
}

async function build() {
  console.log('Testing rendering of all Jekyll HTML pages...');
  const pages = [
    { src: path.join(__dirname, 'index.html'), name: 'Homepage' },
    { src: path.join(__dirname, 'faq', 'index.html'), name: 'FAQ' },
    { src: path.join(__dirname, 'privacy', 'index.html'), name: 'Privacy' },
    { src: path.join(__dirname, 'tutorial', 'index.html'), name: 'Tutorial' }
  ];

  for (const page of pages) {
    try {
      const output = await renderTemplate(page.src);
      if (!output || !output.includes('<!DOCTYPE html>')) {
        throw new Error(`Output for ${page.name} does not contain <!DOCTYPE html>`);
      }
      console.log(`✓ ${page.name} rendered successfully (${output.length} bytes)`);
    } catch (err) {
      console.error(`✗ Error rendering ${page.name}:`, err);
      process.exit(1);
    }
  }

  console.log('Build validation passed successfully!');
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  build();
}

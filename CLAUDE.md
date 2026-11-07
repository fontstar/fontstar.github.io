# FontStar website — working rules

Marketing site for FontStar (Safari extension), served by GitHub Pages (Jekyll) at https://fontstar.github.io.

## How Jensen works
- Commit straight to `main` and push. No branches, no pull requests. Jensen reviews on the live site.
- Small, self-contained commits with plain-English messages describing what changes on the page, so any step can be undone with `git revert <sha>`. Never rewrite history or force-push.
- `git pull --rebase origin main` before every push.
- After pushing, wait for GitHub Pages to rebuild (~1 min), load the changed live URLs, check them (Playwright screenshots at 1280px desktop and 390px phone), and tell Jensen which URLs to check.

## Site structure
- Jekyll: shared markup lives in `_includes/` (head.html, header.html, footer.html). Pages: `index.html`, `faq/`, `privacy/`, `tutorial/`. One stylesheet: `css/style.css`. Images in `/images`.
- `build.js` (liquidjs) only test-renders pages locally (`npm run build`); `server.js` is a local preview (`npm run dev`). GitHub Pages does the real build.
- Keep the Cloudflare Web Analytics snippet in `_includes/head.html`.

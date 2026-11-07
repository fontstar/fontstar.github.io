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

## Light / dark theme
- `/theme.js` is loaded synchronously in `_includes/head.html` right after the viewport meta (before the stylesheet) so there is no flash. Default follows the device (prefers-color-scheme); the `.theme-toggle` button (in `_includes/site-controls.html`, top-right, absolutely positioned so header height never changes) switches and saves the choice in `localStorage.theme`. Until the visitor picks, live device changes are followed. It sets `data-theme` on `<html>` and updates `<meta name="theme-color">` (light #f9fafb / dark #111111).
- Never hardcode a light-surface colour. Every colour lives as a variable in `:root` in `css/style.css` (light values) and is overridden in the `[data-theme="dark"]` block. This includes page `<style>` blocks, inline `style=""` and inline SVG `fill`/`stroke` (use `currentColor` or a variable).
- Dark palette rules (Jensen's preferences): soft text, never pure white (primary #dedede, secondary #9d9d9d); page bg #111, raised surfaces #1a1a1a; bold black outlines become light grey (~#9a9a9a), not white; all `<img>`/`<video>` get `filter: brightness(0.82)`; black line icons get inverted.
- Fixed in both themes on purpose: purple step-number badge, App Store badge, tutorial overlay and its blue button.
- The homepage has no shared header (it has its own hero), so it includes `site-controls.html` directly.
- When changing styles, check every page in both themes at 1280px and 390px.

## Tutorial page
- Two tabs (`iPhone & iPad`, `Mac`) built as an accessible tablist in `tutorial/index.html`. URL hash `#mac` / `#iphone-ipad` selects a tab; otherwise Macs get the Mac tab (iPads reporting as Mac are detected via `navigator.maxTouchPoints > 1`). Keep step content for each device in its own panel.

## Git hygiene
- Stage files by name (`git add <files>`), never `git add -A`: local `node_modules/` once slipped into a commit.

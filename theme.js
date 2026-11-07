/*
 * Light / dark theme (same approach as jensenxyz.github.io).
 * Loaded synchronously in <head>, right after the viewport meta and before the
 * stylesheet, so the saved theme applies before first paint (no flash).
 * Default: follow the device setting. A click on any .theme-toggle button
 * switches theme and remembers the choice in localStorage. Until the visitor
 * picks, live device changes are followed. Sets data-theme on <html> and keeps
 * <meta name="theme-color"> in step.
 */
(function () {
    var root = document.documentElement;
    var KEY = 'theme';
    var COLORS = { light: '#f9fafb', dark: '#111111' };
    var media = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;

    function saved() {
        try { return localStorage.getItem(KEY); } catch (e) { return null; }
    }

    function syncUi(theme) {
        var buttons = document.querySelectorAll('.theme-toggle');
        for (var i = 0; i < buttons.length; i++) {
            buttons[i].setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
            buttons[i].setAttribute('title', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
        }
        var meta = document.querySelector('meta[name="theme-color"]');
        if (meta) meta.setAttribute('content', COLORS[theme]);
    }

    function apply(theme) {
        root.setAttribute('data-theme', theme);
        syncUi(theme);
    }

    var choice = saved();
    apply(choice === 'dark' || choice === 'light' ? choice : (media && media.matches ? 'dark' : 'light'));

    if (media) {
        var onChange = function (e) { if (!saved()) apply(e.matches ? 'dark' : 'light'); };
        if (media.addEventListener) media.addEventListener('change', onChange);
        else if (media.addListener) media.addListener(onChange);
    }

    document.addEventListener('DOMContentLoaded', function () {
        syncUi(root.getAttribute('data-theme'));
    });

    document.addEventListener('click', function (e) {
        var btn = e.target.closest ? e.target.closest('.theme-toggle') : null;
        if (!btn) return;
        var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        apply(next);
        try { localStorage.setItem(KEY, next); } catch (err) { /* private mode: still switches */ }
    });
})();

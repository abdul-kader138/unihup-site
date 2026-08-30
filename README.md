# UniHup — marketing site

A small, static informational website for **UniHup**, the Laravel + Filament app for
finding and comparing Italian university degree programs by subject and degree level.

It is intentionally simple: one hand-written HTML page, one stylesheet, one tiny JS
file. No build step, no framework, no dependencies.

## Structure

```
index.html        The whole page
styles.css        All styling (light + dark, responsive; brand navy accent)
app.js            Footer year + mobile menu toggle
assets/logo.jpeg  UniHup brand logo — used in the header, footer and as the favicon
```

## Contact details

Shown in the Contact section and the footer:

- Email: `unihup13@gmail.com`
- Phone: `+39 329 77322`

## Develop / preview

Open `index.html` directly, or serve the folder:

```bash
python3 -m http.server 4173
# then visit http://localhost:4173
```

## Configure before publishing

Replace the placeholder app URL `https://app.unihup.example` everywhere it appears
in `index.html` with the real address of the UniHup panel:

```bash
grep -rl 'app.unihup.example' . --include='*.html'
```

Also review the copy in the **About the data** and **FAQ** sections so it matches the
current dataset and any disclaimers you want to make.

`assets/logo.jpeg` is ~220 KB at 1254×1254. For production, consider exporting a
smaller header-sized copy (and a proper `.ico`/`.png` favicon) — the markup will pick
them up if you keep the same filenames or update the `<link rel="icon">` tags.

## Deploy

It is a static site — host it anywhere:

- **GitHub Pages:** push to a repo, enable Pages on the default branch (root).
- **Netlify / Cloudflare Pages / Vercel:** point at the repo, no build command,
  publish directory `.`.
- **Any web server / bucket:** upload the files as-is.

## Notes

- Content summarises Italy's national admission processes and links to the official
  portals; this site is not an official channel.
- Not affiliated with any Italian ministry or university.

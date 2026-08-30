# UniHup — marketing site

A small, static informational website for **UniHup**, the Laravel + Filament app for
finding and comparing Italian university degree programs by subject and degree level.

It is intentionally simple: one hand-written HTML page, one stylesheet, one tiny JS
file. No build step, no framework, no dependencies.

## Structure

```
index.html        The whole page
styles.css        All styling (light + dark, responsive)
app.js            Footer year + mobile menu toggle
assets/favicon.svg
```

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

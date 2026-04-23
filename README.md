# Han YH Dev Blog

Personal static blog for `hyh.qd.je`, published by GitHub Pages.

## Publish a post

1. Open `admin.html` in the published site or locally.
2. Write the draft and generate a `posts.js` entry.
3. Paste the generated object into `window.BLOG_POSTS` in `posts.js`.
4. Commit and push to `main`.

The site is intentionally static. GitHub Pages does not run a server-side
database, so publishing is done by updating repository files.

## Page views

The site uses Busuanzi's front-end counter for site/page PV display. If you
want private analytics later, replace that script with a GoatCounter or
self-hosted analytics snippet.

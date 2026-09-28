# issei-en

The website [issei-en.com](https://issei-en.com): every page, image, font and
script, served on GitHub Pages at https://geremyrobinson.github.io/issei-en/.

`site/` holds the full site, one commit per publish. Every 15 minutes
`.github/workflows/sync.yml` checks whether the site was republished and, if so,
exports it with `tools/export.mjs`, commits it to `site/` and deploys it. To
update right away, open the **Actions** tab, pick **Sync site** and click
**Run workflow**.

`site/` is overwritten on every sync, so make design changes at the source.
Forms, site search and analytics that depend on the original host won't work in
this copy.

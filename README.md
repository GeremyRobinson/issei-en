# issei-en

A static copy of [issei-en.com](https://issei-en.com), exported from Framer and
hosted on GitHub Pages at https://geremyrobinson.github.io/issei-en/.

GitHub builds the copy itself: `.github/workflows/deploy.yml` runs
`tools/framer-export.mjs` against the live Framer site and publishes the result.
To refresh it after editing the site in Framer, open the **Actions** tab, pick
**Export from Framer and publish**, and click **Run workflow**.

Things that only work on Framer's hosting (forms, CMS search, analytics) won't
work in this copy.

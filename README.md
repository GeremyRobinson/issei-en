# issei-en

A static copy of [issei-en.com](https://issei-en.com), exported from Framer and
hosted on GitHub Pages at https://geremyrobinson.github.io/issei-en/.

It is connected with Framer Bridge. GitHub builds the copy itself: `.github/workflows/framer-bridge.yml` runs
`tools/framer-export.mjs` against the live Framer site and publishes the result.

It stays in sync on its own: every 15 minutes it checks whether the Framer site
was republished and, if so, re-exports, commits the full exported site to
`site/` and redeploys. GitHub sometimes runs its timer late or skips a run, so
to update right away press **Check now** in Bridge, or open the **Actions** tab,
pick **Framer Bridge sync**, and click **Run workflow**.

`site/` is overwritten on every sync, so edit the design in Framer, not here.

Things that only work on Framer's hosting (forms, CMS search, analytics) won't
work in this copy.

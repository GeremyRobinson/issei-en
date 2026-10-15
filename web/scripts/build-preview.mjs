#!/usr/bin/env node
// Build the chat preview: the whole app, its images and font in one HTML file.
//
//   npm run build:preview   ->  dist-preview/issei-en-preview.html

import { execFileSync } from "node:child_process";
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const out = path.join(root, "dist-preview");
execFileSync("npx", ["vite", "build", "--mode", "preview"], { cwd: root, stdio: "inherit" });

const html = readFileSync(path.join(out, "preview.html"), "utf8");
const file = (p) => readFileSync(path.join(out, p.replace(/^\//, "")));
const dataUri = (p, type) => `data:${type};base64,${readFileSync(path.join(root, "public", p)).toString("base64")}`;

const assets = {};
for (const f of readdirSync(path.join(root, "public/images"))) assets[`/images/${f}`] = dataUri(`images/${f}`, "image/webp");

let css = "";
for (const [, href] of html.matchAll(/<link rel="stylesheet"[^>]*href="([^"]+)"/g)) css += file(href).toString();
css = css.replaceAll("/fonts/trainer-grotesk.woff2", dataUri("fonts/trainer-grotesk.woff2", "font/woff2"));
const [, src] = html.match(/<script type="module"[^>]*src="([^"]+)"/);
const js = file(src).toString().replaceAll("</script", "<\\/script");

const page = `<title>ISSEI—EN Preview</title>
<style>${css}</style>
<div id="root"></div>
<script>window.__ASSETS__=${JSON.stringify(assets)};</script>
<script type="module">${js}</script>
`;
writeFileSync(path.join(out, "issei-en-preview.html"), page);
console.log(`Wrote dist-preview/issei-en-preview.html (${Math.round(page.length / 1024)} KB)`);

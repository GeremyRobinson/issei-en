#!/usr/bin/env node
// Turn the CMS export in ../project/cms into the site's data files.
//
//   node scripts/import-cms.mjs
//
// Public tea data goes to src/data/teas.json (shipped to the browser).
// Trade prices go to server/trade-prices.json, which only the vendor API
// reads, so they never reach a visitor who is not signed in.

import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const cms = path.join(root, "..", "project", "cms");

function collection(file) {
  const c = JSON.parse(readFileSync(path.join(cms, file), "utf8"));
  const names = Object.fromEntries(c.fields.map((f) => [f.id, f.name]));
  return c.items
    .filter((item) => !item.draft)
    .map((item) => {
      const fields = Object.fromEntries(
        Object.entries(item.fieldData).map(([id, v]) => [names[id] ?? id, v.value]),
      );
      return { slug: item.slug, ...fields };
    });
}

const index = collection("Index.json");
const products = collection("Products.json");
const text = (v) => (typeof v === "string" ? v.trim() : "");

const teas = index.map((t) => {
  const retail = products.find((p) => p.slug === t.slug);
  return {
    slug: t.slug,
    code: text(t.Code),
    title: text(t.Title),
    type: text(t.Type),
    region: text(t.Region),
    cultivar: text(t.Cultivar),
    notes: text(t.Note),
    details: text(t.Details),
    available: t.Available !== false,
    sweetness: text(t.Sweetness) || null,
    umami: t.Type === "Matcha" ? Number(t.Umami) || 0 : null,
    roast: text(t.Roast) || null,
    roastLevel: t.Type === "Hojicha" ? Number(t["Roast Level"]) || 1 : null,
    toast: t.Type === "Hojicha" ? text(t.Toast) || null : null,
    retail: retail ? { size: text(retail.Size) || "(100g)", price: Number(retail["100g"]) } : null,
  };
});

const tradePrices = Object.fromEntries(
  index.map((t) => [
    t.slug,
    {
      "40g": Number(t["40g"]) || null,
      "1kg": Number(t["1kg"]) || null,
      "10kg": Number(t["10kg"]) || null,
      "50kg": Number(t["50kg"]) || null,
    },
  ]),
);

writeFileSync(path.join(root, "src/data/teas.json"), JSON.stringify(teas, null, 2) + "\n");
writeFileSync(path.join(root, "server/trade-prices.json"), JSON.stringify(tradePrices, null, 2) + "\n");
console.log(`Wrote ${teas.length} teas and their trade prices.`);

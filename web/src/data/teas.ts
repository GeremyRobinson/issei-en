import data from "./teas.json";
import { asset } from "../lib/assets";

export type Tea = {
  slug: string;
  code: string;
  title: string;
  type: "Matcha" | "Hojicha" | string;
  region: string;
  cultivar: string;
  notes: string;
  details: string;
  available: boolean;
  sweetness: string | null;
  umami: number | null;
  roast: string | null;
  roastLevel: number | null;
  toast: string | null;
  retail: { size: string; price: number } | null;
};

export const TEAS = data as Tea[];
export const TYPES = ["Matcha", "Hojicha"] as const;

export const teaBySlug = (slug: string | undefined) => TEAS.find((t) => t.slug === slug);
export const image = (t: Tea, n: 1 | 2 | 3) => asset(`/images/${t.slug}-${n}.webp`);
export const label = (t: Tea) => `${t.code}, ${t.title}`;

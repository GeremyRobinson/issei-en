/**
 * Where a public file lives. Normally its path; the single-file chat preview
 * (scripts/build-preview.mjs) supplies the files inline instead.
 */
declare global {
  interface Window {
    __ASSETS__?: Record<string, string>;
  }
}
export const asset = (path: string) => (typeof window !== "undefined" && window.__ASSETS__?.[path]) || path;

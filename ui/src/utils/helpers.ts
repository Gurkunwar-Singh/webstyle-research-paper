// utils/helpers.ts - UPDATE THIS FILE
export function colorToHex(c: string): string {
  if (!c) return "#ccc";
  if (c.startsWith("#")) return c;
  if (c.startsWith("oklch")) return "#888";
  const m = c.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (!m) return "#ccc";
  return "#" + [m[1], m[2], m[3]].map(n => parseInt(n).toString(16).padStart(2, "0")).join("");
}

export function formatColor(c: string): string {
  if (!c) return "—";
  if (c.startsWith("oklch")) return c.slice(0, 22) + "…";
  return c;
}

// FIX THIS FUNCTION - add the 'cls' property
export function wcagLabel(r: number): { text: string; cls: string } {
  if (r >= 7) return { text: "AAA", cls: "badge-aaa" };
  if (r >= 4.5) return { text: "AA", cls: "badge-aa" };
  return { text: "Fail", cls: "badge-fail" };
}
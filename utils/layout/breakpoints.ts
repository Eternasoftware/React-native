export const COMPACT_MAX_WIDTH = 1000;

export type LayoutVariant = "compact" | "expanded";

export function getLayoutVariant(screenWidth: number): LayoutVariant {
  return screenWidth < COMPACT_MAX_WIDTH ? "compact" : "expanded";
}

export function isCompactLayout(screenWidth: number): boolean {
  return getLayoutVariant(screenWidth) === "compact";
}

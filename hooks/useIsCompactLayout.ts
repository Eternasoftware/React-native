import { useLayoutVariant } from "@/hooks/useLayoutVariant";

export function useIsCompactLayout(): boolean {
  return useLayoutVariant() === "compact";
}

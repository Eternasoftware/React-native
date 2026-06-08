import { useIsCompactLayout } from "@/hooks/useIsCompactLayout";
import HacksPageCompact from "@/components/features/hacks/HacksPage.compact";
import HacksPageExpanded from "@/components/features/hacks/HacksPage.expanded";

export default function HacksPage() {
  const isCompact = useIsCompactLayout();
  return isCompact ? <HacksPageCompact /> : <HacksPageExpanded />;
}

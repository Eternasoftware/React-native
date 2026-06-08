import { useIsCompactLayout } from "@/hooks/useIsCompactLayout";
import ProgramsPageCompact from "@/components/features/programs/ProgramsPage.compact";
import ProgramsPageExpanded from "@/components/features/programs/ProgramsPage.expanded";

export default function ProgramsPage() {
  const isCompact = useIsCompactLayout();
  return isCompact ? <ProgramsPageCompact /> : <ProgramsPageExpanded />;
}

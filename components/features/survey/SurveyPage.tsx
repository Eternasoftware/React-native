import SurveyScreen from "@/components/features/survey/screens/SurveyScreen";
import { useSurveyPage } from "@/components/features/survey/hooks/useSurveyPage";

export default function SurveyPage() {
  useSurveyPage();
  return <SurveyScreen />;
}

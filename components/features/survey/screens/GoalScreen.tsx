import React, { useEffect, useState } from "react";
import { useIsCompactLayout } from "@/hooks/useIsCompactLayout";
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  LayoutChangeEvent,
} from "react-native";
import DefaultButton from "@/components/common/DefaultButton";
import { colors } from "@/assets/styles/constants";
import NavHeader from "@/components/shared/NavHeader";
import CheckItem from "@/components/shared/CheckItem";
import { LOCALIZATION_KEYS } from "@/utils/constants/localization";
import useSettingsStore from "@/store/settingsStore";
import { Goal } from "@/types/users.type";
import { useShallow } from "zustand/react/shallow";

type GoalScreenProps = {
  onBack: () => void;
  onNext: (goal: Goal[]) => void;
};

const GoalScreen: React.FC<GoalScreenProps> = ({ onBack, onNext }) => {
  const { localization } = useSettingsStore(
    useShallow((s) => ({
      localization: s.localization,
    }))
  );

  const [goalsToReturn, setGoalsToReturn] = useState<Goal[]>([]);
  const isCompact = useIsCompactLayout();
  const [isScrollable, setIsScrollable] = useState(false);
  const [scrollViewHeight, setScrollViewHeight] = useState(0);
  const [goals, setGoals] = useState([
    {
      id: 0,
      title: localization.t(LOCALIZATION_KEYS.TXT_OPTION_GOAL_01),
      key: LOCALIZATION_KEYS.TXT_OPTION_GOAL_01,
      value: false,
    },
    {
      id: 1,
      title: localization.t(LOCALIZATION_KEYS.TXT_OPTION_GOAL_02),
      key: LOCALIZATION_KEYS.TXT_OPTION_GOAL_02,
      value: false,
    },
    {
      id: 2,
      title: localization.t(LOCALIZATION_KEYS.TXT_OPTION_GOAL_03),
      key: LOCALIZATION_KEYS.TXT_OPTION_GOAL_03,
      value: false,
    },
    {
      id: 3,
      title: localization.t(LOCALIZATION_KEYS.TXT_OPTION_GOAL_04),
      key: LOCALIZATION_KEYS.TXT_OPTION_GOAL_04,
      value: false,
    },
    {
      id: 4,
      title: localization.t(LOCALIZATION_KEYS.TXT_OPTION_GOAL_05),
      key: LOCALIZATION_KEYS.TXT_OPTION_GOAL_05,
      value: false,
    },
    {
      id: 5,
      title: localization.t(LOCALIZATION_KEYS.TXT_OPTION_GOAL_06),
      key: LOCALIZATION_KEYS.TXT_OPTION_GOAL_06,
      value: false,
      text: "",
    },
  ]);

  const getDataForSurvey = () => {
    const data: Goal[] = [];

    goals.forEach((goal) => {
      if (goal.value) {
        const item: any = {
          key: goal.key,
        };
        if (goal.text) item.text = goal.text;
        data.push(item);
      }
    });

    setGoalsToReturn(data);
  };

  useEffect(() => {
    getDataForSurvey();
  }, [goals]);

  const handleContentSizeChange = (contentWidth: number, contentHeight: number) => {
    setIsScrollable(contentHeight > scrollViewHeight);
  };

  const handleLayout = (event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    setScrollViewHeight(height);
  };

  return (
    <View style={[styles.container, !isCompact && { paddingHorizontal: 32, paddingTop: 32 }]}>
      <View style={styles.content}>
        <NavHeader onBack={onBack} text="" />

        <View style={styles.textBlock}>
          <Text style={styles.title}>{localization.t(LOCALIZATION_KEYS.TITLE_GOAL)}</Text>
          <Text style={styles.descriptionText}>{localization.t(LOCALIZATION_KEYS.DESCR_GOAL)}</Text>
        </View>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          keyboardVerticalOffset={64}
          style={{ flex: 1 }}
        >
          <ScrollView
            scrollEnabled={isScrollable}
            onContentSizeChange={handleContentSizeChange}
            onLayout={handleLayout}
            showsVerticalScrollIndicator={false}
          >
            <View style={[styles.goalsContainer, styles.scrollContent]}>
              {goals.map((item, index) => (
                <CheckItem
                  text={item.title}
                  value={item.value}
                  onChange={() => {
                    setGoals((prevGoals) =>
                      prevGoals.map((goal) =>
                        goal.id === item.id ? { ...goal, value: !item.value } : goal
                      )
                    );
                  }}
                  key={item.id}
                  customValue={index === goals.length - 1}
                />
              ))}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>

        <View style={{ marginBottom: 57 }}>
          <DefaultButton
            text={localization.t(LOCALIZATION_KEYS.BTN_CONTINUE)}
            bg={colors.surface.app}
            bgActive={colors.action.primary}
            width={155}
            py={8}
            onPress={() => {
              Keyboard.dismiss();
              onNext(goalsToReturn);
            }}
            textActive={colors.text.onLight}
            btnStyle={styles.button}
            color={colors.text.body}
            textStyle={styles.buttonText}
            disabled={!goalsToReturn.length}
          ></DefaultButton>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
    backgroundColor: colors.surface.splash,
  },
  scrollContent: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 35,
  },
  content: {
    flex: 1,
  },
  goalsContainer: {
    flex: 1,
    width: "100%",
    gap: 16,
    maxWidth: 476,
    marginHorizontal: "auto",
    paddingBottom: 20,
  },
  goalItem: {},
  textBlock: {
    paddingTop: 24,
    marginBottom: 34,
    gap: 26,
    alignItems: "center",
    paddingHorizontal: 35,
  },
  title: {
    fontFamily: "HelveticaNow-Black",
    color: colors.text.body,
    fontSize: 24,
    textTransform: "capitalize",
    textAlign: "center",
    maxWidth: 476,
  },
  descriptionText: {
    fontFamily: "HelveticaNow-Regular",
    textAlign: "center",
    fontSize: 14,
    color: colors.text.body,
    maxWidth: 476,
  },
  button: {
    marginTop: 25,
  },
  buttonText: {
    fontFamily: "Poppins-Bold",
    fontSize: 18,
    color: colors.text.body,
    textAlign: "center",
  },
});

export default GoalScreen;

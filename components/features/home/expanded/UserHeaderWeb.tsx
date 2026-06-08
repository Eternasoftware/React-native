import { colors } from "@/assets/styles/constants";

import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, Keyboard } from "react-native";
import { formatDate } from "@/utils/functions";
import SearchIcon from "@icons/common/search-icon.svg";
import { LOCALIZATION_KEYS } from "@/utils/constants/localization";
import useSettingsStore from "@/store/settingsStore";
import { TextInput } from "react-native-paper";
import { useShallow } from "zustand/react/shallow";

type UserHeaderWebProps = {
  name: string;
  onSearch: (val: string) => void;
  onFocus: () => void;
  value: string;
};

const UserHeaderWeb: React.FC<UserHeaderWebProps> = ({ name, onSearch, onFocus, value = "" }) => {
  const { localization } = useSettingsStore(
    useShallow((s) => ({
      localization: s.localization,
    }))
  );

  const date = formatDate(new Date());
  const [inputValue, setInputValue] = useState(value);

  const greeting = name
    ? localization.t(LOCALIZATION_KEYS.TITLE_GREETINGS_NAME).replace("{0}", name)
    : localization.t(LOCALIZATION_KEYS.TITLE_GREETINGS);

  useEffect(() => {
    onSearch(inputValue);
  }, [inputValue]);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  return (
    <View style={styles.container}>
      <View style={styles.contentBox}>
        <View style={styles.header}>
          <View>
            <Text style={styles.date}>{date}</Text>
            <Text style={styles.name}>{greeting}</Text>
          </View>
        </View>

        <View style={styles.contentInput}>
          <View style={styles.inputContainer}>
            <TextInput
              value={inputValue}
              onChangeText={(val) => {
                setInputValue(val);
              }}
              mode="outlined"
              onBlur={() => {
                Keyboard.dismiss();
              }}
              onFocus={onFocus}
              contentStyle={{ padding: 16 }}
              theme={{
                colors: {
                  primary: "transparent",
                  background: "transparent",
                },
                roundness: 60,
              }}
              textColor={colors.text.inverse}
              outlineStyle={styles.outlineStyle}
            />
            <View style={styles.placeholderContainer}>
              {!inputValue && (
                <View style={styles.placeholder}>
                  <SearchIcon style={styles.placeholderSearch} />
                  <Text style={styles.placeholderText}>
                    {localization.t(LOCALIZATION_KEYS.TXT_SEARCH_PLACEHOLDER)}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface.splash,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  contentBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    minHeight: 80,
    width: "100%",
  },
  header: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    zIndex: 1,
  },
  contentInput: {
    flexDirection: "row",
    justifyContent: "center",
    flex: 1,
    alignItems: "center",
    width: "100%",
    maxWidth: 409,
  },

  inputContainer: {
    flex: 1,
  },
  date: {
    color: colors.text.accent,
    fontFamily: "HelveticaNow-Medium",
    fontSize: 12,
    paddingBottom: 4,
  },
  name: {
    color: colors.text.body,
    fontFamily: "HelveticaNow-Black",
    fontSize: 20,
  },
  search: {
    padding: 16,
  },
  placeholderContainer: {
    position: "absolute",
    flexDirection: "row",
    alignItems: "center",
    top: 0,
    bottom: 0,
    left: 0,
    zIndex: -1,
    backgroundColor: colors.surface.app,
    paddingLeft: 16,
    width: "100%",
    borderRadius: 50,
  },
  placeholder: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    opacity: 0.5,
    zIndex: -1,
  },
  placeholderText: {
    color: colors.text.body,
    fontFamily: "HelveticaNow-Regular",
    fontSize: 16,
  },
  placeholderSearch: {},
  outlineStyle: {
    borderWidth: 1,
    borderColor: colors.action.primary,
    padding: 16,
    flex: 1,
  },
});

export default React.memo(UserHeaderWeb);

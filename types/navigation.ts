export type TabScreenParams = {
  programGuid?: string;
  workoutGuid?: string;
  redirectedFrom?: string;
  isLogin?: boolean;
  isSignup?: boolean;
  linkTo?: string;
};

export type TabScreenNavigation = {
  setParams: (params: Partial<TabScreenParams>) => void;
  addListener(
    type: "state",
    callback: (e: { data: { state: { index: number; routes: { name: string }[] } } }) => void
  ): () => void;
  addListener(type: "tabPress", callback: () => void): () => void;
};

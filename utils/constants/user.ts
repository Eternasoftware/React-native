import { PROGRAM_CATEGORY } from "./programs";

export enum USER_TYPE {
  GUEST = "guest",
  EMAIL = "email",
}

export const AGE_COHORT = {
  [PROGRAM_CATEGORY.KIDS]: {
    from: 0,
    to: 12,
  },
  [PROGRAM_CATEGORY.ADULTS]: {
    from: 13,
    to: 45,
  },
  [PROGRAM_CATEGORY.SENIORS]: {
    from: 46,
    to: 200,
  },
};

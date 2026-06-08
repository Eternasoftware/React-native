import { CategoryTab } from "@/types/program.type";

export const enum PROGRAM_SCREENS {
  PROGRAMS = "programs",
  PROGRAM = "program",
  WORKOUT = "workout",
}

export enum PROGRAM_CATEGORY {
  ADULTS = "Adults",
  KIDS = "Kids",
  SENIORS = "Seniors",
}

export const categoryTabs: CategoryTab[] = [
  {
    icon: "/static-assets/category/seniors-v2.png",
    label: PROGRAM_CATEGORY.SENIORS,
  },
  {
    icon: "/static-assets/category/kids-v2.png",
    label: PROGRAM_CATEGORY.KIDS,
  },
  {
    icon: "/static-assets/category/adult-v2.png",
    label: PROGRAM_CATEGORY.ADULTS,
  },
];

import { create } from "zustand";
import { Favorites, ProgramType, SaveProgramResult, SaveVideoTime } from "@/types/program.type";
import ProgramsAPI from "@utils/api/program";
import { getDataFromPrograms } from "@/utils/functions";
import crashlytics from "@react-native-firebase/crashlytics";
import { Platform } from "react-native";
type ProgramState = {
  programs: ProgramType[] | null;
  favorites: Favorites | null;
  fetchProgram: () => Promise<void>;
  saveResult: (dto: SaveProgramResult) => Promise<void>;
  saveVideoTime: (dto: SaveVideoTime) => Promise<void>;
  addProgramToFavorite: (guid: string) => Promise<void>;
  removeProgramFromFavorite: (guid: string) => Promise<void>;
  addWorkoutToFavorite: (guid: string) => Promise<void>;
  removeWorkoutFromFavorite: (guid: string) => Promise<void>;
};

const useProgramStore = create<ProgramState>((set, get) => ({
  programs: null,
  favorites: null,
  fetchProgram: async () => {
    try {
      const response = await ProgramsAPI.getPrograms();
      const calculatedData = getDataFromPrograms(response);
      set({
        programs: response,
        favorites: calculatedData.favorites,
      });
    } catch (error: unknown) {
      console.error("Failed to fetch program:", error);
      if (Platform.OS === "android" || Platform.OS === "ios") {
        crashlytics().recordError(error as Error);
      }
    }
  },
  saveResult: async (dto: SaveProgramResult) => {
    try {
      const response = await ProgramsAPI.saveResults(dto);
      await get().fetchProgram();
    } catch (error) {
      console.error("Failed to fetch program:", error);
    }
  },
  saveVideoTime: async (dto: SaveVideoTime) => {
    try {
      const response = await ProgramsAPI.saveVideoTime(dto);
    } catch (error) {
      console.error("Failed to fetch program:", error);
    }
  },
  addProgramToFavorite: async (guid: string) => {
    try {
      const response = await ProgramsAPI.addProgramToFavorite(guid);
      await get().fetchProgram();
    } catch (error) {
      console.error("Failed add program to favorite:", error);
    }
  },
  removeProgramFromFavorite: async (guid: string) => {
    try {
      const response = await ProgramsAPI.removeProgramFromFavorite(guid);
      await get().fetchProgram();
    } catch (error) {
      console.error("Failed remove program from favorite:", error);
    }
  },
  addWorkoutToFavorite: async (guid: string) => {
    try {
      const response = await ProgramsAPI.addWorkoutToFavorite(guid);
      await get().fetchProgram();
    } catch (error) {
      console.error("Failed add workout to favorite:", error);
    }
  },
  removeWorkoutFromFavorite: async (guid: string) => {
    try {
      const response = await ProgramsAPI.removeWorkoutFromFavorite(guid);
      await get().fetchProgram();
    } catch (error) {
      console.error("Failed remove workout from favorite:", error);
    }
  },
}));

export default useProgramStore;

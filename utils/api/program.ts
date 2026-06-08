import { SaveProgramResult, SaveVideoTime } from "@/types/program.type";
import api from "./axios";

class ProgramsAPI {
  async getPrograms() {
    try {
      const response = await api.get("/program-playlists");
      return response.data;
    } catch (error) {
      console.error("Error fetching program:", error);
      throw new Error("Failed to fetch program");
    }
  }

  async saveResults(dto: SaveProgramResult) {
    try {
      const response = await api.post("/user-trainings-history/save-results", dto);
      return response;
    } catch (error) {
      console.error("Error save result:", error);
      throw new Error("Failed to save result");
    }
  }

  async saveVideoTime(dto: SaveVideoTime) {
    try {
      const response = await api.post("/workouts-video-progress", dto);
      return response;
    } catch (error) {
      console.error("Error save result:", error);
      throw new Error("Failed to save result");
    }
  }

  async addProgramToFavorite(guid: string) {
    try {
      const response = await api.post("/user-program-favorite", {
        programGuid: guid,
      });
      return response;
    } catch (error) {
      console.error("Error add program to favorite:", error);
      throw new Error("Failed add program to favorite");
    }
  }

  async removeProgramFromFavorite(guid: string) {
    try {
      const response = await api.delete("/user-program-favorite/" + guid);
      return response;
    } catch (error) {
      console.error("Error remove program from favorite:", error);
      throw new Error("Failed remove program from favorite");
    }
  }

  async addWorkoutToFavorite(guid: string) {
    try {
      const response = await api.post("/user-workout-favorite", {
        workoutGuid: guid,
      });
      return response;
    } catch (error) {
      console.error("Error add workout to favorite:", error);
      throw new Error("Failed add workout to favorite");
    }
  }

  async removeWorkoutFromFavorite(guid: string) {
    try {
      const response = await api.delete("/user-workout-favorite/" + guid);
      return response;
    } catch (error) {
      console.error("Error remove workout from favorite:", error);
      throw new Error("Failed remove workout from favorite");
    }
  }
}

export default new ProgramsAPI();

import {API} from "@/lib/API.ts";

export const getLeaderBoard = async (page = "1") => {
  return await API(`/leaderboard/${page}`, "GET");
};

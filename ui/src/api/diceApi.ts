import {API} from "@/lib/API.ts";

export const diceApi = async () => {
  return await API(`/game/dice/play`, "GET");
};

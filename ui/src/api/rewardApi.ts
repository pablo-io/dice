import {API} from "@/lib/API.ts";

export const rewardApi = async () => {
  return await API(`/user/getRewardsList`, "GET");
};

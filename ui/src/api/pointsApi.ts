import {API} from "@/lib/API.ts";

export const pointsApi = async () => {
  return await API(`/user/getUserBalance`, "GET");
};

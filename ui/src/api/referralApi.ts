import {API} from "@/lib/API.ts";

export const referralApi = async () => {
  return await API(`/user/getReferralLink`, "GET");
};

import {API} from "@/lib/API.ts";

export const referralLinkApi = async () => {
  return await API(`/user/getReferralLink`, "GET");
};

export const referralStatsApi = async () => {
  return await API(`/user/getUserReferralsStats`, "GET");
};

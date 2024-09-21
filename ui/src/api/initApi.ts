import {API} from "@/lib/API.ts";

export const initUser = async () => {
  return await API("/user/authenticate", "POST");
};

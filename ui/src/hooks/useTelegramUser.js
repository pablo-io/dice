import testTgData from "../assets/test.json";
import {retrieveLaunchParams} from "@telegram-apps/sdk";

export const useTelegramUser = () => {
  if (import.meta.env.MODE !== "production") {
    return testTgData.initData.user;
  } else {
    return retrieveLaunchParams().initData.user;
  }
};

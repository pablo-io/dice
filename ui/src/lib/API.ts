import {Logtail} from "@logtail/browser";
import {retrieveLaunchParams} from "@telegram-apps/sdk";
import testTgData from "../assets/test.json";

const logtail = new Logtail(import.meta.env.VITE_BETTERSTACK);

export const API = async (
  path: string,
  method: "POST" | "GET" | "PUT" | "DELETE",
  body?: Record<string, string>,
  headers?: Record<string, string>,
) => {
  try {
    let initDataRaw;

    if (import.meta.env.MODE !== "production") {
      initDataRaw = testTgData.initDataRaw;
    } else {
      initDataRaw = retrieveLaunchParams().initDataRaw;
    }

    const response = await fetch(`${import.meta.env.VITE_API}${path}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `tma ${initDataRaw}`,
        ...headers,
      },
      body: JSON.stringify(body),
    });
    return response;
  } catch (e: unknown) {
    await logtail.error(e as string);
    await logtail.flush();
  }
};

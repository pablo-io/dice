import {Logtail} from "@logtail/browser";
import {postEvent, retrieveLaunchParams} from "@telegram-apps/sdk";
import testTgData from "../assets/test.json";
import {setErrorToast} from "@/hooks/use-toast.tsx";

const logtail = new Logtail(import.meta.env.VITE_BETTERSTACK);

export const API = async (
  path: string,
  method: "POST" | "GET" | "PUT" | "DELETE",
  body?: Record<string, string>,
  headers?: Record<string, string>,
) => {
  try {
    let initDataRaw;

    if (import.meta.env.MODE === "development") {
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
    if (response.status === 401) {
      setErrorToast(
        "Your telegram login expired, please reopen the DiceID",
        () => postEvent("web_app_close"),
      );
    }
    return {
      status: response.status,
      body: await response.json(),
    };
  } catch (e: unknown) {
    setErrorToast((e as Record<string, string>).message);

    await logtail.error((e as Record<string, string>).message);
    await logtail.flush();
  }
};

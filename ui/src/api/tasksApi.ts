import {API} from "@/lib/API.ts";

export const getTasksApi = async () => {
  return await API(`/task`, "GET");
};

export const completeOneTimeTaskApi = async (
  taskId: string,
  telegramId: number,
) => {
  return await API(`/task/onetime/complete/${taskId}`, "PUT", {
    telegramId: telegramId.toString(),
  });
};

export const completeDailyTaskApi = async (
  taskId: string,
  telegramId: number,
) => {
  return await API(`/task/daily/complete/${taskId}`, "PUT", {
    telegramId: telegramId.toString(),
  });
};

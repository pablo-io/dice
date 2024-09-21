import {API} from "@/lib/API.ts";

export const getTasksApi = async () => {
  return await API(`/user/getUserTasks`, "GET");
};

export const doneTaskApi = async (taskId: string, telegramId: number) => {
  return await API(`/task/markAsDone/${taskId}`, "PUT", {
    telegramId: telegramId.toString(),
  });
};

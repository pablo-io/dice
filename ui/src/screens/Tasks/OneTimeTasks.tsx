import {FC, useMemo} from "react";
import {Button} from "@/components/ui/button.tsx";
import {TypographyP} from "@/components/ui/TypographyP.tsx";
import {ScrollArea} from "@/components/ui/scroll-area";

import {TypographySmall} from "@/components/ui/TypographySmall.tsx";
import {completeOneTimeTaskApi} from "@/api/tasksApi.ts";
import {useTelegramUser} from "@/hooks/useTelegramUser";
import {ExternalLink} from "lucide-react";
import {postEvent} from "@telegram-apps/sdk";
import {ToastAction} from "@/components/ui/toast.tsx";
import {useToast} from "@/hooks/use-toast.tsx";
import {Tasks} from "@/screens/Tasks/type.ts";

export const OneTimeTasks: FC<{
  tasks: Tasks | null;
  handleUpdateData: () => void;
}> = ({tasks, handleUpdateData}) => {
  const {toast} = useToast();
  const user = useTelegramUser();

  const doTask = async (id: string, points: number) => {
    await completeOneTimeTaskApi(id, user?.id as number).then(response => {
      if (response?.status === 400) {
        toast({
          title: "Ooops!",
          description: response?.body.error,
          action: <ToastAction altText="Ok">Ok</ToastAction>,
        });
      } else if (response?.body.link) {
        const regex = /(?:https?:\/\/)?(?:www\.)?t\.me\/([a-zA-Z0-9_]+)/;
        const match = response?.body.link.match(regex);
        if (match) {
          postEvent("web_app_open_tg_link", {path_full: "/" + match[1]});
        } else {
          postEvent("web_app_open_link", {url: response?.body.link});
        }
      } else {
        toast({
          title: `+ ${points}🎲`,
          variant: "default",
          action: <ToastAction altText="Great!">Great!</ToastAction>,
        });
        handleUpdateData();
      }
    });
  };

  const getTasks = useMemo(() => {
    if (tasks && tasks?.length > 1) {
      return tasks;
    }
    return [];
  }, [tasks]);

  return (
    <ScrollArea className="w-full">
      {getTasks.map(task => (
        <div className="relative w-full my-5" key={task.name}>
          <TypographyP className="">{task.name}</TypographyP>
          <TypographySmall className="text-muted-foreground">
            + {task.points} 🎲
          </TypographySmall>
          {task.status === "done" && (
            <Button disabled className="absolute right-0 top-2">
              + {task.points} 🎲
            </Button>
          )}
          {task.status !== "done" &&
            (task.status === "subscribe" || task.taskType === "subscribe") && (
              <Button
                onClick={() => doTask(task._id, task.points)}
                className="absolute right-0 top-2">
                Earn <ExternalLink className="ml-2 h-5 w-5" />
              </Button>
            )}
          {task.status !== "done" &&
            (task.status === "check" || task.taskType === "check") && (
              <Button
                onClick={() => doTask(task._id, task.points)}
                className="absolute right-0 top-2">
                Check
              </Button>
            )}
        </div>
      ))}
    </ScrollArea>
  );
};

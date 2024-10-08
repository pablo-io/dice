import {FC, useMemo} from "react";
import {Button} from "@/components/ui/button.tsx";
import {TypographyP} from "@/components/ui/TypographyP.tsx";
import {ScrollArea} from "@/components/ui/scroll-area";

import {TypographySmall} from "@/components/ui/TypographySmall.tsx";
import {completeDailyTaskApi} from "@/api/tasksApi.ts";
import {useTelegramUser} from "@/hooks/useTelegramUser";
import {ToastAction} from "@/components/ui/toast.tsx";
import {useToast} from "@/hooks/use-toast.tsx";
import {Tasks} from "@/screens/Tasks/type.ts";

export const DailyTasks: FC<{
  tasks: Tasks | null;
  handleUpdateData: () => void;
}> = ({tasks, handleUpdateData}) => {
  const {toast} = useToast();
  const user = useTelegramUser();

  const doTask = async (id: string, points: number) => {
    await completeDailyTaskApi(id, user?.id as number).then(response => {
      if (response?.status === 400) {
        toast({
          title: "Ooops!",
          description: response?.body.error,
          action: <ToastAction altText="Ok">Ok</ToastAction>,
        });
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
    if (tasks && tasks?.length > 0) {
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
          {task.taskType === "checkDice" && (
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

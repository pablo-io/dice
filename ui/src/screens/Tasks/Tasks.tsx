import {FC, useEffect, useMemo, useState} from "react";
import {Button} from "@/components/ui/button.tsx";
import {TypographyLead} from "@/components/ui/TypographyLead.tsx";
import {TypographyP} from "@/components/ui/TypographyP.tsx";
import {TypographyH3} from "@/components/ui/TypographyH3.tsx";
import {ScrollArea} from "@/components/ui/scroll-area";

import {TypographySmall} from "@/components/ui/TypographySmall.tsx";
import {doneTaskApi, getTasksApi} from "@/api/tasksApi.ts";
import {useTelegramUser} from "@/hooks/useTelegramUser";
import {ExternalLink} from "lucide-react";
import {Card, CardContent, CardHeader} from "@/components/ui/card.tsx";
import {postEvent} from "@telegram-apps/sdk";

export const Tasks: FC = () => {
  const user = useTelegramUser();

  const [tasks, setTasks] = useState<Array<{
    points: number;
    status: string;
    name: string;
    link: string;
    _id: string;
  }> | null>(null);

  const doTask = async (id: string) => {
    await doneTaskApi(id, user?.id as number).then(response => {
      if (response.link) {
        postEvent("web_app_open_link", {url: response.link});
      }
    });
    await getTasksApi().then(response => {
      setTasks(response);
    });
  };

  useEffect(() => {
    let ignore = false;
    getTasksApi().then(response => {
      if (!ignore) {
        setTasks(response);
      }
    });
    return () => {
      ignore = true;
    };
  }, []);

  const getTasks = useMemo(() => {
    if (tasks && tasks?.length > 1) {
      return tasks;
    }
    return [];
  }, [tasks]);

  return (
    <>
      <Card className="w-full h-full relative flex flex-col">
        <CardHeader>
          <TypographyH3>Tasks</TypographyH3>
          <TypographyLead>
            Complete tasks <span className="text-primary">earn 🎲</span>
          </TypographyLead>
        </CardHeader>
        <CardContent className="overflow-y-auto flex-grow h-full">
          <ScrollArea className="w-full">
            {getTasks.map(task => (
              <div className="relative w-full my-5" key={task.name}>
                <TypographyP className="">{task.name}</TypographyP>
                <TypographySmall className="text-muted-foreground">
                  + {task.points} 🎲
                </TypographySmall>
                {task.status === "done" ? (
                  <Button disabled className="absolute right-0 top-2">
                    + {task.points} 🎲
                  </Button>
                ) : (
                  <Button
                    onClick={() => doTask(task._id)}
                    className="absolute right-0 top-2">
                    Earn <ExternalLink className="ml-2 h-5 w-5" />
                  </Button>
                )}
              </div>
            ))}
          </ScrollArea>
        </CardContent>
      </Card>
    </>
  );
};

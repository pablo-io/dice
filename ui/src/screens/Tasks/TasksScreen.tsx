import {Card, CardContent, CardHeader} from "@/components/ui/card";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {OneTimeTasks} from "@/screens/Tasks/OneTimeTasks.tsx";
import {TypographyH3} from "@/components/ui/TypographyH3.tsx";
import {TypographyLead} from "@/components/ui/TypographyLead.tsx";
import {DailyTasks} from "@/screens/Tasks/DailyTasks.tsx";
import {useEffect, useMemo, useState} from "react";
import {getTasksApi} from "@/api/tasksApi.ts";

import {Tasks} from "./type.ts";

export const TasksScreen = () => {
  const [tasks, setTasks] = useState<{
    onetime: Tasks;
    daily: Tasks;
  } | null>(null);

  const updateTasks = (ignore = false) => {
    getTasksApi().then(response => {
      if (!ignore) {
        setTasks(response?.body);
      }
    });
  };

  const isActiveDailyTasks = useMemo(() => {
    return tasks !== null && tasks.daily.length > 0;
  }, [tasks]);

  useEffect(() => {
    let ignore = false;
    updateTasks(ignore);
    return () => {
      ignore = true;
    };
  }, []);

  return (
    <Card className="w-full h-full relative flex flex-col">
      <CardHeader>
        <TypographyH3>Tasks</TypographyH3>
        <TypographyLead>
          Complete tasks and <span className="text-primary">earn 🎲</span>
        </TypographyLead>
      </CardHeader>
      <CardContent className="overflow-y-auto flex-grow h-full">
        {tasks !== null && (
          <Tabs defaultValue={isActiveDailyTasks ? "daily" : "onetime"}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="daily">Daily</TabsTrigger>
              <TabsTrigger value="onetime">Tasks</TabsTrigger>
            </TabsList>
            <TabsContent value="onetime">
              <OneTimeTasks
                tasks={tasks?.onetime ?? null}
                handleUpdateData={updateTasks}
              />
            </TabsContent>
            <TabsContent value="daily">
              <DailyTasks
                tasks={tasks?.daily ?? null}
                handleUpdateData={updateTasks}
              />
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
};

import {createBrowserRouter} from "react-router-dom";
import {Leaderboard} from "@/screens/Leaderboard/Leaderboard.tsx";
import {Reward} from "@/screens/Reward/Reward.tsx";
import {Tasks} from "@/screens/Tasks/Tasks.tsx";
import {Main} from "@/screens/Main/Main.tsx";
import {App} from "@/App.tsx";
import {Friends} from "@/screens/Friends/Friends.tsx";

export const router = createBrowserRouter([
  {
    path: "",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Main />,
      },
      {
        path: "/reward",
        element: <Reward />,
      },
      {
        path: "/tasks",
        element: <Tasks />,
      },
      {
        path: "/leaderboard",
        element: <Leaderboard />,
      },
      {
        path: "/friends",
        element: <Friends />,
      },
    ],
  },
]);

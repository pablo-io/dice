import {FC, useEffect, useState} from "react";
import {Outlet} from "react-router";
import {initUser} from "@/api/initApi.ts";
import {useLocation, useNavigate} from "react-router-dom";
import {Toaster} from "@/components/ui/toaster.tsx";
import {Menu} from "@/components/Menu.tsx";
import {Loading} from "@/screens/Lodaing/Loading.tsx";
import {useAppStatusStore} from "@/store/statusStore.ts";

export const App: FC = () => {
  const navigate = useNavigate();
  const [appLoaded, setAppLoaded] = useState(false);
  const tasksStatusCircle = useAppStatusStore(store => store.tasksStatusCircle);
  const {pathname} = useLocation();

  const isMenuVisible = () => {
    return !pathname.includes("reward");
  };

  useEffect(() => {
    let ignore = false;
    initUser().then(response => {
      if (!ignore) {
        if (response?.status === 201) navigate(`/reward`);
        setAppLoaded(true);
      }
    });

    return () => {
      ignore = true;
    };
  }, []);

  if (appLoaded) {
    return (
      <>
        <main className="flex flex-col flex-nowrap items-center h-4/5 p-5 pb-0">
          <Outlet />
        </main>
        {isMenuVisible() && (
          <Menu
            className="w-full sticky bottom-0"
            taskStatus={tasksStatusCircle}
          />
        )}
        <Toaster />
      </>
    );
  }

  return <Loading />;
};

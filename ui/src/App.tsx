import {FC, useEffect} from "react";
import {Outlet} from "react-router";
import {initUser} from "@/api/initApi.ts";
import {useLocation, useNavigate} from "react-router-dom";
import {Toaster} from "@/components/ui/toaster.tsx";
import {Menu} from "@/components/Menu.tsx";

export const App: FC = () => {
  const navigate = useNavigate();
  const {pathname} = useLocation();

  const isMenuVisible = () => {
    return !pathname.includes("reward");
  };

  useEffect(() => {
    let ignore = false;
    initUser().then(response => {
      if (!ignore) {
        if (response?.status === 201) navigate(`/reward`);
      }
    });

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <>
      <main className="flex flex-col flex-nowrap items-center h-4/5 p-5 pb-0">
        <Outlet />
      </main>
      {isMenuVisible() && <Menu className="w-full sticky bottom-0" />}
      <Toaster />
    </>
  );
};

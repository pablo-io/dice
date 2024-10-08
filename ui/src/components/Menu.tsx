import {FC} from "react";
import {House, ClipboardCheck, Star, Contact} from "lucide-react";
import {useLocation, useNavigate} from "react-router-dom";
import {ToggleGroup, ToggleGroupItem} from "@/components/ui/toggle-group";
import {cn} from "@/lib/utils.ts";
import {Badge} from "@/components/ui/badge.tsx";

const menu = [
  {
    name: "Home",
    icon: House,
    path: "/",
  },
  {
    name: "Tasks",
    icon: ClipboardCheck,
    path: "/tasks",
  },
  {
    name: "Rank",
    icon: Star,
    path: "/leaderboard",
  },
  {
    name: "Friends",
    icon: Contact,
    path: "/friends",
  },
];
export const Menu: FC<{className: string; taskStatus: boolean}> = ({
  className,
  taskStatus,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className={cn("p-5 bd-background", className)}>
      <ToggleGroup
        value={location.pathname}
        onValueChange={value => {
          if (value) navigate(value);
        }}
        size="lg"
        type="single"
        className="bg-card py-4 flex justify-around border border-border rounded-[var(--radius)]">
        {menu.map(item => {
          return (
            <ToggleGroupItem
              className="flex flex-col w-16 h-16 data-[state=on]:border data-[state=on]:border-primary-border data-[state=on]:shadow-glow data-[state=on]:bg-none! hover:bg-none! relative"
              key={item.path}
              value={item.path}
              aria-label="Toggle bold">
              {item.name === "Tasks" && taskStatus && (
                <Badge className="absolute top-1 right-1 w-3 h-3 p-0"></Badge>
              )}
              <item.icon className="w-5 h-5" />
              {item.name}
            </ToggleGroupItem>
          );
        })}
      </ToggleGroup>
    </div>
  );
};

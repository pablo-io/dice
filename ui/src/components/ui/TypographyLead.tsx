import {FC, PropsWithChildren} from "react";
import {cn} from "@/lib/utils.ts";

interface TypographyLead extends PropsWithChildren {
  className?: string;
}

export const TypographyLead: FC<TypographyLead> = ({
  children,
  className = "",
}) => {
  return (
    <p className={cn("text-xl text-muted-foreground", className)}>{children}</p>
  );
};

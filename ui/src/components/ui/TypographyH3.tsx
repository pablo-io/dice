import {FC, PropsWithChildren} from "react";
import {cn} from "@/lib/utils.ts";

interface TypographyH3 extends PropsWithChildren {
  className?: string;
}

export const TypographyH3: FC<TypographyH3> = ({children, className = ""}) => {
  return (
    <h3
      className={cn(
        "scroll-m-20 text-2xl font-semibold tracking-tight",
        className,
      )}>
      {children}
    </h3>
  );
};

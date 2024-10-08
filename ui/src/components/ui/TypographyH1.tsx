import {FC, PropsWithChildren} from "react";
import {cn} from "@/lib/utils.ts";

interface TypographyH1 extends PropsWithChildren {
  className?: string;
}

export const TypographyH1: FC<TypographyH1> = ({children, className = ""}) => {
  return (
    <h1
      className={cn(
        "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl",
        className,
      )}>
      {children}
    </h1>
  );
};

import {FC, PropsWithChildren} from "react";
import {cn} from "@/lib/utils.ts";

interface TypographyH2 extends PropsWithChildren {
  className?: string;
}

export const TypographyH2: FC<TypographyH2> = ({children, className = ""}) => {
  return (
    <h2
      className={cn(
        "scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0",
        className,
      )}>
      {children}
    </h2>
  );
};

import {FC, PropsWithChildren} from "react";
import {cn} from "@/lib/utils.ts";

interface TypographySmall extends PropsWithChildren {
  className?: string;
}

export const TypographySmall: FC<TypographySmall> = ({
  className = "",
  children,
}) => {
  return (
    <small className={cn("text-sm font-medium leading-none", className)}>
      {children}
    </small>
  );
};

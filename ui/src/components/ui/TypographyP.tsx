import {FC, MouseEventHandler, PropsWithChildren} from "react";
import {cn} from "@/lib/utils.ts";

interface TypographyP extends PropsWithChildren {
  className?: string;
  handleClick?: MouseEventHandler<HTMLParagraphElement>;
}

export const TypographyP: FC<TypographyP> = ({
  children,
  className = "",
  handleClick,
}) => {
  return (
    <p
      className={cn("leading-7", className)}
      onClick={e => handleClick && handleClick(e)}>
      {children}
    </p>
  );
};

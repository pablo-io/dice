import {FC, PropsWithChildren} from "react";

export const TypographyMuted: FC<PropsWithChildren> = ({children}) => {
  return <p className="text-sm text-muted-foreground">{children}</p>;
};

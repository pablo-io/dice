import diceImg from "../../assets/cube.png";
import {TypographyH1} from "@/components/ui/TypographyH1.tsx";

import "animate.css";

export const Loading = () => {
  return (
    <div className="h-full w-full  flex justify-center items-start">
      <img
        className="animate__animated animate__wobble animate__infinite w-[300px] h-[300px]"
        src={diceImg}
        alt="Dice"
      />
      <TypographyH1 className="absolute my-auto top-1/2 shadow-glow color-primary">
        Dice your ID!
      </TypographyH1>
    </div>
  );
};

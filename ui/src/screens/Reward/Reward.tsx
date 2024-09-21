import {FC, useEffect, useState} from "react";
import {Button} from "@/components/ui/button.tsx";
import {TypographyLead} from "@/components/ui/TypographyLead.tsx";
import {TypographyP} from "@/components/ui/TypographyP.tsx";
import {TypographyH3} from "@/components/ui/TypographyH3.tsx";
import {Separator} from "@/components/ui/separator";

import {useNavigate} from "react-router-dom";
import {rewardApi} from "@/api/rewardApi.ts";
import {useTelegramUser} from "@/hooks/useTelegramUser";

export const Reward: FC = () => {
  const user = useTelegramUser();

  const [rewards, setRewards] = useState<{
    mainBonus: {
      title: string;
      description: string;
      points: number;
      example: string;
    };
    extraBonus: Array<Record<string, string>>;
    totalPoints: number;
  } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    let ignore = false;
    rewardApi()
      .then(resp => resp?.json())
      .then(response => {
        if (!ignore) {
          setRewards(response);
        }
      });
    return () => {
      ignore = true;
    };
  }, []);

  if (rewards === null) return <></>;

  return (
    <>
      <TypographyLead>Telegram ID:</TypographyLead>
      <TypographyH3 className="mb-8">{user?.id}</TypographyH3>
      <TypographyP className="text-muted-foreground self-start mb-2">
        Main reward
      </TypographyP>
      <div className="relative w-full my-5">
        <TypographyP className="">{rewards.mainBonus.title}</TypographyP>
        <TypographyP className="text-muted-foreground">
          {rewards.mainBonus.description}
        </TypographyP>
        <TypographyP className="text-muted-foreground">
          {rewards.mainBonus.example}
        </TypographyP>
        <Button className="absolute right-0 top-1/4">
          {rewards.mainBonus.points} 🎲
        </Button>
      </div>
      <Separator className="w-11/12 mb-8" />
      <TypographyP className="text-muted-foreground self-start">
        Bonus
      </TypographyP>
      {rewards?.extraBonus.map(item => (
        <div className="relative w-full my-3" key={item.title}>
          <TypographyP className="">{item.title}</TypographyP>
          <TypographyP className="text-muted-foreground">
            {item.description}
          </TypographyP>
          <TypographyP className="text-muted-foreground">
            {item.example}
          </TypographyP>
          {item.points ? (
            <Button className="absolute right-0 top-1/4">
              {item.points} 🎲
            </Button>
          ) : (
            <Button variant="secondary" className="absolute right-0 top-1/4">
              0
            </Button>
          )}
        </div>
      ))}
      <Button onClick={() => navigate("/")} className="w-full p-5">
        Continue +{rewards.totalPoints} 🎲
      </Button>
    </>
  );
};

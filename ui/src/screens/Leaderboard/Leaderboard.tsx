import {FC, useEffect, useState} from "react";
import {TypographyLead} from "@/components/ui/TypographyLead.tsx";
import {TypographyH3} from "@/components/ui/TypographyH3.tsx";
import {getLeaderBoard} from "@/api/leaderboardApi.ts";
import {Card, CardContent, CardHeader} from "@/components/ui/card.tsx";
import {ScrollArea} from "@/components/ui/scroll-area.tsx";
import {TypographyP} from "@/components/ui/TypographyP.tsx";
import {Button} from "@/components/ui/button.tsx";

interface User {
  _id: string;
  nickname: string;
  rank: number;
  totalQuantity: number;
}
export const Leaderboard: FC = () => {
  const [leaderboard, setLeaderboard] = useState<Array<User>>([]);
  const [user, setUser] = useState<User | null>(null);

  const trimUsername = (username: string) => {
    const MAX_USERNAME_LENGTH = 20;
    return username.length > MAX_USERNAME_LENGTH
      ? username.substring(0, MAX_USERNAME_LENGTH - 3) + "..."
      : username;
  };

  useEffect(() => {
    let ignore = false;
    getLeaderBoard("1").then(response => {
      if (!ignore) {
        setLeaderboard(response?.body.leaderboard);
        setUser(response?.body.current);
      }
    });
    return () => {
      ignore = true;
    };
  }, []);

  return (
    <>
      <Card className="w-full h-full relative flex flex-col">
        <CardHeader>
          <TypographyH3>Leaderboard</TypographyH3>
          <TypographyLead>
            See where you stand and challenge to the top dicers!
          </TypographyLead>
        </CardHeader>
        <CardContent className="pb-1 shadow-glow p-2">
          {!!user && (
            <div className="w-full flex justify-between my-4">
              <TypographyLead>{user.rank}. </TypographyLead>
              <TypographyP className="mr-auto pl-1">You (⌐■_■)</TypographyP>
              <Button>{user.totalQuantity} 🎲</Button>
            </div>
          )}
        </CardContent>

        <CardContent className="overflow-y-auto flex-grow h-full p-2">
          <ScrollArea>
            {leaderboard?.map((item, index) => (
              <div key={index}>
                <div className="w-full flex justify-between my-4">
                  <TypographyLead>{item.rank}. </TypographyLead>
                  <TypographyP className="mr-auto pl-1">
                    {trimUsername(item.nickname)}
                  </TypographyP>
                  <Button>{item.totalQuantity} 🎲</Button>
                </div>
              </div>
            ))}
          </ScrollArea>
        </CardContent>
      </Card>
    </>
  );
};

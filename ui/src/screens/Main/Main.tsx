import {RefObject, useEffect, useRef, useState} from "react";
import ReactDice, {ReactDiceRef} from "react-dice-complete";

import styles from "./styles.module.css";
import {useNavigate} from "react-router-dom";
import {pointsApi} from "@/api/pointsApi.ts";
import {AnimatedCounter} from "react-animated-counter";
import {diceApi} from "@/api/diceApi.ts";
import {Card, CardContent, CardHeader} from "@/components/ui/card.tsx";
import {cn} from "@/lib/utils.ts";
import {Button} from "@/components/ui/button.tsx";
import diceImg from "../../assets/cube.png";

export const Main = () => {
  const [balance, setBalance] = useState(0);
  const [isGame, setIsGame] = useState(false);
  const [error, setError] = useState(null);
  const user1 = useRef<ReactDiceRef>();
  const user2 = useRef<ReactDiceRef>();
  const playButton = useRef<HTMLButtonElement | null>(null);
  const navigate = useNavigate();
  const [user1Color, setUser1Color] = useState("muted");
  const [user2Color, setUser2Color] = useState("muted");

  useEffect(() => {
    if (error) {
      if (playButton?.current && "innerText" in playButton.current) {
        playButton.current.innerText = error;
      }
    }
  }, [error]);

  useEffect(() => {
    let ignore = false;
    pointsApi()
      .then(resp => resp?.json())
      .then(response => {
        if (!ignore) {
          setBalance(response.totalQuantity);
        }
      });
    return () => {
      ignore = true;
    };
  }, []);

  const roll = () => {
    if (!error) {
      setIsGame(true);
    }
  };

  useEffect(() => {
    if (isGame) {
      diceApi()
        .then(resp => resp?.json())
        .then(response => {
          if (response.error) {
            setError(response.error);
            setIsGame(false);
          } else {
            setUser1Color("primary");
            user1.current?.rollAll([response.you]);
            setTimeout(() => {
              setUser1Color("muted");
              setUser2Color("primary");
              user2.current?.rollAll([response.opponent]);
            }, 2000);

            setTimeout(() => {
              if (response.you > response.opponent) {
                setUser1Color("primary");
                setUser2Color("muted");
              }
            }, 4000);

            setTimeout(() => {
              pointsApi()
                .then(resp => resp?.json())
                .then(response => {
                  setBalance(response.totalQuantity);
                });
              setUser1Color("muted");
              setUser2Color("muted");
              setIsGame(false);
            }, 6000);
          }
        });
    }
  }, [isGame]);

  return (
    <>
      <Card className="w-2/4">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"></CardHeader>
        <CardContent>
          <div className="text-2xl font-bold inline-flex">
            <AnimatedCounter
              value={balance}
              decimalPrecision={0}
              includeCommas
              color="white"
              fontSize="30px"
            />
            <span className="ml-3 self-end">🎲</span>
          </div>
          <p
            onClick={() => navigate(`/reward`)}
            className="mt-2 text-xs text-muted-foreground underline">
            Your reward
          </p>
        </CardContent>
      </Card>

      {isGame && (
        <div className={cn(styles.diceWrapper, "my-auto")}>
          <div className={styles.diceArea}>
            <p className={`text-${user1Color}`}>You 𓁿</p>
            <ReactDice
              dieCornerRadius={10}
              disableIndividual
              faceColor={`hsl(var(--${user1Color}))`}
              dotColor={`hsl(var(--${user1Color}-foreground))`}
              defaultRoll={1}
              numDice={1}
              ref={user1 as RefObject<ReactDiceRef>}
              rollDone={() => null}
            />
          </div>
          <div className={styles.diceArea}>
            <p className={`text-${user2Color}`}>Anonimus (⌐■_■)</p>
            <ReactDice
              dieCornerRadius={10}
              disableIndividual
              faceColor={`hsl(var(--${user2Color}))`}
              dotColor={`hsl(var(--${user2Color}-foreground))`}
              defaultRoll={1}
              numDice={1}
              ref={user2 as RefObject<ReactDiceRef>}
              rollDone={() => null}
            />
          </div>
        </div>
      )}
      {!isGame && (
        <div className={cn(styles.diceBg, "my-auto")}>
          <img src={diceImg} alt="Dice Cube" />
        </div>
      )}

      <Button onClick={roll} ref={playButton} className="w-full p-5 mt-auto">
        🎲 Play 🎲
      </Button>
    </>
  );
};

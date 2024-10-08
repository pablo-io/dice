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
import {useToast} from "@/hooks/use-toast.tsx";
import {ToastAction} from "@/components/ui/toast.tsx";
import {CircleHelp} from "lucide-react";
import {postEvent} from "@telegram-apps/sdk";

export const Main = () => {
  const {toast} = useToast();

  const [balance, setBalance] = useState(0);
  const [gameStatus, setGameStatus] = useState<"closed" | "game" | "loading">(
    "closed",
  );
  const [error, setError] = useState(false);
  const dice1 = useRef<ReactDiceRef>();
  const dice2 = useRef<ReactDiceRef>();
  const navigate = useNavigate();
  const [user1, setUser1] = useState("muted");
  const [user2, setUser2] = useState({username: "", color: "muted"});

  useEffect(() => {
    let ignore = false;
    pointsApi().then(response => {
      if (!ignore && response?.body?.totalQuantity) {
        setBalance(response?.body.totalQuantity);
      }
    });
    return () => {
      ignore = true;
    };
  }, []);

  const roll = () => {
    if (!error && gameStatus === "closed") {
      setGameStatus("loading");
      diceApi().then(response => {
        if (response?.body.error) {
          setGameStatus("closed");
          if (response.status !== 401) {
            setError(true);
            toast({
              title: "Ooops!",
              description: response?.body.error,
              action: <ToastAction altText="Ok">Ok</ToastAction>,
            });
          }
        } else {
          setTimeout(() => {
            setGameStatus("game");
            setUser2({
              color: "muted",
              username: response?.body.opponent.username,
            });
            setUser1("primary");

            dice1.current?.rollAll([response?.body.you.number]);
          }, 1000);

          setTimeout(() => {
            setUser1("muted");
            setUser2({
              username: response?.body.opponent.username,
              color: "primary",
            });
            dice2.current?.rollAll([response?.body.opponent.number]);
          }, 3000);
          setTimeout(() => {
            if (response?.body.you.number > response?.body.opponent.number) {
              setUser1("primary");
              setUser2({
                username: response?.body.opponent.username,
                color: "muted",
              });
            }
          }, 5000);
          setTimeout(() => {
            pointsApi().then(response => {
              setBalance(response?.body.totalQuantity);
            });
            setUser1("muted");
            setUser2({username: "", color: "muted"});
            setGameStatus("closed");
          }, 7000);
        }
      });
    }
  };

  return (
    <>
      <CircleHelp
        className="stroke-muted absolute top-2 right-2"
        size={40}
        onClick={() =>
          postEvent("web_app_open_tg_link", {path_full: "/DiceID_support"})
        }
      />
      <Card className="w-auto">
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
            className="mt-2 text-xs text-muted-foreground underline cursor-pointer">
            Your ID reward
          </p>
        </CardContent>
      </Card>

      {gameStatus !== "closed" && (
        <div className={cn(styles.diceWrapper, "my-auto")}>
          <div className={styles.diceArea}>
            {gameStatus === "game" && (
              <p className={`text-${user1}`}>You (⌐■_■)</p>
            )}

            <div
              className={cn(
                gameStatus === "loading"
                  ? "animate__animated animate__wobble animate__infinite"
                  : "",
              )}>
              <ReactDice
                dieCornerRadius={10}
                disableIndividual
                faceColor={`hsl(var(--${user1}))`}
                dotColor={`hsl(var(--${user1}-foreground))`}
                defaultRoll={1}
                numDice={1}
                ref={dice1 as RefObject<ReactDiceRef>}
                rollDone={() => null}
              />
            </div>
          </div>
          <div className={styles.diceArea}>
            {gameStatus === "game" && (
              <p className={`text-${user2.color}`}>{user2?.username} 𓁿</p>
            )}
            <div
              className={cn(
                gameStatus === "loading"
                  ? "animate__animated animate__wobble animate__infinite"
                  : "",
              )}>
              <ReactDice
                dieCornerRadius={10}
                disableIndividual
                faceColor={`hsl(var(--${user2.color}))`}
                dotColor={`hsl(var(--${user2.color}-foreground))`}
                defaultRoll={1}
                numDice={1}
                ref={dice2 as RefObject<ReactDiceRef>}
                rollDone={() => null}
              />
            </div>
          </div>
        </div>
      )}
      {gameStatus === "closed" && (
        <>
          <div
            onClick={roll}
            className={cn(styles.diceBg, "my-auto", error && "opacity-10")}>
            <img src={diceImg} alt="Dice Cube" />
          </div>

          {error ? (
            <Button
              onClick={() => navigate("/tasks")}
              className="w-full p-5 mt-auto">
              Don't miss out on your rewards!
            </Button>
          ) : (
            <Button onClick={roll} className="w-full p-5 mt-auto">
              🎲 Play 🎲
            </Button>
          )}
        </>
      )}
    </>
  );
};

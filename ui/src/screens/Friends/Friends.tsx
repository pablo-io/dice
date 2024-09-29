import {FC, useEffect, useState} from "react";
import {Users, PiggyBank} from "lucide-react";

import {Button} from "@/components/ui/button.tsx";
import {TypographyLead} from "@/components/ui/TypographyLead.tsx";
import {TypographyH3} from "@/components/ui/TypographyH3.tsx";

import {Input} from "@/components/ui/input.tsx";
import {referralLinkApi, referralStatsApi} from "@/api/referralLinkApi.ts";
import {useToast} from "@/hooks/use-toast.tsx";
import {Card, CardContent, CardHeader} from "@/components/ui/card.tsx";

export const Friends: FC = () => {
  const {toast} = useToast();

  const [link, setLink] = useState<string>("");
  const [users, setUsers] = useState<number>(0);
  const [earnings, setEarnings] = useState<number>(0);

  useEffect(() => {
    let ignore = false;
    referralLinkApi().then(response => {
      if (!ignore) {
        setLink(response?.body.link);
      }
    });

    referralStatsApi().then(response => {
      if (!ignore) {
        setUsers(response?.body.users);
        setEarnings(response?.body.amount);
      }
    });

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <>
      <div className="grid grid-cols-2 grid-rows-1 gap-4 w-full mb-3">
        <Card className="border-primary">
          <CardHeader>
            <TypographyLead className="flex items-center">
              Invited <Users className="w-5 h-5 ml-2" />
            </TypographyLead>
          </CardHeader>
          <CardContent>
            <TypographyLead className="text-primary-foreground">
              {users ?? 0}
            </TypographyLead>
          </CardContent>
        </Card>
        <Card className="border-primary">
          <CardHeader>
            <TypographyLead className="flex items-center">
              Earned <PiggyBank className="w-6 h-6 ml-2" />
            </TypographyLead>
          </CardHeader>
          <CardContent>
            <TypographyLead className="text-primary-foreground">
              {earnings ?? 0}
            </TypographyLead>
          </CardContent>
        </Card>
      </div>
      <Card className="w-full">
        <CardHeader>
          <TypographyH3>Friends</TypographyH3>
          <TypographyLead>
            Invite your friends <span className="text-primary">+ 100 🎲</span>
            <br />
            <span className="text-primary">earn 10% of their income</span>
          </TypographyLead>
        </CardHeader>
        <CardContent>
          <Input disabled placeholder={link} />
          <div className="px-6 py-4 text-center">
            <Button
              onClick={async () => {
                await navigator.clipboard.writeText(link);
                toast({
                  title: "Copied",
                });
              }}>
              Copy
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

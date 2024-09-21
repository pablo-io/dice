import {FC, useEffect, useState} from "react";
import {Button} from "@/components/ui/button.tsx";
import {TypographyLead} from "@/components/ui/TypographyLead.tsx";
import {TypographyH3} from "@/components/ui/TypographyH3.tsx";

import {Input} from "@/components/ui/input.tsx";
import {referralApi} from "@/api/referralApi.ts";
import {useToast} from "@/hooks/use-toast.ts";
import {Card, CardContent, CardHeader} from "@/components/ui/card.tsx";

export const Friends: FC = () => {
  const {toast} = useToast();

  const [link, setLink] = useState<string>("");

  useEffect(() => {
    let ignore = false;
    referralApi()
      .then(resp => resp?.json())
      .then(response => {
        if (!ignore) {
          setLink(response.link);
        }
      });

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <>
      <Card className="w-full my-auto">
        <CardHeader>
          <TypographyH3>Friends</TypographyH3>
          <TypographyLead>
            Invite your friends
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

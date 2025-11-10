import Field from "@/app/_components/field";
import Header from "@/app/_components/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

export default async function LoginPage() {
  return (
    <div className="h-[60dvh] flex flex-col justify-center items-center ">
      <Card className="w-[450px]">
        <CardHeader>
          <Header>Login</Header>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-y-6">
            <div className="space-y-4">
              <Field>
                <Label>Email</Label>
                <Input type="text" />
                <p className="text-destructive text-sm"></p>
              </Field>

              <Field>
                <Label>Password</Label>
                <Input type="password" />
                <p className="text-destructive text-sm"></p>
              </Field>
            </div>

            <div className="flex flex-col  gap-y-3">
              <Button size={"lg"}>Login</Button>
              <div className="flex justify-between gap-x-3 items-center">
                <div className="w-full border-b border-border"></div>
                <p className="uppercase text-muted-foreground">or</p>
                <div className="w-full border-b border-border"></div>
              </div>

              <Link href={"/sign-up"} className="w-full">
                <Button
                  type="button"
                  className="w-full cursor-pointer"
                  size={"lg"}
                  variant={"outline"}
                >
                  Sign Up
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

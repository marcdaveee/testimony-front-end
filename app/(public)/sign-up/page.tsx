import Field from "@/app/_components/field";
import Header from "@/app/_components/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

export default async function SignUpPage() {
  return (
    <div className="h-[60dvh] flex flex-col justify-center items-center ">
      <Card className="w-[450px]">
        <CardHeader>
          <Header>Sign Up</Header>
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

            <div className="flex flex-col gap-y-5">
              <Button size={"lg"} variant={"default"}>
                Sign Up
              </Button>

              <p>
                Have already an account?{" "}
                <Link href={"/login"}>
                  <Button variant={"link"}>Login</Button>
                </Link>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

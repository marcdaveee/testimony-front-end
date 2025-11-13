"use client";

import { ILoginFormState, login } from "@/actions/auth-action";
import Field from "@/app/_components/field";
import Header from "@/app/_components/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import Link from "next/link";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";

export default function LoginForm({
  initialState,
}: {
  initialState: ILoginFormState;
}) {
  const [state, formAction, isPending] = useActionState(login, initialState);

  useEffect(() => {
    if (!state.success) {
      state.message && toast.error(state.message);
    }
  }, [state]);
  return (
    <Card className="w-[450px]">
      <CardHeader>
        <Header>Login</Header>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="flex flex-col gap-y-6">
          <div className="space-y-4">
            <Field>
              <Label>Email</Label>
              <Input
                type="text"
                name="email"
                defaultValue={state.inputFields?.email}
              />
              <p className="text-destructive text-sm ">
                {state.errors?.email && state.errors?.email[0]}
              </p>
            </Field>

            <Field>
              <Label>Password</Label>
              <Input
                type="password"
                name="password"
                defaultValue={state.inputFields?.password}
              />
              <p className="text-destructive text-sm">
                {state.errors?.password && state.errors?.password[0]}
              </p>
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
  );
}

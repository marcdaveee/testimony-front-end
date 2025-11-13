"use client";
import { ISignUpFormState, signUpAction } from "@/actions/auth-action";
import Field from "@/app/_components/field";
import Header from "@/app/_components/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";

export default function SignUpForm({
  initialState,
}: {
  initialState: ISignUpFormState;
}) {
  const [state, formAction, isPending] = useActionState(
    signUpAction,
    initialState
  );

  useEffect(() => {
    if (state.message) {
      if (!state.success) {
        toast.error(state.message);
      } else {
        toast.success(state.message);
      }
    }
  }, [state]);

  return (
    <Card className="w-[450px]">
      <CardHeader>
        <Header>Sign Up</Header>
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
              <p className="text-destructive text-sm">
                {state.errors?.email && state.errors.email[0]}
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
                {state.errors?.password && state.errors.password[0]}
              </p>
            </Field>
          </div>

          <div className="flex flex-col gap-y-5">
            <Button size={"lg"} variant={"default"} type="submit">
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
  );
}

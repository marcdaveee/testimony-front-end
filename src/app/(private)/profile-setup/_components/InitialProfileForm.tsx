"use client";
import createInitialProfileAction, {
  InitialProfileFormState,
} from "@/actions/profile.action";
import Field from "@/app/_components/field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User } from "lucide-react";
import { redirect } from "next/navigation";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";

export default function ({
  initialState,
  hasInitialProfile,
}: {
  initialState: InitialProfileFormState;
  hasInitialProfile: boolean;
}) {
  useEffect(() => {
    if (hasInitialProfile) {
      //
      toast.warning("Profile already exist");

      //Todo: Redirect to Profile Page
      redirect("/profile");
    }
  }, [hasInitialProfile]);

  const [state, formAction, isPending] = useActionState(
    createInitialProfileAction,
    initialState
  );

  useEffect(() => {
    if (state.message) {
      if (!state.success) {
        toast.error(state.message);
      } else {
        toast.success(state.message);
        // Redirect to Feed!
      }
    }
  }, [state]);

  return (
    <form action={formAction}>
      <div className="flex flex-col gap-y-9">
        <div className="flex justify-center">
          <h3 className="text-3xl font-semibold">Initial Profile Set up</h3>
        </div>

        <div className="flex flex-col gap-y-3">
          <div className="grid md:grid-cols-2 gap-5">
            <Field>
              <Label>First Name</Label>
              <Input
                name="firstName"
                defaultValue={state.inputFields?.firstName}
              />
              <p className="text-xs text-destructive">
                {state.errors?.firstName && state.errors.firstName[0]}
              </p>
            </Field>
            <Field>
              <Label>Last Name</Label>
              <Input
                name="lastName"
                defaultValue={state.inputFields?.lastName}
              />
              <p className="text-xs text-destructive">
                {state.errors?.lastName && state.errors.lastName[0]}
              </p>
            </Field>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <Field>
              <Label>Country</Label>
              <Input name="country" defaultValue={state.inputFields?.country} />
              <p className="text-xs text-destructive">
                {state.errors?.country && state.errors.country[0]}
              </p>
            </Field>
            <Field>
              <Label>Address</Label>
              <Input name="address" defaultValue={state.inputFields?.address} />
              <p className="text-xs text-destructive">
                {state.errors?.address && state.errors.address[0]}
              </p>
            </Field>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <Field>
              <Label>Birthdate</Label>
              <Input
                name="birthDate"
                type="date"
                defaultValue={
                  state.inputFields?.birthDate?.toString().split("T")[0]
                }
              />
              <p className="text-xs text-destructive">
                {state.errors?.birthDate && state.errors.birthDate[0]}
              </p>
            </Field>
          </div>
        </div>
        <div className="flex justify-end">
          <Button type="submit">
            Create <User />
          </Button>
        </div>
      </div>
    </form>
  );
}

"use server";
import Field from "@/app/_components/field";
import Header from "@/app/_components/header";
import { getUserProfile } from "@/dal/profile.dal";

export default async function ProfilePage() {
  const profile = await getUserProfile();

  return (
    <>
      <Header>Profile</Header>

      <div className="flex flex-col gap-y-4">
        <div className="grid md:grid-cols-2 gap-3">
          <Field>
            <h4 className="font-semibold text-muted-foreground">Full Name</h4>
            <p>
              {profile.firstName} {profile.lastName}
            </p>
          </Field>

          <Field>
            <h4 className="font-semibold text-muted-foreground">Country</h4>
            <p>{profile.country}</p>
          </Field>
        </div>
      </div>
    </>
  );
}

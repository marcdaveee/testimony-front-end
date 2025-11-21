"use server";
import { InitialProfileFormState } from "@/actions/profile.action";
import { hasInitialProfile } from "@/dal/profile.dal";

import InitialProfileForm from "./_components/InitialProfileForm";

export default async function Page() {
  const hasProfile = await hasInitialProfile();

  const initialState: InitialProfileFormState = {};

  return (
    <>
      <div className="w-[30%] h-[70dvh] mx-auto flex flex-col justify-center">
        <InitialProfileForm
          initialState={initialState}
          hasInitialProfile={hasProfile}
        />
      </div>
    </>
  );
}

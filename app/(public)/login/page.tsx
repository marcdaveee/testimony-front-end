"use server";
import { ILoginFormState } from "@/actions/auth-action";
import LoginForm from "./_components/LoginForm";

export default async function LoginPage() {
  const initialState: ILoginFormState = {
    success: false,
    message: "",
  };

  return (
    <div className="h-[60dvh] flex flex-col justify-center items-center ">
      <LoginForm initialState={initialState} />
    </div>
  );
}

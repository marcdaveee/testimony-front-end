import { ISignUpFormState } from "@/actions/auth-action";
import SignUpForm from "./_components/SignUpForm";

export default async function SignUpPage() {
  const initialState: ISignUpFormState = {};
  return (
    <div className="h-[60dvh] flex flex-col justify-center items-center ">
      <SignUpForm initialState={initialState} />
    </div>
  );
}

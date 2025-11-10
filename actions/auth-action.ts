"use server";

import z, { email } from "zod";
import SecureFetch from "../lib/secure-fetch";
import { createSession } from "../lib/session";

export interface ILoginFormState {
  success: boolean;
  message: string;
  inputFields?: {
    email?: string;
    password?: string;
  };
  errors?: {
    email?: string[];
    password?: string[];
  };
}

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export async function login(initialState: ILoginFormState, formData: FormData) {
  const rawData = Object.fromEntries(formData.entries());

  const validationResult = loginSchema.safeParse(rawData);

  if (!validationResult.success) {
    const invalidState: ILoginFormState = {
      success: false,
      message: "Please provide valid input",
      inputFields: {
        email: rawData.login.toString() || undefined,
        password: rawData.password.toString() || undefined,
      },
      errors: validationResult.error.flatten().fieldErrors,
    };

    return invalidState;
  }

  // login request
  const res = await SecureFetch("/login", {
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    const data = await res.json();
    console.error(data);
    const invalidState: ILoginFormState = {
      success: false,
      message: data.message || "",
    };

    return invalidState;
  }

  const data = await res.json();

  // create session
  await createSession({
    user: {
      id: data.user.id,
      email: data.user.email,
    },
    access_token: data.access_token,
  });

  const validState: ILoginFormState = {
    success: true,
    message: "Login successfully",
  };

  return validState;
}

"use server";

import z from "zod";
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

  const inputs: ILoginFormState["inputFields"] = {
    email: rawData.email.toString() || undefined,
    password: rawData.password.toString() || undefined,
  };

  if (!validationResult.success) {
    const invalidState: ILoginFormState = {
      success: false,
      message: "Please provide valid input",
      inputFields: inputs,
      errors: validationResult.error.flatten().fieldErrors,
    };

    return invalidState;
  }

  try {
    // login request
    const requestBodyPayload = JSON.stringify(rawData);
    const data = await SecureFetch("/auth/login", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: requestBodyPayload,
    });

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
  } catch (error: any) {
    console.error(error);

    const status = (error as any)?.status;
    const errorData = (error as any)?.data;

    const errorMessage = errorData.message;
    const errorFields = errorData.errors as string[];

    console.error(errorData);

    let emailErrors: string[] = [];

    let passwordErrors: string[] = [];

    if (errorFields) {
      errorFields.forEach(err => {
        if (err.split(" ")[0].toLowerCase().includes("email")) {
          let msg = err.replace("email ", "");
          emailErrors.push(msg);
        }
      });
      errorFields.forEach(err => {
        if (err.split(" ")[0].toLowerCase().includes("password")) {
          let msg = err.replace("password ", "");
          passwordErrors.push(msg);
        }
      });
    }

    const invalidState: ILoginFormState = {
      success: false,
      message: errorData.message || "An unexpected error occured during login.",
      inputFields: inputs,
      errors:
        errorFields && errorFields.length
          ? {
              email: emailErrors,
              password: passwordErrors,
            }
          : undefined,
    };

    return invalidState;
  }
}

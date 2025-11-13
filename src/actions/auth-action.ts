"use server";

import { createSession } from "@/lib/session";
import { extractErrors } from "@/lib/utils";
import { ISignUpResponse } from "@/types/auth.type";
import { IBaseFormState } from "@/types/common.type";
import z from "zod";
import SecureFetch from "../lib/secure-fetch";

export interface ILoginFormState extends IBaseFormState {
  inputFields?: {
    email?: string;
    password?: string;
  };
  errors?: {
    email?: string[];
    password?: string[];
  };
}

export interface ISignUpFormState extends IBaseFormState {
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
  password: z.string().min(1, { message: "Please provide your password" }),
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
    console.log(`Response Data: ${data}`);
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
  } catch (error: unknown) {
    console.error(`API respond an error: ${error}`);

    // initial state whenever an error occured
    let invalidState: ILoginFormState = {
      success: false,
      inputFields: inputs,
      // message: "An unexpected error occured during login.",
    };

    if (typeof error == "object") {
      // Error shape we throw from Secure Fetch function
      const status = (error as any)?.status;
      const errorData = (error as any)?.data;

      // Handle error message display
      const errorMessage = errorData?.message;
      const errorFields: string[] = [];

      if (
        Array.isArray(errorMessage) &&
        errorMessage.every(item => typeof item === "string")
      ) {
        console.error("Error Message: ", errorMessage);

        // // Assign each error message in its corresponding input fields
        // let emailErrors: string[] = [];
        // let passwordErrors: string[] = [];

        // if (errorMessage) {
        //   errorMessage.forEach(err => {
        //     if (err.split(" ")[0].toLowerCase().includes("email")) {
        //       // let msg = err.replace("email ", "");
        //       let msg = "";
        //       err.split(" ").forEach(str => {
        //         if (!str.includes("email")) {
        //           msg = msg + str + " ";
        //         }
        //       });
        //       // Remove any white space
        //       msg = msg.trimEnd();
        //       // Ensure first letter is always capital
        //       msg = msg[0].toUpperCase() + msg.slice(1);
        //       emailErrors.push(msg);
        //     }
        //   });
        //   errorMessage.forEach(err => {
        //     if (err.split(" ")[0].toLowerCase().includes("password")) {
        //       // let msg = err.replace("password ", "");
        //       let msg = "";

        //       err.split(" ").forEach(str => {
        //         if (!str.includes("password")) {
        //           msg = msg + str + " ";
        //         }
        //       });
        //       // Remove any white space
        //       msg = msg.trimEnd();
        //       // Ensure first letter is always capital
        //       msg = msg[0].toUpperCase() + msg.slice(1);
        //       passwordErrors.push(msg);
        //     }
        //   });
        // }

        invalidState.message = "Invalid credentials";
        invalidState.errors = {
          // email: emailErrors.length > 0 ? emailErrors : undefined,
          // password: passwordErrors.length > 0 ? emailErrors : undefined,
          email: extractErrors(errorMessage, "email"),
          password: extractErrors(errorMessage, "password"),
        };
      } else if (typeof errorMessage === "string") {
        invalidState.message = errorMessage;
      } else {
        // unknown shape of the error message
        console.error(`Thrown Error: ${error}`);
        console.error(`Message: ${errorMessage}`);
        invalidState.message =
          "Unexpected error occured. Please try again later.";
      }
    } else {
      // unknown shape of the error message
      console.error(`Thrown Error: ${error}`);
      invalidState.message =
        "Unexpected error occured. Please try again later.";
    }

    return invalidState;
  }
}

export async function signUpAction(
  initialState: ISignUpFormState,
  formData: FormData
) {
  const signUpSchema = loginSchema.safeExtend({});

  const rawData = Object.fromEntries(formData.entries());

  const inputs: ISignUpFormState["inputFields"] = {
    email: rawData.email.toString() || undefined,
    password: rawData.password.toString() || undefined,
  };

  const validationResult = signUpSchema.safeParse(rawData);

  if (!validationResult.success) {
    const invalidState: ISignUpFormState = {
      success: false,
      message: "Please provide a valid input",
      inputFields: inputs,
      errors: validationResult.error.flatten().fieldErrors,
    };
  }

  try {
    const requestBodyPayload = JSON.stringify(rawData);
    // Make POST request
    const data: ISignUpResponse = await SecureFetch("/auth/sign-up", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: requestBodyPayload,
    });

    // Create session
    await createSession({
      access_token: data.access_token,
      user: {
        id: data.user.id,
        email: data.user.email,
      },
    });

    const validState: ISignUpFormState = {
      success: true,
      message: "Registered Successfully!",
    };
    return validState;
  } catch (error: unknown) {
    const invalidState: ISignUpFormState = {
      success: false,
      inputFields: inputs,
    };

    if (typeof error == "object") {
      const status = (error as any)?.status;
      const errorData = (error as any)?.data;

      const errorMessage = errorData?.message;

      console.log(`API response with ${status} status | details: ${errorData}`);

      if (
        Array.isArray(errorMessage) &&
        errorMessage.every(item => typeof item === "string")
      ) {
        invalidState.errors = {
          email: extractErrors(errorMessage, "email"),
          password: extractErrors(errorMessage, "password"),
        };

        return invalidState;
      } else if (typeof errorMessage === "string") {
        invalidState.message = errorMessage;
        invalidState.errors = {
          email: extractErrors([errorMessage], "email"),
          password: extractErrors([errorMessage], "password"),
        };
      } else {
        console.error(`Unexpected shape of message. ${error}`);
        invalidState.message = "Unexpected error occured.";
      }
    } else {
      console.error(`Unexpected error occured. ${error}`);
      invalidState.message = "Unexpected error occured.";
    }

    return invalidState;
  }
}

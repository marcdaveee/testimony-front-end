"use server";

import SecureFetch from "@/lib/secure-fetch";
import { extractErrors } from "@/lib/utils";
import { IBaseFormState } from "@/types/common.type";
import z from "zod";

export interface InitialProfileFormState extends IBaseFormState {
  inputFields?: {
    firstName?: string;
    lastName?: string;
    country?: string;
    address?: string;
    birthDate?: string | Date;
  };
  errors?: {
    firstName?: string[];
    lastName?: string[];
    country?: string[];
    address?: string[];
    birthDate?: string[];
  };
}

const baseProfileSchema = z.object({
  firstName: z.string().min(1, { message: "Please provide your first name" }),
  lastName: z.string().min(1, { message: "Please provide your last name" }),
  country: z.string().min(1, { message: "Please specify your country" }),
  address: z.string().min(1, { message: "Please provide address information" }),
  birthDate: z.string().min(1, { message: "Please provide your birth date" }),
});

export default async function createInitialProfileAction(
  initialState: InitialProfileFormState,
  formData: FormData
) {
  const rawData = Object.fromEntries(formData.entries());

  const validationResult = baseProfileSchema.safeParse(rawData);

  const inputs: InitialProfileFormState["inputFields"] = {
    firstName: rawData.firstName.toString() || undefined,
    lastName: rawData.lastName.toString() || undefined,
    address: rawData.address.toString() || undefined,
    country: rawData.country.toString() || undefined,
    birthDate: rawData.birthDate.toString() || undefined,
  };

  if (!validationResult.success) {
    const invalidState: InitialProfileFormState = {
      success: false,
      message: "Please provide valid input fields",
      inputFields: inputs,
      errors: validationResult.error.flatten().fieldErrors,
    };

    return invalidState;
  }

  // make POST request to our API
  try {
    const requestBodyPayload = JSON.stringify(rawData);
    const data = await SecureFetch("/users/profile", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: requestBodyPayload,
    });

    console.log(`Profile was created successfully! ${data}`);

    const validState: InitialProfileFormState = {
      success: true,
      message: "Profile was created successfuly!.",
    };

    return validState;
  } catch (error: unknown) {
    const invalidState: InitialProfileFormState = {
      success: false,
      inputFields: inputs,
    };

    if (typeof error === "object") {
      const status = (error as any)?.status;
      const errorData = (error as any)?.data;

      const errorMessage = errorData?.message;

      if (
        Array.isArray(errorMessage) &&
        errorMessage.every(item => typeof item === "string")
      ) {
        invalidState.errors = {
          firstName: extractErrors(errorMessage, "firstName"),
          lastName: extractErrors(errorMessage, "lastName"),
          country: extractErrors(errorMessage, "country"),
          address: extractErrors(errorMessage, "address"),
          birthDate: extractErrors(errorMessage, "birthDate"),
        };

        invalidState.message = "Please provide a valid input to the fields";
      } else if (typeof errorMessage == "string") {
        invalidState.message = errorMessage;
      } else {
        console.error(`Unexpected error occured. Error: ${error}`);
        invalidState.message = `Unexpected error occured.`;
      }
    } else {
      console.error(`Unexpected error occured. Error: ${error}`);
      invalidState.message = `Unexpected error occured.`;
    }

    return invalidState;
  }
}

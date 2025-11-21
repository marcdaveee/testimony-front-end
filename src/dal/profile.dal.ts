"use server";
import SecureFetch from "@/lib/secure-fetch";
import { IUser } from "@/types/user.type";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { redirect } from "next/navigation";

export async function hasInitialProfile() {
  try {
    const data = await SecureFetch("/users/me/profile", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "GET",
    });

    // If has initial profile
    if (data) {
      redirect("/profile");
    } else {
      return false;
    }
  } catch (error: unknown) {
    if (isRedirectError(error)) {
      throw error;
    }
    if (typeof error === "object") {
      const status = (error as any)?.status;
      const data = (error as any)?.data;

      console.log(`Api response data: ${data}`);

      if (status == 404) {
        // no resource found
        return false;
      }
    }
    // console.error(`"Unexpected error occured: ${error}`);

    return true;
    throw new Error("Unexpected error occured");
  }
}

export async function getUserProfile() {
  try {
    const data: IUser = await SecureFetch("/users/me/profile", {
      headers: {
        "Content-type": "application/json",
      },
      method: "GET",
    });

    console.log("Retrieved profile data.");
    return data;
  } catch (error: unknown) {
    console.log(error);
    if (isRedirectError(error)) {
      throw error;
    }
    const status = (error as any)?.status;

    // if not found
    if (status == 404) {
      redirect("/profile-setup");
    } else if (status == 401) {
      // we can programatically handle 401 errors here
      redirect("/login");
    } else {
      const errorDataObj = (error as any)?.data;

      const errorMessage = errorDataObj?.message
        ? Array.isArray(errorDataObj.message)
          ? errorDataObj.message.join(", ")
          : errorDataObj.message
        : "An unknown error occured while retrieving profile details.";

      console.log("API returned log obj with data: ", errorDataObj);
      console.log("API returned error message: ", errorMessage);

      throw new Error(`Error occured with ${status} status: ${errorMessage}`);
    }
  }
}

import SecureFetch from "@/lib/secure-fetch";

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
      return true;
    } else {
      return false;
    }
  } catch (error: unknown) {
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

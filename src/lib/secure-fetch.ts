"use server";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { updateSessionToken } from "./session";

// Fetch wrapper in accessing authenticated endpoints
export default async function SecureFetch(
  endpoint: string,
  requestOptions?: RequestInit
) {
  try {
    const cookieStore = await cookies();

    const token = cookieStore.get("access_token")?.value;

    const headers = {
      ...requestOptions?.headers,
      Authorization: `Bearer ${token}`,
    };

    const updatedReqOptions = { ...requestOptions, headers: headers };

    const res = await fetch(
      `${process.env.BASE_API_URL}${endpoint}`,
      updatedReqOptions
    );

    if (!res.ok) {
      const errorResponseObj = await res.json();

      // if unauthorized
      if (res.status == 401) {
        // check if  access token is expired
        if (
          errorResponseObj.message.includes("token") ||
          errorResponseObj.message.includes("expire") == true
        ) {
          // Send request to Refresh token endpoint
          const refReshEndpointResponse = await fetch(
            `${process.env.BASE_API_URL}${"/refresh-token"}`,
            { credentials: "include" }
          );

          // Redirect to login if refresh token is not successful
          if (!refReshEndpointResponse.ok) {
            console.error("Session expired");
            // cookieStore.delete("access_token");
            // cookieStore.delete("user_token");
            // await deleteSession();
            redirect("/login");
          } else {
            // Update token
            const responseObj = await refReshEndpointResponse.json();
            const newAccessToken = responseObj.access_token;
            await updateSessionToken(newAccessToken);
          }
        } else {
          // await deleteSession();
          // redirect to login
          redirect("/login");
        }
      } else {
        // Handle other status codes here!
        const error = new Error(
          errorResponseObj.message || `API request failed status ${res.status} `
        );

        (error as any).status = res.status;
        (error as any).data = errorResponseObj;

        throw error;
      }
    }

    // Return response data
    const data = await res.json();

    return data;
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    // throw any other error
    throw error;
  }
}

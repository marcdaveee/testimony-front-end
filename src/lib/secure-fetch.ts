// "use server";
import { redirect } from "next/navigation";
import { getApiAccessToken } from "./session";

// Fetch wrapper in accessing authenticated endpoints
export default async function SecureFetch(
  endpoint: string,
  requestOptions?: RequestInit
) {
  // try {
  // const cookieStore = await cookies();

  const token = await getApiAccessToken();

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
    // get error response returned by API
    const errorResponseObj = await res.json();

    // if unauthorized
    if (res.status == 401) {
      // check if  access token is expired
      if (
        errorResponseObj.message.includes("token") ||
        errorResponseObj.message.includes("expire") == true
      ) {
        // Send request to NEXT JS Refresh token endpoint
        // const refReshEndpointResponse = await fetch(
        //   `${process.env.BASE_API_URL}${"/refresh-token"}`,
        //   { credentials: "include" }
        // );
        const refReshEndpointResponse = await fetch(
          `${process.env.NEXT_PUBLIC_APP_URL}${"/api/auth/refresh-token"}`,
          {
            method: "POST",
            credentials: "include",
            headers: { "Content-type": "application/json" },
          }
          // { credentials: "include" }
        );

        // Redirect to login if refresh token is not successful
        if (!refReshEndpointResponse.ok) {
          console.error("Refresh failed. Redirecting...");
          // cookieStore.delete("access_token");
          // cookieStore.delete("user_token");
          // await deleteSession();
          redirect("/login");
        } else {
          // Update token and Retry again
          const responseObj = await refReshEndpointResponse.json();
          // const newAccessToken = responseObj.access_token;
          const newAccessToken = await getApiAccessToken(); // retrieve the new access token
          // await updateSessionToken(newAccessToken);

          // retry request again

          const retryRes = await fetch(
            `${process.env.BASE_API_URL}${endpoint}`,
            {
              headers: {
                ...requestOptions?.headers,
                Authorization: `Bearer ${newAccessToken}`,
              },
              ...requestOptions,
            }
          );

          if (!retryRes.ok) {
            const retryErrorObj = await retryRes.json();
            const error = new Error(
              retryErrorObj.message ||
                `API request failed with status: ${retryRes.status}`
            );

            (error as any).status = retryRes.status;
            (error as any).data = retryErrorObj;

            throw error;
          }

          // if successful retry, return response
          return await retryRes.json();
        }
      } else {
        // Handle the rest of 401 status codes here!
        const error = new Error(
          errorResponseObj.message || `API request failed status ${res.status} `
        );

        (error as any).status = res.status;
        (error as any).data = errorResponseObj;

        throw error;
        // await deleteSession();
        // // redirect to login
        // redirect("/login");
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

  // If NO error occured, return response data
  const data = await res.json();
  return data;
}
//  catch (error) {
//   if (isRedirectError(error)) {
//     throw error;
//   }

//   // throw any other error
//   throw error;
// }
// }

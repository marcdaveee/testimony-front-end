import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { deleteSession, updateSessionToken } from "./session";

// Fetch wrapper in accessing authenticated endpoints
export default async function SecureFetch(
  endpoint: string,
  requestOptions?: RequestInit
) {
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

    if (
      (res.status == 401 && errorResponseObj.message.includes("token")) ||
      errorResponseObj.message.includes("expire") == true
    ) {
      // hit refresh token endpoint

      const refReshEndpointResponse = await fetch(
        `${process.env.BASE_API_URL}${"/refresh-token"}`,
        { credentials: "include" }
      );

      if (!refReshEndpointResponse.ok) {
        console.error("Session expired");

        await deleteSession();
        redirect("/login");
      }

      const responseObj = await refReshEndpointResponse.json();
      const newAccessToken = responseObj.access_token;

      await updateSessionToken(newAccessToken);
    } else {
      const error = new Error(
        errorResponseObj.message || `API request failed status ${res.status} `
      );

      (error as any).status = res.status;
      (error as any).data = errorResponseObj;

      throw error;
    }
  }

  const data = await res.json();

  return data;
}

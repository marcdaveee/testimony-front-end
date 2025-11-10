import { cookies } from "next/headers";
import { deleteSession, updateSessionToken } from "./session";
import { redirect } from "next/navigation";

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

  if (!res.ok && res.status == 401) {
    const errorResponseObj = await res.json();

    if (errorResponseObj.isTokenExpired == true) {
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
    }
  }

  return res;
}

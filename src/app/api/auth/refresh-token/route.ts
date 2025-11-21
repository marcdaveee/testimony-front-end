import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    // const cookies = request.cookies.get("access_token")?.value;

    // const access_token = cookieStore.get("access_token")?.value;
    // const access_token = cookies;

    const authHeader = request.headers.get("Authorization");

    if (!authHeader) {
      return NextResponse.json({ error: "No access token" }, { status: 401 });
    }

    const [type, access_token] = authHeader.split(" ");

    if (type != "Bearer" && !access_token) {
      return NextResponse.json({ error: "No access token" }, { status: 401 });
    }

    // send requst to NEST API refresh endpoint
    const response = await fetch(
      `${process.env.BASE_API_URL}/auth/refresh-token`,
      {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
        method: "POST",
        credentials: "include",
      }
    );

    if (!response.ok) {
      cookieStore.delete("access_token");
      cookieStore.delete("user_token");
      return NextResponse.json(
        { error: "Token refresh failed" },
        { status: 401 }
      );
    }

    const data: { access_token: string; refresh_token: string } =
      await response.json();

    cookieStore.set("access_token", data.access_token);
  } catch (error) {
    console.error(`Refresh token error: ${error}`);

    return NextResponse.json(
      {
        error: "Unexpected error occured",
      },
      { status: 500 }
    );
  }
}

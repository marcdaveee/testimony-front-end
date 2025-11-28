import { ILoginResponse } from "@/types/auth.type";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    // const cookies = request.cookies.get("access_token")?.value;

    // const access_token = cookieStore.get("access_token")?.value;
    // const access_token = cookies;

    // const refreshToken = cookieStore.get("refresh_token")?.value;

    const authHeader = request.headers.get("Authorization");

    if (!authHeader) {
      return NextResponse.json({ error: "No access token" }, { status: 401 });
    }

    const [type, refreshToken] = authHeader.split(" ");

    if (type != "Bearer" && !refreshToken) {
      return NextResponse.json({ error: "No access token" }, { status: 401 });
    }

    if (!refreshToken) {
      return NextResponse.json({ error: "No refresh token" }, { status: 401 });
    }

    // send requst to NEST API refresh endpoint
    const response = await fetch(
      `${process.env.BASE_API_URL}/auth/refresh-token`,
      {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${refreshToken}`,
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

    const data: ILoginResponse = await response.json();

    cookieStore.set("access_token", data.access_token, {
      httpOnly: true,
      secure: true,
      path: "/",
      sameSite: "lax",
      maxAge: data.access_token_expires_in,
    });

    cookieStore.set("refresh_token", data.refresh_token, {
      httpOnly: true,
      secure: true,
      path: "/",
      sameSite: "lax",
      maxAge: data.access_token_expires_in,
    });

    console.log("Token refreshed successfully");
    return NextResponse.json({ success: true });
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

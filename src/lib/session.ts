import "server-only";

import { jwtVerify, SignJWT } from "jose";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

interface UserPayload {
  id: number | string;
  email: string;
  userName?: string;
  fullName?: string;
}

interface SessionPayload {
  user: UserPayload;
  access_token: string;
  access_token_expires_in: number;
  refresh_token: string;
  refresh_token_expires_in: number;
}

const secretKey = process.env.SESSION_SECRET!;
const secret = new TextEncoder().encode(secretKey);

// JWT token expiry time
const tokenExptime = "5m";

// encrypt user session payload
export async function encryptUserPayload(sessionData: UserPayload) {
  const signedToken = await new SignJWT({ sessionData })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(tokenExptime)
    .sign(secret);

  return signedToken;
}

// decrypt user session payload
export async function decryptUserPayload(session: string | undefined = "") {
  //   const cookieStore = await cookies();
  //   const userSessionToken = cookieStore.get("user");
  const { payload } = await jwtVerify(session, secret, {
    algorithms: ["HS256"],
  });

  const userPayload = payload;

  return userPayload;
}

// Retrieve access token of the current user
export async function getApiAccessToken() {
  const cookieStore = await cookies();

  return cookieStore.get("access_token")?.value;
}

// create session for current user
export async function createSession(sessionData: SessionPayload) {
  const encryptedUserPayload = await encryptUserPayload(sessionData.user);
  const access_token = sessionData.access_token;
  const access_token_expires_in = sessionData.access_token_expires_in;

  const refresh_token = sessionData.refresh_token;
  const refresh_token_expires_in = sessionData.refresh_token_expires_in;

  const cookieStore = await cookies();

  cookieStore.set("user_token", encryptedUserPayload, {
    httpOnly: true,
    // secure: process.env.NODE_ENV == "production",
    secure: true,
    path: "/",
    sameSite: "lax",
    expires: access_token_expires_in,
  });

  cookieStore.set("access_token", access_token, {
    httpOnly: true,
    // secure: process.env.NODE_ENV == "production",
    secure: true,
    path: "/",
    sameSite: "lax",
    expires: access_token_expires_in,
  });

  cookieStore.set("refresh_token", refresh_token, {
    httpOnly: true,
    // secure: process.env.NODE_ENV == "production",
    secure: true,
    path: "/",
    sameSite: "lax",
    expires: refresh_token_expires_in,
  });
}

// Update session token
export async function updateSessionToken(access_token: string) {
  const cookieStore = await cookies();

  const currentToken = await cookieStore.get("access_token")?.value;

  if (!currentToken) {
    return null;
  }

  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  await cookieStore.set("access_token", access_token, {
    httpOnly: true,
    // secure: process.env.NODE_ENV == "production",
    secure: true,
    path: "/",
    sameSite: "lax",
    expires: expiresAt,
  });
}

// for deleting session tokens
export async function deleteSession() {
  const cookieStore = await cookies();

  // Delete session data

  cookieStore.delete("access_token");

  cookieStore.delete("user_token");
}

// for invalidate session and redirect to login
export async function invalidateAndRedirect(
  message: string = "Session Expired"
) {
  console.error(message);
  const cookieStore = await cookies();

  // Delete session data
  cookieStore.delete("access_token");

  cookieStore.delete("user_token");

  redirect("/login");
}

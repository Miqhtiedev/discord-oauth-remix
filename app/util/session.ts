import { createCookieSessionStorage, redirect, Session } from "remix";
import invariant from "tiny-invariant";

const sessionSecret = process.env.SESSION_SECRET;
invariant(sessionSecret, "SESSION_SECRET must be set as environmental variable");

const storage = createCookieSessionStorage({
  cookie: {
    name: "discord-oauth_session",
    secure: process.env.NODE_ENV === "production",
    secrets: [sessionSecret],
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
    httpOnly: true,
  },
});

export const getSession = (request: Request) => {
  return storage.getSession(request.headers.get("Cookie"));
};

export const commitSession = (session: Session) => {
  return storage.commitSession(session);
};

export const destroySession = (session: Session) => {
  return storage.destroySession(session);
};

export const createUserSession = async (discordId: string, redirectTo = "/dashboard") => {
  const session = await storage.getSession();
  session.set("discordId", discordId);
  console.log("c");

  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await storage.commitSession(session),
    },
  });
};

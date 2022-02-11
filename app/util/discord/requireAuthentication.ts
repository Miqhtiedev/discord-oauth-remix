import database from "../database";
import { json, redirect, Session } from "remix";
import { DISCORD_OAUTH2_URL } from "../constants";
import { commitSession } from "../session";
import refreshAccessToken from "./refreshAccessToken";
import getDiscordUser from "./getDiscordUser";

export default async function requireAuthentication(session: Session): Promise<Response> {
  return new Promise(async (resolve) => {
    const discordId = session.get("discordId");
    if (!discordId) {
      resolve(redirect(DISCORD_OAUTH2_URL));
      return;
    }

    let user = await database.user.findUnique({ where: { discordId: discordId } });
    if (!user) {
      session.unset("discordId");
      resolve(redirect(DISCORD_OAUTH2_URL, { headers: { "Set-Cookie": await commitSession(session) } }));
      return;
    }

    if (Date.now() > user.tokenExpires) {
      const newToken = await refreshAccessToken(user.refreshToken).catch(async () => {
        session.unset("discordId");
        resolve(redirect(DISCORD_OAUTH2_URL, { headers: { "Set-Cookie": await commitSession(session) } }));
      });

      if (!newToken) return;

      user = await database.user.update({
        data: {
          accessToken: newToken.access_token,
          refreshToken: newToken.refresh_token,
          tokenExpires: newToken.expires,
        },
        where: {
          discordId: user.discordId,
        },
      });
    }

    getDiscordUser(user.accessToken)
      .then((user) => {
        resolve(json({ user: user }));
      })
      .catch(async () => {
        session.unset("discordId");
        resolve(redirect(DISCORD_OAUTH2_URL, { headers: { "Set-Cookie": await commitSession(session) } }));
      });
  });
}

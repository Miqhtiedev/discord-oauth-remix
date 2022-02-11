import axios from "axios";

export interface IDiscordUser {
  id: string;
  username: string;
  discriminator: string;
  avatar: string;
  bot?: boolean;
  system?: boolean;
  mfa_enabled?: boolean;
  locale?: string;
  flags?: string;
  premium_type?: number;
  public_flags?: number;
}

export default function getDiscordUser(accessToken: string): Promise<IDiscordUser> {
  return new Promise((resolve, reject) => {
    axios
      .get("https://discord.com/api/users/@me", { headers: { Authorization: `Bearer ${accessToken}` } })
      .then((res) => {
        resolve(res.data);
      })
      .catch(reject);
  });
}

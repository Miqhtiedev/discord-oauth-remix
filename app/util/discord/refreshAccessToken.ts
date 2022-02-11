import axios from "axios";
import btoa from "btoa";
import { AccessTokenResponse } from "./getAccessToken";

const auth = btoa(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`);

export default function refreshAccessToken(refreshToken: string): Promise<AccessTokenResponse> {
  return new Promise((resolve, reject) => {
    const body = new URLSearchParams();
    body.append("grant_type", "refresh_token");
    body.append("code", refreshToken);

    axios
      .post("https://discordapp.com/api/oauth2/token", body, { headers: { Authorization: `Basic ${auth}` } })
      .then((res) => {
        const { access_token, refresh_token, expires_in } = res.data;
        resolve({ access_token: access_token, refresh_token: refresh_token, expires: Date.now() + expires_in * 1000 });
      })
      .catch(reject);
  });
}

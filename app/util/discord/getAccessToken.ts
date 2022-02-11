import axios from "axios";
import btoa from "btoa";

export interface AccessTokenResponse {
  access_token: string;
  expires: number;
  refresh_token: string;
}

const auth = btoa(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`);

export default function getAccessToken(code: string): Promise<AccessTokenResponse> {
  return new Promise((resolve, reject) => {
    const body = new URLSearchParams();
    body.append("grant_type", "authorization_code");
    body.append("code", code);
    body.append("redirect_uri", "http://localhost:3000/auth");

    axios
      .post("https://discordapp.com/api/oauth2/token", body, { headers: { Authorization: `Basic ${auth}` } })
      .then((res) => {
        const { access_token, refresh_token, expires_in } = res.data;

        const expires = Date.now() + expires_in * 1000;
        console.log(expires);

        resolve({ access_token: access_token, refresh_token: refresh_token, expires: expires });
      })
      .catch(reject);
  });
}

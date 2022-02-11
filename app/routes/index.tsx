import { LoaderFunction, useLoaderData } from "remix";
import { DISCORD_OAUTH2_URL } from "~/util/constants";
import { getSession } from "~/util/session";

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request);
  return session.get("discordId") ?? null;
};

export default function Index() {
  const userId = useLoaderData<string | null>();

  function handleClick() {
    if (userId) {
      window.location.href = "/dashboard";
      return;
    }

    window.location.href = DISCORD_OAUTH2_URL;
  }

  return (
    <div>
      <h1>Discord OAuth Example</h1>
      <button type="submit" onClick={handleClick}>
        {userId ? "Dashboard" : "Login"}
      </button>
    </div>
  );
}

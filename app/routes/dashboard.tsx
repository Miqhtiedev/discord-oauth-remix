import { ActionFunction, Form, LoaderFunction, redirect, useLoaderData } from "remix";
import { IDiscordUser } from "~/util/discord/getDiscordUser";
import requireAuthentication from "~/util/discord/requireAuthentication";
import { destroySession, getSession } from "~/util/session";

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request);
  return await requireAuthentication(session);
};

export const action: ActionFunction = async ({ request }) => {
  const session = await getSession(request);
  return redirect("/", { headers: { "Set-Cookie": await destroySession(session) } });
};

export default function Dashboard() {
  const data = useLoaderData();
  const user: IDiscordUser = data.user;

  return (
    <div>
      <h1>
        Hello, {user.username}#{user.discriminator}
      </h1>
      <Form method="post">
        <button type="submit">Logout</button>
      </Form>
    </div>
  );
}

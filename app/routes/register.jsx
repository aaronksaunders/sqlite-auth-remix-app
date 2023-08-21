import { json, redirect } from "@remix-run/node";
import { authenticator } from "../server-utils/auth.server";
import { createUser } from "../server-utils/createUser";
import { Form, Link, useActionData } from "@remix-run/react";
import { commitSession, getSession } from "../server-utils/session.server";

export const loader = async ({ request }) => {
  const user = await authenticator.isAuthenticated(request, {
    successRedirect: "/",
  });

  // const userTask = await getMyTasks(user.id)
  return user;
};

/**
 *
 * @param {*} param0
 * @returns
 */

export const action = async ({ request }) => {
  try {
    const r = request.clone();
    const form = await r.formData();
    const action = form.get("_action");
    const email = form.get("email");
    const password = form.get("password");
    const name = form.get("name");
    console.log("form data", email, name, password, action);
    if (!action) return {};

    if (email === "" || password === "" || name === "") {
      return json({ error: `Invalid Form Data` }, { status: 400 });
    }

    await createUser({ email, password, name });

    const user = await authenticator.authenticate("form", request.clone(), {
      failureRedirect: "/register",
      context: { formData: form },
    });

    // manually get the session
    let session = await getSession(request.headers.get("cookie"));
    // and store the user data
    session.set(authenticator.sessionKey, user);

    // commit the session
    let headers = new Headers({ "Set-Cookie": await commitSession(session) });
    return redirect("/", { headers });
  } catch (error) {
    console.log("ERROR", error);
    return json({ error: error.message }, { status: 400 });
  }
};

export const meta = () => {
  return [
    { title: "New Remix App - Login Page" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  const actionData = useActionData();

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1>REGISTER PAGE</h1>
      <Form method="POST">
        <input type="text" placeholder="name" name="name" />
        <input type="text" placeholder="email address" name="email" />
        <input type="password" placeholder="password" name="password" />
        <button type="submit" name="_action" value="register">
          LOGIN
        </button>
      </Form>
      <p>{JSON.stringify(actionData?.error)}</p>
      <Link to={"/"}>GO BACK</Link>
    </div>
  );
}

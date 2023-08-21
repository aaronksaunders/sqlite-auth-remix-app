import { authenticator } from "../server-utils/auth.server";
import { Form, Link } from "@remix-run/react";

export const loader = async ({ request }) => {
  const user = await authenticator.isAuthenticated(request, {
    successRedirect: "/",
  });

  // const userTask = await getMyTasks(user.id)
  return { user };
};

/**
 *
 * @param {*} param0
 * @returns
 */
export const action = async ({ request }) => {
  return authenticator.authenticate("form", request, {
    successRedirect: "/",
    failureRedirect: "/login",
  });
};

export const meta = () => {
  return [
    { title: "New Remix App - Login Page" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1>LOGIN PAGE</h1>
      <Form method="POST">
        <input type="text" placeholder="email address" name="email" />
        <input type="password" placeholder="password" name="password" />
        <button type="submit">LOGIN</button>
      </Form>
      <Link to={"/register"}>REGISTER USER</Link>
    </div>
  );
}

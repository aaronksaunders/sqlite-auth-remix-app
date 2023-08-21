import { Form } from "@remix-run/react";
import { authenticator } from "../server-utils/auth.server";
import { json } from "react-router";

export const loader = async ({ request }) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });
  // const userTask = await getMyTasks(user.id)
  return { user };
};

export const action = async ({ request }) => {
  const form = await request.formData();
  const action = form.get("action");

  if (action === "logout") {
    return await authenticator.logout(request, { redirectTo: "/login" });
  } else {
    return json({ error: `Invalid Form Request` }, { status: 400 });
  }
};

export const meta = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1>Welcome to Remix</h1>
      <p>
        <Form method="post">
          <button type="submit" name="action" value="logout">
            Logout
          </button>
        </Form>
      </p>
    </div>
  );
}

import { Authenticator, AuthorizationError } from "remix-auth";
import { sessionStorage } from "./session.server";
import { FormStrategy } from "remix-auth-form";
import bcrypt from "bcryptjs";
import { db } from "./sqlite.server";

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  throw new Error("SESSION_SECRET must be set");
}

const authenticator = new Authenticator(sessionStorage);

const formStrategy = new FormStrategy(async ({ form }) => {
  const email = form.get("email");
  const password = form.get("password");

  console.log("params", email, password);

  const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
  console.log("user", user);

  if (!user) {
    console.log("you entered a wrong email");
    throw new AuthorizationError();
  }

  const passwordsMatch = await bcrypt.compare(password, user.password);

  if (!passwordsMatch) {
    throw new AuthorizationError();
  }

  return user;
});

authenticator.use(formStrategy, "form");

export { authenticator };

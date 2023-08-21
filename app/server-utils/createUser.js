import bcrypt from "bcryptjs";
import crypto from "crypto";
import { db } from "./sqlite.server";

///
/**
 *
 * @param {*} user
 * @returns
 */

export const createUser = async (user) => {
  const passwordHash = await bcrypt.hash(user.password, 12);

  const stmt = db.prepare(
    "INSERT INTO users (id, name, email, password) VALUES (?, ?, ?, ?)"
  );

  const uuid = crypto.randomUUID();
  stmt.run(uuid, user.name, user.email, passwordHash);

  return { id: uuid, email: user.email, name: user.name };
};

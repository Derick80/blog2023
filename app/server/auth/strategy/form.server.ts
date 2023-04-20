import { FormStrategy } from "remix-auth-form";
import invariant from "tiny-invariant";

import bcrypt from "bcryptjs";
import { getUser, createUser, getUserPasswordHash } from "../user.server";
import { AuthInput } from "../auth-schema";
import { z } from "zod";
import { validateAction } from "~/utilities";
import { zfd } from "zod-form-data";
import { json } from "@remix-run/node";

const schema = z.object({
  email: z.string().email("email is required and must be a valid email"),
  username: z
    .string()
    .min(3, "username must be unique and at least 3 characters"),
  password: z.string().min(8, "password must be at least 8 characters"),
});
export const registerStrategy = new FormStrategy(async ({ form }) => {
  const email = form.get("email");
  const username = form.get("username");
  const password = form.get("password");
  invariant(typeof email === "string", "Email is not a string");
  invariant(typeof username === "string", "username is not a string");

  const existingUser = await getUser({ email });
  if (existingUser) {
    throw new Error("User already exists");
  }
  const user = await createUser({ email, password, username } as AuthInput);
  return user.id;
});

export const loginStrategy = new FormStrategy(async ({ form }) => {
  const email = form.get("email");
  const password = form.get("password");

  invariant(typeof email === "string", "Email is not a string");
  invariant(typeof password === "string", "Password is not a string");
  const { user, passwordHash } = await getUserPasswordHash({ email });
  if (
    !user ||
    !passwordHash ||
    (passwordHash && !(await bcrypt.compare(password, passwordHash)))
  ) {
    throw new Error("Invalid email or password");
  }
  return user.id;
});

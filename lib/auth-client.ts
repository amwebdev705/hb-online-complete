// file: /auth-client.ts
import { createAuthClient as createClient } from "better-auth/react";
import { adminClient } from "better-auth/client/plugins";

export const authClient = createClient({
  baseURL: process.env.BETTER_AUTH_URL,
  plugins: [adminClient()],
});

export const {
  signIn,
  signUp,
  signOut,
  useSession,
  forgetPassword,
  resetPassword,
} = authClient;

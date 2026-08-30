import type { Context, Next } from "hono";

import { auth } from "../utils/auth";

// Derived from the auth instance itself, so it stays correct as our
// better-auth config changes (e.g. additionalFields), instead of being
// hand-typed and drifting.
type Session = NonNullable<Awaited<ReturnType<typeof auth.api.getSession>>>;
export type AuthVariables = {
    user: Session["user"];
    session: Session["session"];
};

// Protects a route with the better-auth session cookie/token set by
// POST /api/auth/sign-in/email. On success, attaches `user`/`session` to the
// Hono context (read them back with c.get('user') / c.get('session')).
export const requireAuth = async (c: Context<{ Variables: AuthVariables }>, next: Next) => {
    const session = await auth.api.getSession({ headers: c.req.raw.headers });

    if (!session) {
        return c.json({ message: "Unauthorized" }, 401);
    }

    c.set("user", session.user);
    c.set("session", session.session);

    return next();
};

import { createServerFn } from "@tanstack/react-start";
import { redirect } from "@tanstack/react-router";
import { z } from "zod";
import { issueToken, passwordMatches, verifyToken } from "./gate.server";

const tokenInput = z.object({ token: z.string().max(400).nullable() });

export const unlockSite = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => z.object({ password: z.string().max(200) }).parse(d))
  .handler(async ({ data }) => {
    if (!(await passwordMatches(data.password))) return { ok: false as const, token: null };
    return { ok: true as const, token: await issueToken() };
  });

export const checkUnlock = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => tokenInput.parse(d))
  .handler(async ({ data }) => ({ valid: await verifyToken(data.token) }));

// The personal content is only sent to a visitor holding a valid unlock token.
export const getUniverseContent = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => tokenInput.parse(d))
  .handler(async ({ data }) => {
    if (!(await verifyToken(data.token))) throw redirect({ to: "/" });
    const { buildUniverseContent } = await import("@/content/universe.server");
    return buildUniverseContent(new Date());
  });

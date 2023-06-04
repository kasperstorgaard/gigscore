import { MiddlewareHandler } from "$fresh/server.ts";
import { getGroupBySlug } from "~/db/groups.ts";
import { APIError } from "~/utils.ts";
import { getCookies } from "https://deno.land/std@0.150.0/http/mod.ts";
import { updateRecentGroups } from "../../shared/session.ts";
import { WithSession } from "fresh_session";

const addGroupToSessionHandler: MiddlewareHandler<WithSession> = async (req, ctx) => {
  const url = new URL(req.url);
  if (/\.[^.]+$/.test(url.pathname)) return ctx.next();

  try {
    const { sessionId } = getCookies(req.headers);
    if (!sessionId) throw new APIError(401, "The session has timed out");

    const groupSlugRe = /^\/groups\/([^/]+)(?:\/|$)/;
    const [_fullMatch, groupSlug] = url.pathname.match(groupSlugRe) ?? [];
    if (!groupSlug) return ctx.next();

    const [groupErr, group] = await getGroupBySlug({ groupSlug });
    if (groupErr) throw groupErr;

    updateRecentGroups(ctx.state.session, group);
  } catch (err) {
    return new Response("", {
      status: (err as APIError).status ?? 500,
      statusText: (err as APIError).statusText ?? "Internal error",
    });
  }

  return ctx.next();
};

export const handler = [addGroupToSessionHandler];

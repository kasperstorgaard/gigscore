import { MiddlewareHandler } from "$fresh/server.ts";
import { WithSession } from "fresh_session";
import { getCookies } from "http";

import { getGroupBySlug } from "~/db/groups.ts";
import { updateRecentGroups } from "~/db/session.ts";
import { APIError } from "~/utils/errors.ts";

const addGroupToSessionHandler: MiddlewareHandler<WithSession> = async (req, ctx) => {
  const url = new URL(req.url);
  if (/\.[^.]+$/.test(url.pathname)) return ctx.next();

  try {
    const { sessionId } = getCookies(req.headers);
    if (!sessionId) throw new APIError(401, "The session has timed out");

    const groupSlugRe = /^\/u\/([^/]+)(?:\/|$)/;

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

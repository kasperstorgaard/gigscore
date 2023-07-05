import { MiddlewareHandler } from "$fresh/server.ts";

import { getGroupBySlug } from "~/db/groups.ts";
import { APIError } from "~/utils.ts";
import { updateRecentGroups } from "~/storage.ts";

const addGroupToStorageHandler: MiddlewareHandler = async (req, ctx) => {
  const url = new URL(req.url);
  if (/\.[^.]+$/.test(url.pathname)) return ctx.next();

  try {
    const groupSlugRe = /^\/u\/([^/]+)(?:\/|$)/;
    const [_fullMatch, groupSlug] = url.pathname.match(groupSlugRe) ?? [];
    if (!groupSlug) return ctx.next();

    const [groupErr, group] = await getGroupBySlug({ groupSlug });
    if (groupErr) throw groupErr;

    updateRecentGroups(group);
  } catch (err) {
    return new Response("", {
      status: (err as APIError).status ?? 500,
      statusText: (err as APIError).statusText ?? "Internal error",
    });
  }

  return ctx.next();
};

export const handler = [addGroupToStorageHandler];

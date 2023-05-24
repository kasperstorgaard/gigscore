import { Handlers, PageProps } from "$fresh/server.ts";
import { Gig, getGigBySlug } from "~/db/gigs.ts";
import { Group, getGroupBySlug } from "~/db/groups.ts";
import { APIError } from "~/utils.ts";
import { Score, listScores } from "~/db/scores.ts";

export const handler: Handlers<{
  group: Group;
  gig: Gig;
  scores: Score[];
}> = {
  // Read gig
  GET: async (_req, ctx) => {
    try {
      const [gropErr, group] = await getGroupBySlug({ groupSlug: ctx.params.groupSlug });
      if (gropErr) throw gropErr;

      const [gigErr, gig] = await getGigBySlug({ groupId: group.id, gigSlug: ctx.params.gigSlug });
      if (gigErr) throw gigErr;

      const [scoresErr, scores] = await listScores({
        groupId: group.id,
        gigId: gig.id,
      });
      if (scoresErr) throw scoresErr;

      return ctx.render({
        group,
        gig,
        scores,
      });
    } catch (err) {
      return new Response("", {
        status: (err as APIError).status ?? 500,
        statusText: (err as APIError).statusText ?? err.message,
      })
    }
  },
};

export default function GigDetails(props: PageProps<Gig>) {
  return <code>{JSON.stringify(props.data, null, 2)}</code>
}

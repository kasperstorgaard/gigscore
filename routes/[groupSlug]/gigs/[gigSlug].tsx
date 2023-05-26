import { Handlers, PageProps } from "$fresh/server.ts";
import { getGigBySlug, Gig } from "~/db/gigs.ts";
import { getGroupBySlug, Group } from "~/db/groups.ts";
import { APIError } from "~/utils.ts";
import { listScores, Score } from "~/db/scores.ts";

export const handler: Handlers<{
  group: Group;
  gig: Gig;
  scores: Score[];
}> = {
  // Read gig
  GET: async (_req, ctx) => {
    try {
      const [gropErr, group] = await getGroupBySlug({
        groupSlug: ctx.params.groupSlug,
      });
      if (gropErr) throw gropErr;

      const [gigErr, gig] = await getGigBySlug({
        groupId: group.id,
        gigSlug: ctx.params.gigSlug,
      });
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
      });
    }
  },
};

export default function GigDetails(props: PageProps<Gig>) {
  return (
    <code style={{ whiteSpace: "pre" }}>
      {JSON.stringify(props.data, null, 2)}
    </code>
  );
}

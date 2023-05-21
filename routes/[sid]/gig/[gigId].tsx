import { Handlers, PageProps } from "$fresh/server.ts";
import { getGig, Gig } from "~/db.ts";

export const handler: Handlers<Gig> = {
  // Read gig
  GET: async (_req, ctx) => {
    const gig = await getGig(ctx.params.sid, ctx.params.gigId);

    if (!gig) {
      return ctx.renderNotFound();
    }

    return ctx.render(gig);
  },
};

export default function GigId(props: PageProps<Gig>) {
  return <code>{JSON.stringify(props.data, null, 2)}</code>
}

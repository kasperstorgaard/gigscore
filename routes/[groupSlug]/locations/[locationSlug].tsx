import { Handlers, PageProps } from "$fresh/server.ts";
import { Gig, getGigBySlug, listGigsByLocation } from "~/db/gigs.ts";
import { Group, getGroupBySlug } from "~/db/groups.ts";
import { APIError } from "~/utils.ts";
import { Score, listScores } from "~/db/scores.ts";
import { Location, getLocationBySlug, listLocations } from "~/db/locations.ts";

export const handler: Handlers<{
  group: Group;
  location: Location;
  gigs: Gig[];
}> = {
  // Read gig
  GET: async (_req, ctx) => {
    try {
      const [gropErr, group] = await getGroupBySlug({ groupSlug: ctx.params.groupSlug });
      if (gropErr) throw gropErr;

      const [locationErr, location] = await getLocationBySlug({ groupId: group.id, locationSlug: ctx.params.locationSlug });
      if (locationErr) throw locationErr;

      const [gigsErr, gigs] = await listGigsByLocation({ groupId: group.id, locationId: location.id })
      if (gigsErr) throw gigsErr;

      return ctx.render({
        group,
        location,
        gigs,
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

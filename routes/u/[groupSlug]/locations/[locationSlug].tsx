import { Handlers, PageProps } from "$fresh/server.ts";

import { Gig, listGigsByLocation } from "~/db/gigs.ts";
import { getGroupBySlug, Group } from "~/db/groups.ts";
import { getLocationBySlug, Location } from "~/db/locations.ts";
import { APIError } from "~/utils/errors.ts";

export const handler: Handlers<{
  group: Group;
  location: Location;
  gigs: Gig[];
}> = {
  // Read gig
  GET: async (_req, ctx) => {
    try {
      const [gropErr, group] = await getGroupBySlug({
        groupSlug: ctx.params.groupSlug,
      });
      if (gropErr) throw gropErr;

      const [locationErr, location] = await getLocationBySlug({
        groupId: group.id,
        locationSlug: ctx.params.locationSlug,
      });
      if (locationErr) throw locationErr;

      const [gigsErr, gigs] = await listGigsByLocation({
        groupId: group.id,
        locationId: location.id,
      });
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
      });
    }
  },
};

export default function GigDetails(props: PageProps<Gig>) {
  return (
    <code style={{ whiteSpace: "pre" }}>
      {JSON.stringify(props.data, undefined, 2)}
    </code>
  );
}

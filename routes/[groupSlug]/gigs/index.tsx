import { Handlers, PageProps } from "$fresh/server.ts";
import { createGig, Gig, listGigs } from "~/db/gigs.ts";
import { getGroupBySlug, Group } from "~/db/groups.ts";
import { createScore } from "~/db/scores.ts";
import { createLocation } from "~/db/locations.ts";
import { APIError } from "~/utils.ts";

type Data = {
  group: Group;
  gigs: Gig[];
};

export const handler: Handlers<Data> = {
  GET: async (_req, ctx) => {
    try {
      const [groupErr, group] = await getGroupBySlug({
        groupSlug: ctx.params.groupSlug,
      });
      if (groupErr) throw groupErr;

      const [gigsErr, gigs] = await listGigs({
        groupId: group.id,
      });
      if (gigsErr) throw gigsErr;

      return ctx.render({
        group,
        gigs,
      });
    } catch (err) {
      return new Response("", {
        status: (err as APIError).status ?? 500,
        statusText: (err as APIError).statusText ?? err.message,
      });
    }
  },
  // Create gig
  POST: async (req, ctx) => {
    const formData = await req.formData();

    // TODO: extract to validator + mapper, maybe zod?
    const data: Partial<{
      name: string;
      groupSlug: string;
      locationName: string;
      locationLat: string;
      locationLng: string;
      catchyness: string;
      vocals: string;
      sound: string;
      immersion: string;
      performance: string;
    }> = Object.fromEntries(formData);

    try {
      const [groupErr, group] = await getGroupBySlug({
        groupSlug: ctx.params.groupSlug,
      });
      if (groupErr) throw groupErr;

      const locationData = {
        name: data.locationName ?? "",
        latLng: data.locationLat && data.locationLng
          ? [
            parseFloat(data.locationLat),
            parseFloat(data.locationLng),
          ] as const
          : undefined,
      };

      const [locationErr, location] = await createLocation({
        groupId: group.id,
        ...ctx.params,
      }, locationData);
      if (locationErr) throw locationErr;

      const gigData = {
        name: data.name ?? "",
      };

      const [gigErr, gig] = await createGig({
        groupId: group.id,
        locationId: location.id,
      }, gigData);
      if (gigErr) throw gigErr;

      const scoreData = {
        catchyness: parseInt(data.catchyness ?? ""),
        vocals: parseInt(data.vocals ?? ""),
        sound: parseInt(data.sound ?? ""),
        immersion: parseInt(data.immersion ?? ""),
        performance: parseInt(data.performance ?? ""),
      };

      const [scoreErr] = await createScore({
        groupId: group.id,
        gigId: gig.id,
      }, scoreData);
      if (scoreErr) throw scoreErr;

      const url = new URL(req.url);

      return new Response("", {
        status: 303,
        headers: { Location: `${url.pathname}/${gig.slug}` },
      });
    } catch (err) {
      return new Response(err.message, {
        status: (err as APIError).status ?? 500,
        statusText: (err as APIError).statusText ?? err.message,
      });
    }
  },
};

export default function GigList(props: PageProps<Data>) {
  return (
    <section>
      <ul>
        {props.data.gigs.map((gig) => (
          <li key={gig.id}>
            <a href={`gigs/${gig.slug}`}>
              {gig.name} -{}
              {Intl.DateTimeFormat().format(new Date(gig.createdAt))}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

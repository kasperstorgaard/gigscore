import { Handlers, PageProps } from "$fresh/server.ts";
import { createGig } from "~/db/gigs.ts";
import { getGroupBySlug, Group } from "~/db/groups.ts";
import { createScore } from "~/db/scores.ts";
import { createLocation, listLocations, Location } from "~/db/locations.ts";
import { APIError } from "~/utils.ts";

type Data = {
  group: Group;
  locations: Location[];
};

export const handler: Handlers<Data> = {
  GET: async (_req, ctx) => {
    try {
      const [groupErr, group] = await getGroupBySlug({
        groupSlug: ctx.params.groupSlug,
      });
      if (groupErr) throw groupErr;

      const [locationsErr, locations] = await listLocations({
        groupId: group.id,
      });
      if (locationsErr) throw locationsErr;

      return ctx.render({
        group,
        locations,
      });
    } catch (err) {
      return new Response("", {
        status: (err as APIError).status ?? 500,
        statusText: (err as APIError).statusText ?? err.message,
      });
    }
  },
  // Create location
  POST: async (req, ctx) => {
    const formData = await req.formData();

    // TODO: extract to validator + mapper, maybe zod?
    const data: Partial<{
      name: string;
      lat: string;
      lng: string;
    }> = Object.fromEntries(formData);

    try {
      const [groupErr, group] = await getGroupBySlug({
        groupSlug: ctx.params.groupSlug,
      });
      if (groupErr) throw groupErr;

      const locationData = {
        name: data.name ?? "",
        latLng: data.lat && data.lng
          ? [parseFloat(data.lat), parseFloat(data.lng)] as const
          : undefined,
      };

      const [locationErr, location] = await createLocation({
        groupId: group.id,
        ...ctx.params,
      }, locationData);
      if (locationErr) throw locationErr;

      const url = new URL(req.url);

      return new Response("", {
        status: 303,
        headers: { Location: `${url.pathname}/${location.slug}` },
      });
    } catch (err) {
      return new Response(err.message, {
        status: (err as APIError).status ?? 500,
        statusText: (err as APIError).statusText ?? err.message,
      });
    }
  },
};

export default function LocationsList(props: PageProps<Data>) {
  return (
    <section>
      <ul>
        {props.data.locations.map(location => (
          <li key={location.id}>
            <a href={`locations/${location.slug}`}>
              {location.name} -{}
              {Intl.DateTimeFormat().format(new Date(location.createdAt))}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

import { Handlers, PageProps } from "$fresh/server.ts";
import { createGig, Gig, listGigs } from "~/db/gigs.ts";
import { getGroupBySlug, Group, UnknownGroupSlugError } from "~/db/groups.ts";
import { createLocation } from "~/db/locations.ts";
import { APIError } from "~/utils.ts";
import MainLayout from "../../../../components/layouts/main-layout.tsx";
import { asset, Head } from "https://deno.land/x/fresh@1.1.5/runtime.ts";
import { Breadcrumb } from "../../../../components/Breadcrumb.tsx";

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

    const data: Partial<{
      name: string;
      groupSlug: string;
      locationName: string;
      locationLat: string;
      locationLng: string;
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

      const [_locationErr, location] = locationData.name
        ? await createLocation(
          { groupId: group.id },
          locationData,
        )
        : [null, null] as const;

      const gigData = {
        name: data.name ?? "",
      };

      const [gigErr, gig] = await createGig({
        groupId: group.id,
        locationId: location?.id ?? null,
      }, gigData);
      if (gigErr) throw gigErr;

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

export default function GigHome(props: PageProps<Data>) {
  return (
    <MainLayout>
      <main>
        <header>
          <Breadcrumb
            items={[{
              url: `/g/${props.data.group.slug}`,
              label: props.data.group.name,
            }]}
          />
        </header>
        <section>
          <form
            action={`/g/${props.data.group.slug}/gigs`}
            method="POST"
            class="gig-form"
          >
            <fieldset>
              <label>
                Name of the band / artist?
                <input type="text" name="name" />
              </label>

              <label>
                Where did they play?<br />
                (optional)
                <input type="text" name="locationName" />
              </label>
            </fieldset>

            <button type="submit">Create gig</button>
          </form>
        </section>

        {props.data.gigs.length
          ? (
            <section>
              <ol>
                {props.data.gigs.map((gig) => (
                  <li key={gig.id}>
                    <a href={`gigs/${gig.slug}`}>
                      {gig.name} - {}
                      {Intl.DateTimeFormat().format(new Date(gig.createdAt))}
                    </a>
                  </li>
                ))}
              </ol>
            </section>
          )
          : null}
      </main>
    </MainLayout>
  );
}

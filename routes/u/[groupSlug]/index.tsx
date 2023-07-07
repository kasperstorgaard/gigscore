import { Handlers, PageProps } from "$fresh/server.ts";
import { asset, Head } from "$fresh/runtime.ts";
import { WithSession } from "fresh_session";

import { createGig, Gig, listGigs } from "~/db/gigs.ts";
import { getGroupBySlug, Group } from "~/db/groups.ts";
import { createLocation } from "~/db/locations.ts";
import { getRatedGigs } from "~/db/session.ts";
import { getLanguage } from "~/utils/request.ts";
import { APIError } from "~/utils/errors.ts";

import MainLayout from "@/layouts/MainLayout.tsx";
import { Breadcrumb } from "@/Breadcrumb.tsx";
import HeaderActions from "#/HeaderActions.tsx";

type Data = {
  language: string;
  group: Group;
  gigs: Gig[];
  ratedGigs: Pick<Gig, "id" | "name" | "slug">[];
};

export const handler: Handlers<Data, WithSession> = {
  GET: async (req, ctx) => {
    try {
      const [groupErr, group] = await getGroupBySlug({
        groupSlug: ctx.params.groupSlug,
      });

      if (groupErr) throw groupErr;

      const [gigsErr, gigs] = await listGigs({
        groupId: group.id,
      });
      if (gigsErr) throw gigsErr;

      const ratedGigs = getRatedGigs(ctx.state.session);

      return ctx.render({
        language: getLanguage(req),
        group,
        gigs,
        ratedGigs,
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
        headers: { Location: `${url.pathname}/g/${gig.slug}/rate` },
      });
    } catch (err) {
      return new Response(err.message, {
        status: (err as APIError).status ?? 500,
        statusText: (err as APIError).statusText ?? err.message,
      });
    }
  },
};

export default function GroupHome(props: PageProps<Data>) {
  return (
    <MainLayout>
      <Head>
        <link rel="stylesheet" href={asset("/components/link-section.css")} />
        <link rel="stylesheet" href={asset("/components/explainer.css")} />

        <title>Gigscore - {props.data.group.name}</title>

        <meta name="description" content={`The group {props.data.group.name`} />
      </Head>

      <header class="header">
        <Breadcrumb
          items={[{
            url: `/u/${props.data.group.slug}`,
            label: props.data.group.name,
          }]}
        />
        <HeaderActions />
      </header>

      <main>

        <section>
          <h2>Add gig</h2>

          <form
            action={`/u/${props.data.group.slug}`}
            method="POST"
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
            <section class="link-section">
              <h3>Latest gigs</h3>

              <ol>
                {props.data.gigs.map((gig) => (
                  <li key={gig.id}>
                    {props.data.ratedGigs.some((ratedGig) =>
                        ratedGig.id === gig.id
                      )
                      ? (
                        <a
                          href={`/u/${props.data.group.slug}/g/${gig.slug}`}
                        >
                          {gig.name} - {}
                          {Intl.DateTimeFormat(props.data.language).format(
                            new Date(gig.createdAt),
                          )}
                        </a>
                      )
                      : (
                        <a
                          href={`/u/${props.data.group.slug}/g/${gig.slug}/rate`}
                        >
                          {gig.name} - {}
                          {Intl.DateTimeFormat(props.data.language).format(
                            new Date(gig.createdAt),
                          )}
                          <button>rate</button>
                        </a>
                      )}
                  </li>
                ))}
              </ol>
            </section>
          )
          : (
            <section class="explainer">
              <h4>What is a gig?</h4>

              <p>
                A Show, concert, performance, whatever you and your friends care
                about really
              </p>
            </section>
          )}
      </main>
    </MainLayout>
  );
}

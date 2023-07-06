import { Handlers, PageProps } from "$fresh/server.ts";
import { asset, Head } from "$fresh/runtime.ts";
import { WithSession } from "fresh_session";

import { createScore } from "~/db/scores.ts";
import { getGigBySlug, Gig } from "~/db/gigs.ts";
import { getGroupBySlug, Group } from "~/db/groups.ts";
import { updateRatedGigs } from "~/db/session.ts";
import { APIError } from "~/utils/errors.ts";
import GigForm from "#/GigForm.tsx";
import MainLayout from "@/layouts/MainLayout.tsx";

type Data = {
  group: Group;
  gig: Gig;
};

export const handler: Handlers<Data, WithSession> = {
  GET: async (_req, ctx) => {
    try {
      const [groupErr, group] = await getGroupBySlug({
        groupSlug: ctx.params.groupSlug,
      });

      if (groupErr) throw groupErr;

      const [gigErr, gig] = await getGigBySlug({
        groupId: group.id,
        gigSlug: ctx.params.gigSlug,
      });

      if (gigErr) throw gigErr;

      return ctx.render({ group, gig });
    } catch (err) {
      return new Response("", {
        status: (err as APIError).status ?? 500,
        statusText: (err as APIError).statusText ?? err.message,
      });
    }
  },

  // Create score
  POST: async (req, ctx) => {
    const formData = await req.formData();

    const data: Partial<{
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

      const [gigErr, gig] = await getGigBySlug({
        groupId: group.id,
        gigSlug: ctx.params.gigSlug,
      });
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

      updateRatedGigs(ctx.state.session, gig);

      const url = new URL(req.url);

      return new Response("", {
        status: 303,
        headers: { Location: `/u/${group.slug}/g/${gig.slug}` },
      });
    } catch (err) {
      return new Response(err.message, {
        status: (err as APIError).status ?? 500,
        statusText: (err as APIError).statusText ?? err.message,
      });
    }
  },
};

export default function RatePage(props: PageProps) {
  return (
    <MainLayout>
      <Head>
        <link rel="stylesheet" href={asset("/pages/rate-page.css")} />
        <link rel="stylesheet" href={asset("/components/gig-form.css")} />
        <link rel="stylesheet" href={asset("/components/score-input.css")} />
        <link rel="stylesheet" href={asset("/components/score-guides.css")} />
      </Head>

      <main class="rate-page">
        <GigForm
          groupSlug={props.params.groupSlug}
          gigSlug={props.params.gigSlug}
        />
      </main>
    </MainLayout>
  );
}

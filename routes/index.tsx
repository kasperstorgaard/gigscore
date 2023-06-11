import { Handlers, PageProps } from "$fresh/server.ts";
import { asset, Head } from "$fresh/runtime.ts";
import { WithSession } from "fresh_session";
import { getCookies } from "https://deno.land/std@0.150.0/http/mod.ts";

import {
  createGroup,
  ExistingGroupError,
  Group,
} from "~/db/groups.ts";
import { APIError } from "~/utils.ts";
import MainLayout from "@/layouts/main-layout.tsx";
import { ParameterDeclarationBase } from "https://deno.land/x/ts_morph@17.0.1/ts_morph.js";
import { getRecentGroups } from "../shared/session.ts";

type Data = {
  recentGroups?: Group[];
  existingGroup?: Group;
};

export const handler: Handlers<Data, WithSession> = {
  GET: async (req, ctx) => {
    const { sessionId } = getCookies(req.headers);

    if (!sessionId) return ctx.render();

    const recentGroups = await getRecentGroups(ctx.state.session);

    return ctx.render({
      recentGroups
    });
  },
  POST: async (req, ctx) => {
    const { session } = ctx.state;

    const data: Partial<{
      name: string;
    }> = Object.fromEntries(await req.formData());

    if (!data.name) {
      return new Response("", {
        status: 422,
        statusText: "",
      });
    }

    try {
      const [err, group] = await createGroup({ name: data.name });

      if (err instanceof ExistingGroupError) {
        return ctx.render({
          existingGroup: group,
        });
      }

      if (err) throw err;

      session.set("groupSlug", group.slug);

      return new Response("", {
        status: 303,
        headers: { Location: `/groups/${group.slug}/gigs` },
      });
    } catch (err) {
      return new Response("", {
        status: (err as APIError).status ?? 500,
        statusText: (err as APIError).statusText ?? err.message,
      });
    }
  },
};

// TODO: add 404 handler
export default function Home(props: PageProps<Data>) {
  return (
    <MainLayout>
      <Head>
        <link rel="stylesheet" href={asset("/home-page.css")} />
      </Head>

      <main class="home-page">
        {props.data.recentGroups?.length
          ? (
            <>
              <section>
                <div>
                  <p>Open your last group</p>
                  <a href={`/groups/${props.data.recentGroups[0].slug}`}>
                    {props.data.recentGroups[0].name}
                  </a>
                </div>
              </section>
            </>
          )
          : null}

        <section>
          <form method="POST" action="/">
            <label>
              Pick a group name
              <input type="text" name="name" />
            </label>

            <button type="submit">Create group</button>
          </form>

          {props.data.existingGroup && (
            <aside class="form__info-box">
              Looks like the group "{props.data.existingGroup.name}" already exists. <br />
              <a href={`/groups/${props.data.existingGroup.slug}`}>
                Open it instead?
              </a>
            </aside>
          )}
        </section>
      </main>
    </MainLayout>
  );
}

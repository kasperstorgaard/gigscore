import { Handlers, PageProps } from "$fresh/server.ts";
import { asset, Head } from "$fresh/runtime.ts";
import { WithSession } from "fresh_session";
import { getCookies } from "http";

import { createGroup, ExistingGroupError, Group } from "~/db/groups.ts";
import { getRecentGroups } from "~/db/session.ts";
import { getTheme, Theme } from "~/db/theme.ts";
import { APIError } from "~/utils/errors.ts";
import SplitLayout from "@/layouts/SplitLayout.tsx";
import { Breadcrumb } from "@/Breadcrumb.tsx";
import HeaderActions from "#/HeaderActions.tsx";

type Data = {
  recentGroups?: Pick<Group, "id" | "name" | "slug">[];
  existingGroup?: Group;
  theme: Theme;
};

export const handler: Handlers<Data, WithSession> = {
  GET: (req, ctx) => {
    const recentGroups = getRecentGroups(ctx.state.session);

    return ctx.render({
      recentGroups,
      theme: getTheme(ctx.state.session),
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
          theme: getTheme(ctx.state.session),
        });
      }

      if (err) throw err;

      session.set("groupSlug", group.slug);

      return new Response("", {
        status: 303,
        headers: { Location: `/u/${group.slug}` },
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
    <SplitLayout>
      <Head>
        <link rel="stylesheet" href={asset("/components/link-section.css")} />
        <link rel="stylesheet" href={asset("/components/explainer.css")} />

        <title>Gigscore</title>

        <meta name="description" content="The place to rate live music with your friends" />
      </Head>

      <header class="header" color-scheme={props.data.theme}>
        <Breadcrumb items={[]} />
        <HeaderActions initialTheme={props.data.theme} />
      </header>

      <main color-scheme={props.data.theme}>
        {props.data.recentGroups?.length
          ? (
            <>
              <section class="link-section">
                <h2>Recent groups</h2>

                <ol>
                  {props.data.recentGroups.slice(0, 5).map((recentGroup) => (
                    <li key={recentGroup.slug}>
                      <a href={`/u/${recentGroup.slug}`}>
                        {recentGroup.name}
                        <button>open</button>
                      </a>
                    </li>
                  ))}
                </ol>
              </section>
            </>
          )
          : null}

        <section >
          <h2>Create a group</h2>

          <form method="POST" action="/">
            <label>
              Pick a good name
              <input type="text" name="name" />
            </label>

            <button type="submit">Create group</button>
          </form>

          {props.data.existingGroup && (
            <aside class="form__info-box">
              Looks like the group "{props.data.existingGroup.name}" already
              exists. <br />
              <a href={`/u/${props.data.existingGroup.slug}`}>
                Open it instead?
              </a>
            </aside>
          )}
        </section>

        {!props.data.recentGroups?.length
          ? (
            <section class="explainer" >
              <h4>What is a group?</h4>
              <p>A place for you and your friends to rate gigs.</p>
              <p>
                <i>
                  * The name doesn't matter much, as long as it's not already
                  taken
                </i>
              </p>

              <h4>Can't remember your group, or new device?</h4>
              <p>
                We don't use logins, and all data is anonymous, so hopefully you
                can find it from that group chat way back.
              </p>
              <p>
                <i>
                  * You can always start a new one, although we know it's tough
                  :/
                </i>
              </p>
            </section>
          )
          : null}
      </main>
    </SplitLayout>
  );
}

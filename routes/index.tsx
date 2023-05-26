import { Handlers, PageProps } from "$fresh/server.ts";
import { WithSession } from "https://deno.land/x/fresh_session@0.2.0/mod.ts";
import { createGroup } from "~/db/groups.ts";
import { APIError } from "../shared/utils.ts";
import MainLayout from "../components/layouts/main-layout.tsx";

export const handler: Handlers<null, WithSession> = {
  GET: (req, ctx) => {
    const { session } = ctx.state;

    const groupSlug = session.get("groupSlug");

    if (!groupSlug) return ctx.render();

    return new Response("", {
      status: 303,
      headers: { Location: `/${groupSlug}` },
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
        statusText: ""
      });
    }

    try {
      const [err, group] = await createGroup({ name: data.name });
      if (err) throw err;

      session.set("groupSlug", group.slug);

      return new Response("", {
        status: 303,
        headers: { Location: `/${group.slug}` },
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
export default function Home() {
  return (
    <MainLayout>
      <section className="create-gig">
        <form method="POST" action="/" >
          <label for="name">Group name</label>
          <input type="text" name="name" />

          <button type="submit">Create group</button>
        </form>
      </section>
    </MainLayout>
  );
}

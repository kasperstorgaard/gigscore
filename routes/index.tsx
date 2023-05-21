import { Head } from "$fresh/runtime.ts";

import { Handler, PageProps } from "$fresh/server.ts";
import { WithSession } from "https://deno.land/x/fresh_session@0.2.0/mod.ts";
import { generateId } from "~/utils.ts";

type Data = {
  sid: string;
}

export const handler: Handler<Data, WithSession> = (req, ctx) => {
  const { session } = ctx.state;
  
  let sid = session.get("sid");

  if (!sid) {
    sid = generateId();
    session.set("sid", sid);
  }

  return ctx.render({
    sid,
  });
};

// TODO: add 404 handler
export default function Home(props: PageProps<Data>) {
  return (
    <>
      <section>
        <a href={"/" + props.data.sid}>Start rating!</a>
      </section>
    </>
  );
}

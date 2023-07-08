import { Handlers } from "$fresh/server.ts";
import { WithSession } from "fresh_session";

import { Theme, getTheme, setTheme } from "~/db/theme.ts";

type Data = {
  theme: Theme;
};

export const handler: Handlers<Data, WithSession> = {
  GET: (_req, ctx) => {
    return new Response(
      JSON.stringify({
        theme: getTheme(ctx.state.session),
      })
    );
  },
  POST: async (req, ctx) => {
    const data = await req.json();

    // TODO: generalise form validation
    if (!data.theme) return new Response("Invalid theme data", {
      status: 422,
    });
    
    setTheme(ctx.state.session, data.theme);

    return new Response(JSON.stringify(data));
  },
};

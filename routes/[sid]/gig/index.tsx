import { Handlers, PageProps } from "$fresh/server.ts";
import { createGig, Gig } from "~/db.ts";

export const handler: Handlers<null, Gig> = {
  // Create gig
  POST: async (req, ctx) => {
    const formData = await req.formData();

    const data: Partial<{
      name: string;
      sid: string;
      track: string;
      lead: string;
      sound: string;
      immersion: string;
      performance: string;
    }> = Object.fromEntries(formData);

    if (!data.name) {
      return new Response("Gig name is required", { status: 422 });
    }
    if (!data.sid) {
      return new Response("Session id is required", { status: 422 });
    }

    const payload: Parameters<typeof createGig>[0] = {
      name: data.name,
      sid: data.sid,
      scores: {
        // TODO: validate parsing
        track: data.track ? parseInt(data.track) : 3,
        lead: data.lead ? parseInt(data.lead) : 3,
        sound: data.sound ? parseInt(data.sound) : 3,
        immersion: data.immersion ? parseInt(data.immersion) : 3,
        performance: data.performance ? parseInt(data.performance) : 3,
      },
    };

    const gig = await createGig(payload);

    const url = new URL(req.url);
    // newUrl.pathname = `${newUrl.pathname}/${gig.id}`;

    return new Response("", {
      status: 303,
      headers: { Location: `${url.pathname}/${gig.id}` },
    });
  },
};

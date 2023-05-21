import { Handlers, PageProps } from "$fresh/server.ts";
import { createGig, Gig } from "~/db.ts";

export const handler: Handlers<null, Gig> = {
  // Create gig
  POST: async (req, ctx) => {
    const formData = await req.formData();

    const data: Partial<{
      name: string;
      sid: string;
      locationName: string;
      locationLat: string;
      locationLng: string;
      catchyness: string;
      vocals: string;
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

    if (!data.locationName) {
      return new Response("Location name is required", { status: 422 });
    }

    const payload: Parameters<typeof createGig>[0] = {
      name: data.name,
      sid: data.sid,
      location: {
        name: data.locationName,
        latLng: data.locationLat && data.locationLng
        // TODO: validate locations
          ? [parseFloat(data.locationLat), parseFloat(data.locationLng)]
          : undefined,
      },
      scores: {
        // TODO: validate parsing
        catchyness: data.catchyness ? parseInt(data.catchyness) : 3,
        vocals: data.vocals ? parseInt(data.vocals) : 3,
        sound: data.sound ? parseInt(data.sound) : 3,
        immersion: data.immersion ? parseInt(data.immersion) : 3,
        performance: data.performance ? parseInt(data.performance) : 3,
      },
    };

    const gig = await createGig(payload);

    const url = new URL(req.url);

    return new Response("", {
      status: 303,
      headers: { Location: `${url.pathname}/${gig.id}` },
    });
  },
};

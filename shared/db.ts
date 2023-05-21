import { computeScore, generateId } from "~/utils.ts";

const kv = await Deno.openKv();

export type Gig = {
  name: string;
  id: string;
  sid: string;
  location: {
    name: string;
    latLng?: [number, number];
  };
  scores: {
    catchyness: number;
    vocals: number;
    performance: number;
    sound: number;
    immersion: number;
  };
  score: number;
  date: Date;
};

export async function createGig(payload: Omit<Gig, "score" | "date" | "id">) {
  let retries = 0;

  while (retries < 10) {
    const id = generateId();

    // Collisions are unlikely as everything is session scoped.
    const existing = await kv.get(["gigs", payload.sid, id]);
    if (existing.value) {
      retries++;
      continue;
    }

    const data = {
      id,
      date: new Date(Date.now()),
      score: computeScore(payload.scores),
      ...payload
    };

    await kv.set(["gigs", payload.sid, id], data);

    return data;
  }

  throw new Error(`Maximum retries for creating a gig reached`);
}

export async function getGig(sid: string, id: string) {
  const entry = await kv.get<Gig>(["gigs", sid, id]);
  return entry.value;
}

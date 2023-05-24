import { getAverageScore } from "../utils.ts";
import { getGig } from "./gigs.ts";
import { getGroup } from "./groups.ts";
import { kv } from "./kv.ts";

export type Score = {
  id: string;
  catchyness: number;
  vocals: number;
  sound: number;
  immersion: number;
  performance: number;
  average: number;
  createdAt: number;
};

export async function createScore(
  params: {
    groupId: string;
    gigId: string;
  },
  payload: Omit<Score, "id" | "average" | "createdAt">
) {
  const { groupId, gigId } = params;

  const [err] = await getGig(params);
  if (err) return [err, null] as const;

  const createdAt = Date.now();
  const id = createdAt + "-" + crypto.randomUUID();

  const data: Score = {
    id,
    createdAt,
    average: getAverageScore(payload),
    ...payload,
  };

  await kv
    .atomic()
    .set(["groups", groupId, "gigs", gigId, "scores", createdAt], data)
    .commit();

  return [null, data] as const;
}

// Gets the 10 latest scores by most recently added
export async function listScores(params: {
  groupId: string;
  gigId: string;
}) {
  const { groupId, gigId } = params;

  let [err] = await getGroup(params);
  if (err) return [err, null] as const;

  [err] = await getGig(params);
  if (err) return [err, null] as const;

  const iter = kv.list<Score>(
    {
      prefix: ["groups", groupId, "gigs", gigId, "scores"],
    },
    { limit: 10, reverse: true }
  );

  const scores: Score[] = [];

  for await (const { value } of iter) {
    scores.push(value);
  }

  return [null, scores] as const;
}



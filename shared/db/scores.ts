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
    .set(["groups", groupId, "gig_scores", gigId, createdAt], data)
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
      prefix: ["groups", groupId, "gig_scores", gigId],
    },
    { limit: 10, reverse: true }
  );

  const scores: Score[] = [];

  for await (const { value } of iter) {
    scores.push(value);
  }

  return [null, scores] as const;
}

// Gets the 10 latest scores by most recently added
export async function getAggregatedScore(params: {
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
      prefix: ["groups", groupId, "gig_scores", gigId],
    },
  );

  let len = 0;
  const score: Omit<Score, "id" | "createdAt"> = {
    average: 0,
    catchyness: 0,
    vocals: 0,
    sound: 0,
    immersion: 0,
    performance: 0,
  };

  for await (const { value } of iter) {
    score.catchyness = (score.catchyness * len + value.catchyness) / (len + 1);
    score.vocals = (score.vocals * len + value.vocals) / (len + 1);
    score.sound = (score.sound * len + value.sound) / (len + 1);
    score.immersion = (score.immersion * len + value.immersion) / (len + 1);
    score.performance = (score.performance * len + value.performance) / (len + 1);
    score.average = getAverageScore(score);

    len++;
  }

  return [null, score] as const;
}



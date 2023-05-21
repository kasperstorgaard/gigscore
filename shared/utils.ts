import { Gig } from "~/db.ts";

export function generateId() {
  // We stick to a simple short id, to make it easier to copy and share urls.
  // This has collision risk, but all data is scoped to a session id,
  // and we collect no user data, so users are not at risk from crawling.
  return crypto.randomUUID().slice(-6);
}

export function computeScore(scores: Gig["scores"]) {
  return (
    (scores.track +
      scores.lead +
      scores.sound +
      scores.immersion +
      scores.performance) /
    5
  );
}

import { Session } from "fresh_session";
import { Group } from "./db/groups.ts";
import { Gig } from "./db/gigs.ts";

export function getRecentGroups(session: Session) {
  const rawValue = session.get("recent-groups");

  let recentGroups: Pick<Group, "id" | "name" | "slug">[] = [];

  try {
    recentGroups = JSON.parse(rawValue);
  } catch (_err) {
    /** */
  }

  return recentGroups;
}

export function updateRecentGroups(session: Session, group: Group) {
  const recentGroups = getRecentGroups(session).filter(
    (item) => item.id !== group.id
  );

  recentGroups.unshift({
    id: group.id,
    name: group.name,
    slug: group.slug,
  });

  session.set("recent-groups", JSON.stringify(recentGroups));
}

export function getRatedGigs(session: Session) {
  const rawValue = session.get("rated-gigs");

  let ratedGigs: Pick<Gig, "id" | "name" | "slug">[] = [];

  try {
    ratedGigs = JSON.parse(rawValue);
  } catch (_err) {
    ratedGigs = [];
  }

  console.log({ ratedGigs });

  return ratedGigs;
}

export function updateRatedGigs(session: Session, gig: Gig) {
  const ratedGigs = getRatedGigs(session).filter((item) => item.id !== gig.id);

  ratedGigs.unshift({
    id: gig.id,
    name: gig.name,
    slug: gig.slug,
  });

  console.log("after", { ratedGigs });

  session.set("rated-gigs", JSON.stringify(ratedGigs));
}

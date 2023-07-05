import { Group } from "./db/groups.ts";
import { Gig } from "./db/gigs.ts";

export function getGroupSlug() {
  return localStorage.getItem("group-slug")
}

export function setGroupSlug(groupSlug: string) {
  return localStorage.setItem("group-slug", groupSlug);
}

export function getRecentGroups() {
  const rawValue = localStorage.getItem("recent-groups")

  let recentGroups: Pick<Group, "id" | "name" | "slug">[] = [];

  if (!rawValue) return recentGroups;

  try {
    recentGroups = JSON.parse(rawValue);
  } catch (_err) {
    // noop
  }

  return recentGroups;
}

export function updateRecentGroups(group: Group) {
  const recentGroups = getRecentGroups().filter(
    (item) => item.id !== group.id
  );

  recentGroups.unshift({
    id: group.id,
    name: group.name,
    slug: group.slug,
  });

  localStorage.setItem("recent-groups", JSON.stringify(recentGroups));
}

export function getRatedGigs() {
  const rawValue = localStorage.getItem("rated-gigs");

  let ratedGigs: Pick<Gig, "id" | "name" | "slug">[] = [];

  if (!rawValue) return ratedGigs;

  try {
    ratedGigs = JSON.parse(rawValue);
  } catch (_err) {
    // noop
  }

  return ratedGigs;
}

export function updateRatedGigs(gig: Gig) {
  const ratedGigs = getRatedGigs().filter((item) => item.id !== gig.id);

  ratedGigs.unshift({
    id: gig.id,
    name: gig.name,
    slug: gig.slug,
  });

  localStorage.setItem("rated-gigs", JSON.stringify(ratedGigs));
}

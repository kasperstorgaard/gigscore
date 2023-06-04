import { Session } from "fresh_session";
import { Group } from "./db/groups.ts";

export function updateRecentGroups(session: Session, group: Group) {
  const recentGroups = getRecentGroups(session)
    .filter(item => item.id !== group.id);
  recentGroups.unshift(group);

  session.set("recent-groups", JSON.stringify(recentGroups));
}

export function getRecentGroups(session: Session) {
  const rawValue = session.get("recent-groups");

  let recentGroups: Group[] = [];

  try {
    recentGroups = JSON.parse(rawValue);
  } catch (_err) { /** */ }

  return recentGroups;
}
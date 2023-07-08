import { Session } from "fresh_session";

export const THEMES = ["pop", "metal", "electronica", "rnb", "rap", "afrobeat"] as const;

export type Theme = (typeof THEMES)[number];

export function setTheme(session: Session, theme: Theme) {
  session.set("theme", theme);
}

export function getTheme(session: Session) {
  const theme = session.get("theme") as Theme;
  return theme ?? "pop";
}
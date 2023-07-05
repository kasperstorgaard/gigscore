import { cookieSession, WithSession } from "fresh_session";
export type State = WithSession;

export const sessionHandler = cookieSession({
  maxAge: 60 * 60 * 24 * 400,
});

export const handler = [sessionHandler];

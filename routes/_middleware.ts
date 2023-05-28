import {
  cookieSession,
  WithSession,
} from "fresh_session";

export type State = WithSession;

const sessionHandler = cookieSession();

export const handler = [sessionHandler];

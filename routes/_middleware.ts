import {
  cookieSession,
  WithSession,
} from "https://deno.land/x/fresh_session@0.2.0/mod.ts";

export type State = WithSession;

const sessionHandler = cookieSession();

export const handler = [sessionHandler];

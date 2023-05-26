import { APIError } from "~/utils.ts";
import { getSlug } from "~/utils.ts";
import { kv } from "~/db/kv.ts";
import { getGroup } from "~/db/groups.ts";
import { getLocation, getLocationBySlug } from "./locations.ts";

export type Gig = {
  id: string;
  slug: string;
  name: string;
  createdAt: number;
};

export class ExistingGigError extends APIError {
  constructor(slug: string) {
    super(409, `A gig already exists with the slug: ${slug}`);
  }
}

export async function createGig(
  params: { groupId: string, locationId: string },
  payload: { name: string }
) {
  const { groupId } = params;

  const gigSlug = getSlug(payload.name);

  const [_existingErr, existingGig] = await getGigBySlug({ ...params, gigSlug });
  if (existingGig) return [new ExistingGigError(gigSlug), null] as const;

  const [locationErr, location] = await getLocation(params);
  if (locationErr) return [locationErr, null] as const;

  const createdAt = Date.now();
  const id = createdAt + "-" + crypto.randomUUID();

  const data: Gig = {
    id,
    createdAt,
    name: payload.name,
    slug: gigSlug,
  };

  await kv
    .atomic()
    .set(["groups", groupId, "locations_by_gig", id], location)
    .set(["groups", groupId, "gigs", id], data)
    .set(["groups", groupId, "gigs_by_slug", gigSlug], data)
    .set(["groups", groupId, "gigs_by_location", location.id, createdAt], data)
    .commit();

  return [null, data] as const;
}

export class UnknownGigError extends APIError {
  constructor(id: string) {
    super(404, `Unable to find gig with the id: ${id}`);
  }
}

export async function getGig(params: { groupId: string, gigId: string }) {
  const { groupId, gigId } = params;

  const entry = await kv.get<Gig>(["groups", groupId, "gigs", gigId]);

  if (!entry.value) return [new UnknownGigError(params.gigId), null] as const;

  return [null, entry.value] as const;
}

export class UnknownGigSlugError extends APIError {
  constructor(slug: string) {
    super(404, `Unable to find gig with the slug: ${slug}`);
  }
}

export async function getGigBySlug(params: {
  groupId: string;
  gigSlug: string;
}) {
  const { groupId, gigSlug } = params;

  const [err] = await getGroup(params);
  if (err) return [err, null] as const;

  const entry = await kv.get<Gig>(["groups", groupId, "gigs_by_slug", gigSlug]);

  if (!entry.value)
    return [new UnknownGigSlugError(params.gigSlug), null] as const;

  return [null, entry.value] as const;
}

export async function listGigs(
  params: { groupId: string },
  options?: {
    limit: number;
  }
) {
  const { groupId } = params;

  const [err] = await getGroup(params);
  if (err) return [err, null] as const;

  const iter = kv.list<Gig>(
    { prefix: ["groups", groupId, "gigs"] },
    { limit: options?.limit ?? 100, reverse: true }
  );

  const gigs: Gig[] = [];
  for await (const { value } of iter) {
    gigs.push(value);
  }

  return [null, gigs] as const;
}

export async function listGigsByLocation(
  params: { groupId: string, locationId: string },
  options?: {
    limit: number;
  }
) {
  const { groupId } = params;

  const [groupErr] = await getGroup(params);
  if (groupErr) return [groupErr, null] as const;

  const [locationErr, location] = await getLocation(params);
  if (locationErr) return [locationErr, null] as const;

  const iter = kv.list<Gig>(
    { prefix: ["groups", groupId, "gigs_by_location", location.id] },
    { limit: options?.limit ?? 100, reverse: true }
  );

  const gigs: Gig[] = [];
  for await (const { value } of iter) {
    gigs.push(value);
  }

  return [null, gigs] as const;
}


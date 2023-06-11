import { APIError, getSlug } from "~/utils.ts";
import { kv } from "./kv.ts";
import { ExistingGroupError, UnknownGroupError, getGroup } from "./groups.ts";
import { getGig } from "./gigs.ts";

export type Location = {
  id: string;
  name: string;
  slug: string;
  createdAt: number;
  latLng?: Readonly<[number, number]> | [number, number];
};

export class ExistingLocationError extends APIError {
  constructor(slug: string) {
    super(404, `A location already exists for slug: ${slug}`);
  }
}

export async function createLocation(
  params: {
    groupId: string;
  },
  payload: Omit<Location, "id" | "createdAt" | "slug">
) {
  const { groupId } = params;

  const [groupErr] = await getGroup(params);
  if (groupErr) return [groupErr, null] as const;

  const locationSlug = getSlug(payload.name);

  let [_locationErr, location] = await getLocationBySlug({
    ...params,
    locationSlug,
  });

  if (location)
    return [new ExistingLocationError(locationSlug), location] as const;

  const createdAt = Date.now();
  const id = createdAt + "-" + crypto.randomUUID();

  location = {
    id,
    createdAt,
    slug: locationSlug,
    ...payload,
  };

  await kv
    .atomic()
    .set(["groups", groupId, "locations", id], location)
    .set(["groups", groupId, "locations_by_slug", locationSlug], location)
    .commit();

  return [null, location] as const;
}

export class UnknownLocationError extends APIError {
  constructor(id: string) {
    super(404, `Unable to find location by id: ${id}`);
  }
}

export async function getLocation(params: {
  groupId: string;
  locationId: string;
}) {
  const { groupId, locationId } = params;

  const [err] = await getGroup(params);
  if (err) return [err, null] as const;

  const entry = await kv.get<Location>([
    "groups",
    groupId,
    "locations",
    locationId,
  ]);
  if (!entry.value)
    return [new UnknownLocationError(locationId), null] as const;

  return [null, entry.value] as const;
}

export class UnknownLocationSlugError extends APIError {
  constructor(slug: string) {
    super(404, `Unable to find location by slug: ${slug}`);
  }
}

export async function getLocationBySlug(params: {
  groupId: string;
  locationSlug: string;
}): Promise<
  | readonly [UnknownGroupError, null]
  | readonly [UnknownLocationSlugError, null]
  | readonly [null, Location]
> {
  const { locationSlug } = params;

  const [err, group] = await getGroup(params);
  if (err) return [err, null] as const;

  const entry = await kv.get<Location>([
    "groups",
    group.id,
    "locations_by_slug",
    locationSlug,
  ]);

  if (!entry.value)
    return [new UnknownLocationSlugError(locationSlug), null] as const;

  return [null, entry.value] as const;
}

export class UnknownLocationByGigError extends APIError {
  constructor(id: string) {
    super(404, `Unable to find location by gig id: ${id}`);
  }
}

export async function getLocationByGig(params: {
  groupId: string;
  gigId: string;
}) {
  const { groupId, gigId } = params;

  const [groupErr] = await getGroup(params);
  if (groupErr) return [groupErr, null] as const;

  const [gigErr] = await getGig(params);
  if (gigErr) return [gigErr, null] as const;

  const entry = await kv.get<Location>([
    "groups",
    groupId,
    "locations_by_gig",
    gigId,
  ]);
  if (!entry.value)
    return [new UnknownLocationByGigError(gigId), null] as const;

  return [null, entry.value] as const;
}

export async function listLocations(
  params: { groupId: string },
  options?: { limit: number }
) {
  const { groupId } = params;

  const [err] = await getGroup(params);
  if (err) return [err, null] as const;

  const iter = kv.list<Location>(
    { prefix: ["groups", groupId, "locations"] },
    { limit: options?.limit ?? 100, reverse: true }
  );

  const locations: Location[] = [];

  for await (const { value } of iter) {
    locations.push(value);
  }

  return [null, locations] as const;
}

import { APIError } from "~/utils.ts";
import { getSlug } from "~/utils.ts";
import { kv } from "./kv.ts";

export type Group = {
  id: string;
  createdAt: number;
  slug: string;
  name?: string;
};

export class ExistingGroupError extends APIError {
  constructor(slug: string) {
    super(409, `A group already exists for the slug: ${slug}`);
  }
}

export async function createGroup(payload: { name: string }) {
  const slug = getSlug(payload.name);

  const [_err, group] = await getGroupBySlug({ groupSlug: slug });
  if (group) return [new ExistingGroupError(slug), group] as const;

  const createdAt = Date.now();
  const id = createdAt + "-" + crypto.randomUUID();

  const data: Group = {
    id,
    createdAt,
    slug,
    ...payload,
  };

  await kv
    .atomic()
    .set(["groups", id], data)
    .set(["groups_by_slug", slug], data)
    .commit();

  return [null, data] as const;
}

export class UnknownGroupError extends APIError {
  constructor(id: string) {
    super(404, `Unable to find group with id: ${id}`);
  }
}

export async function getGroup(params: { groupId: string }) {
  const entry = await kv.get<Group>(["groups", params.groupId]);

  if (!entry.value)
    return [new UnknownGroupError(params.groupId), null] as const;

  return [null, entry.value] as const;
}

export class UnknownGroupSlugError extends APIError {
  constructor(slug: string) {
    super(404, `Unable to find group with slug: ${slug}`);
  }
}

export async function getGroupBySlug(params: { groupSlug: string }) {
  const entry = await kv.get<Group>(["groups_by_slug", params.groupSlug]);

  if (!entry.value)
    return [new UnknownGroupSlugError(params.groupSlug), null] as const;

  return [null, entry.value] as const;
}

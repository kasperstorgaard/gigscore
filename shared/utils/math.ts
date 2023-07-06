export function getObjectAverage<T extends Record<string, unknown>>(obj: T) {
  let average = 0;
  let len = 0;

  for (const value of Object.values(obj)) {
    if (typeof value !== "number") continue;

    average = (average * len + value) / (len + 1);

    len++;
  }

  return average;
}
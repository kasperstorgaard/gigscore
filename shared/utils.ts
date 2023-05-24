export class APIError extends Error {
  constructor(public status: number, public statusText: string) {
    super(`${status}: ${statusText}`);
  }
}

export function getAverageScore(scoreCategories: {
  catchyness: number;
  vocals: number;
  sound: number;
  immersion: number;
  performance: number;
}) {
  return (
    (scoreCategories.catchyness +
      scoreCategories.vocals +
      scoreCategories.sound +
      scoreCategories.immersion +
      scoreCategories.performance) /
    5
  );
}

export function getSlug(name = "") {
  return name.replace(/[_\s\n.,;]+/g, "-").toLowerCase();
}

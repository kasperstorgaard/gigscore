import { Score } from "~/db/scores.ts";

type Props = {
  score: Omit<Score, "id" | "createdAt">;
};

export function ScoreChart({ score }: Props) {
  const total = score.average * 5 + 4;
  const max = 29;

  const items: { offset: number; size: number }[] = [];
  let offset = 0;

  for (
    const size of [
      score.catchyness,
      score.vocals,
      score.sound,
      score.immersion,
      score.performance,
    ]
  ) {
    items.push({
      offset,
      size,
    });

    offset = offset + size + 1;
  }

  return (
    <svg
      viewBox={`0 0 29 1`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {items.map((item, idx) => (
        <rect
          key={idx}
          height={1}
          x={item.offset}
          y="0"
          width={item.size}
          fill="currentColor"
        />
      ))}
    </svg>
  );
}

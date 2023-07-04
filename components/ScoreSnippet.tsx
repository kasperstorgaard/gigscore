import { Score } from "~/db/scores.ts";

type Props = {
  score: Omit<Score, "id" | "createdAt">;
};

export function ScoreSnippet({ score }: Props) {
  const values = [
    score.catchyness,
    score.vocals,
    score.sound,
    score.immersion,
    score.performance,
  ].flatMap(value => (new Array(6)).fill(0).map((_, idx) => {
    if (idx === 5) return "-";
    if (5 - idx === value) return "+";
    if (5 - idx > value) return "";
    return ".";
  }));

  return (
    <figure class="score-snippet" aria-hidden>
      {values.map(value => (<span>{value}</span>))}
    </figure>
  );
}

import { Score } from "~/db/scores.ts";

type Props = {
  score: Omit<Score, "id" | "createdAt">;
  hasCaption?: boolean;
};

export function ScoreSnippet({ score, hasCaption }: Props) {
  const values = [
    score.catchyness,
    score.vocals,
    score.sound,
    score.immersion,
    score.performance,
  ].flatMap(value => (new Array(5)).fill(0).map((_, idx) => {
    const roundedValue = Math.round(value);
    // Flipping index since it needs to go from bottom to top.
    const flippedIdx = 5 - idx;

    if (flippedIdx === roundedValue) return "═";
    if (flippedIdx > roundedValue) return "░";
    return "▒"
  }));

  return (
    <div class="score-snippet" aria-hidden>
      <figure>
        {values.map(value => (<span>{value}</span>))}
      </figure>

      {hasCaption && (
        <figcaption>
          {/* TODO: theme the ratings */}
          <span>catchyness</span>
          <span>vocals</span>
          <span>sound</span>
          <span>immersion</span>
          <span>performance</span>
        </figcaption>
      )}
    </div>
  );
}

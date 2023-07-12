import { Score } from "~/db/scores.ts";
import { Theme } from "~/db/theme.ts";
import { createThemeFormatter } from "~/utils/theme.ts";

type Props = {
  score: Omit<Score, "id" | "createdAt">;
  theme: Theme;
  hasCaption?: boolean;
};

export function ScoreSnippet({ score, hasCaption, theme }: Props) {
  const themed = createThemeFormatter(theme);

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
          <span>{themed("catchyness")}</span>
          <span>{themed("vocals")}</span>
          <span>{themed("sound")}</span>
          <span>{themed("immersion")}</span>
          <span>{themed("performance")}</span>
        </figcaption>
      )}
    </div>
  );
}

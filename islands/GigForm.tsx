import ScoreInput from "@/ScoreInput.tsx";
import { ArrowForwardIcon } from "@/icons/arrow-forward.tsx";
import { useMemo, useState } from "preact/hooks";
import { createRef } from "preact";
import { JSX } from "preact";
import { getObjectAverage } from "~/utils/math.ts";
import ScoreGuides from "./ScoreGuides.tsx";

type Props = {
  gigSlug: string;
  groupSlug: string;
};

export default function GigForm({
  gigSlug,
  groupSlug,
}: Props) {
  const containerRef = createRef<HTMLDivElement>();

  const [values, setValues] = useState({
    catchyness: 3,
    vocals: 3,
    sound: 3,
    immersion: 3,
    performance: 3,
  });

  const averageScore = useMemo(() => getObjectAverage(values), [values]);

  const handleFormChange = (
    event: JSX.TargetedEvent<HTMLFormElement, Event>,
  ) => {
    const formData = new FormData(event.currentTarget);

    setValues({
      catchyness: parseInt(formData.get("catchyness")?.toString() ?? ""),
      vocals: parseInt(formData.get("vocals")?.toString() ?? ""),
      sound: parseInt(formData.get("sound")?.toString() ?? ""),
      immersion: parseInt(formData.get("immersion")?.toString() ?? ""),
      performance: parseInt(formData.get("performance")?.toString() ?? ""),
    });
  };

  return (
    <form
      action={`/u/${groupSlug}/g/${gigSlug}/rate`}
      method="POST"
      class="gig-form"
      onChange={handleFormChange}
    >
      <div class="gig-form__scroller" ref={containerRef}>
        <section class="gig-form__section">
          <ScoreInput
            value={values.catchyness}
            label="Catchyness"
            name="catchyness"
          />

          <aside class="gig-form__scroll-hint">
            <em data-only-cursor aria-label="TAB to open next page">
              Scroll to next page
            </em>
            <em data-only-touch aria-hidden>Swipe to next page</em>
            <ArrowForwardIcon />
          </aside>

          <ScoreGuides>
            <blockquote>Did the songs draw you in?</blockquote>

            <blockquote>Missed a hit?</blockquote>

            <blockquote>Amazing choruses?</blockquote>

            <blockquote>Too all over the place?</blockquote>
          </ScoreGuides>
        </section>

        <section class="gig-form__section">
          <ScoreInput
            value={values.vocals}
            label="Vocals"
            name="vocals"
          />

          <ScoreGuides>
            <blockquote>Raw emotion?</blockquote>

            <blockquote>Weak technique?</blockquote>

            <blockquote>Inspiring lyrics?</blockquote>
          </ScoreGuides>
        </section>

        <section class="gig-form__section">
          <ScoreInput value={values.sound} label="Sound" name="sound" />

          <ScoreGuides>
            <blockquote>A bass that could replace your heartbeat?</blockquote>

            <blockquote>Couldn't hear the singer?</blockquote>

            <blockquote>Sound issues?</blockquote>
          </ScoreGuides>
        </section>

        <section class="gig-form__section">
          <ScoreInput
            value={values.immersion}
            label="Immersion"
            name="immersion"
          />

          <ScoreGuides>
            <blockquote>Getting lost in the music?</blockquote>

            <blockquote>Checking instagram?</blockquote>

            <blockquote>Mind drifting away?</blockquote>
          </ScoreGuides>
        </section>

        <section class="gig-form__section">
          <ScoreInput
            value={values.performance}
            label="Performance"
            name="performance"
          />

          <ScoreGuides>
            <blockquote>Contagious energy?</blockquote>

            <blockquote>Staring at the stage?</blockquote>

            <blockquote>No connection to the audience?</blockquote>
          </ScoreGuides>
        </section>

        <div class="gig-form__submit">
          <section class="gig-form__average-score">
            <p>final score</p>
            <span>{averageScore.toFixed(1)} / 5</span>
          </section>

          <button type="submit">Rate!</button>
        </div>
      </div>
    </form>
  );
}

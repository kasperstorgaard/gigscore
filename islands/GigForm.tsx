import ScoreInput from "@/ScoreInput.tsx";
import { ArrowForward } from "@/icons/arrow-forward.tsx";
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
      <div class="gig-form__wrapper">
        <div class="gig-form__scroller" ref={containerRef}>
          <section class="gig-form__section">
            <ScoreInput
              value={values.catchyness}
              label="Catchyness"
              name="catchyness"
            />

            <aside class="gig-form__scroll-hint">
              <em data-only-cursor aria-label="TAB to open next page">Scroll to next page</em>
              <em data-only-touch aria-hidden>Swipe to next page</em>
              <ArrowForward />
            </aside>

            <ScoreGuides>
              <blockquote>
                Did the songs draw you in? <span>+</span>
              </blockquote>

              <blockquote>
                Missed a hit? <span>-</span>
              </blockquote>

              <blockquote>
                Amazing choruses? <span>+</span>
              </blockquote>

              <blockquote>
                Too all over the place? <span>-</span>
              </blockquote>
            </ScoreGuides>
          </section>

          <section class="gig-form__section">
            <ScoreInput
              value={values.vocals}
              label="Vocals"
              name="vocals"
            />

            <ScoreGuides>
              <blockquote>
                Raw emotion? <span>+</span>
              </blockquote>

              <blockquote>
                Weak technique? <span>-</span>
              </blockquote>

              <blockquote>
                Inspiring lyrics? <span>+</span>
              </blockquote>
            </ScoreGuides>
          </section>

          <section class="gig-form__section">
            <ScoreInput value={values.sound} label="Sound" name="sound" />

            <ScoreGuides>
              <blockquote>
                A bass that could replace your heartbeat? <span>+</span>
              </blockquote>

              <blockquote>
                Couldn't hear the singer? <span>-</span>
              </blockquote>

              <blockquote>
                Sound issues? <span>--</span>
              </blockquote>
            </ScoreGuides>
          </section>

          <section class="gig-form__section">
            <ScoreInput
              value={values.immersion}
              label="Immersion"
              name="immersion"
            />

            <ScoreGuides>
              <blockquote>
                Getting lost in the music? <span>+</span>
              </blockquote>

              <blockquote>
                Checking instagram? <span>-</span>
              </blockquote>

              <blockquote>
                Mind drifting away? <span>+</span>
              </blockquote>
            </ScoreGuides>
          </section>

          <section class="gig-form__section">
            <ScoreInput
              value={values.performance}
              label="Performance"
              name="performance"
            />

            <ScoreGuides>
              <blockquote>
                Contagious energy? <span>++</span>
              </blockquote>

              <blockquote>
                Staring at the stage? <span>-</span>
              </blockquote>

              <blockquote>
                No connection to the audience? <span>--</span>
              </blockquote>
            </ScoreGuides>
          </section>

          <div class="gig-form__submit">
            <section class="gig-form__average-score">
              <p>final score</p>
              <span>{averageScore} / 5</span>
            </section>

            <button type="submit">Rate!</button>
          </div>
        </div>
      </div>
    </form>
  );
}

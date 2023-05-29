import ScoreInput from "@/ScoreInput.tsx";
import { ArrowForward } from "@/icons/arrow-forward.tsx";
import { asset, Head } from "$fresh/runtime.ts";
import { useMemo, useState } from "preact/hooks";
import { createRef } from "preact";
import { JSX } from "preact";
import { getAverageScore } from "../shared/utils.ts";
import ScoreGuides from "./ScoreGuides.tsx";

type Props = {
  groupSlug: string;
};

export default function GigForm({
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

  const averageScore = useMemo(() => getAverageScore(values), [values]);

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
    <>
      <Head>
        <link rel="stylesheet" href={asset("gig-form.css")} />
      </Head>

      <form
        action={`/${groupSlug}/gigs`}
        method="POST"
        class="gig-form"
        onChange={handleFormChange}
      >
        <div class="gig-form__wrapper">
          <div class="gig-form__scroller" ref={containerRef}>
            <section class="gig-form__section">
              <fieldset class="gig-form__info">
                <label>
                  Name of the band / artist?
                  <input type="text" name="name" />
                </label>

                <label>
                  Where did they play?<br />
                  (optional)
                  <input type="text" name="locationName" />
                </label>
              </fieldset>
              <aside class="gig-form__scroll-hint">
                Swipe / scroll to next page
                <ArrowForward />
              </aside>
            </section>

            <section class="gig-form__section">
              <ScoreInput
                value={values.catchyness}
                label="Catchyness"
                name="catchyness"
              />

              <ScoreGuides>
                <blockquote>
                  Did the songs draw you in? ➕
                </blockquote>

                <blockquote>
                  Missed a hit? ➖
                </blockquote>

                <blockquote>
                  Amazing choruses? ➕
                </blockquote>

                <blockquote>
                  Too all over the place? ➖
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
                  Raw emotion? ➕
                </blockquote>

                <blockquote>
                  Weak technique? ➖
                </blockquote>

                <blockquote>
                  Inspiring lyrics? ➕
                </blockquote>
              </ScoreGuides>
            </section>

            <section class="gig-form__section">
              <ScoreInput value={values.sound} label="Sound" name="sound" />

              <ScoreGuides>
                <blockquote>
                  A bass that could replace your heartbeat? ➕
                </blockquote>

                <blockquote>
                  Couldn't hear the singer? ➖
                </blockquote>

                <blockquote>
                  Sound issues? ➖➖
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
                  Getting lost in the music? ➕
                </blockquote>

                <blockquote>
                  Checking instagram? ➖
                </blockquote>

                <blockquote>
                  Mind drifting away? ➕
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
                  Contagious energy? ➕➕
                </blockquote>

                <blockquote>
                  Staring at the stage? ➖
                </blockquote>

                <blockquote>
                  No connection to the audience? ➖➖
                </blockquote>
              </ScoreGuides>
            </section>

            <div class="gig-form__submit">
              <section class="gig-form__average-score">
                <p>final score:</p>
                <span>{averageScore} / 5</span>
              </section>
              <button type="submit">Rate!</button>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}

import ScoreInput from "@/ScoreInput.tsx";
import { ArrowForward } from "@/icons/arrow-forward.tsx";

type Props = {
  groupSlug: string;
};

export default function GigForm({
  groupSlug,
}: Props) {
  return (
    <form
      action={`/${groupSlug}/gigs`}
      method="POST"
      class="gig-form"
    >
      <div class="gig-form__wrapper">
        <div class="gig-form__scroller">
          <section class="gig-form__section">
            <fieldset class="gig-form__info">
              <label>
                Name
                <input type="text" name="name" />
              </label>

              <label>
                Location
                <input type="text" name="locationName" />
              </label>
            </fieldset>
            <aside class="gig-form__scroll-hint">
              swipe/scroll to next page here
              <ArrowForward />
            </aside>
          </section>

          <section class="gig-form__section">
            <ScoreInput value={3} label="Catchyness" name="catchyness" />
          </section>

          <section class="gig-form__section">
            <ScoreInput value={3} label="Vocals" name="vocals" />
          </section>

          <section class="gig-form__section">
            <ScoreInput value={3} label="Sound" name="sound" />
          </section>

          <section class="gig-form__section">
            <ScoreInput value={3} label="Immersion" name="immersion" />
          </section>

          <section class="gig-form__section">
            <ScoreInput value={3} label="Performance" name="performance" />
          </section>

          <div class="gig-form__submit">
            <button type="submit">Rate!</button>
          </div>
        </div>
      </div>
    </form>
  );
}

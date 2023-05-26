import { PageProps } from "$fresh/server.ts";
import { Head, asset } from "$fresh/runtime.ts";
import MainLayout from "../../components/layouts/main-layout.tsx";
import { ArrowForward } from "../../components/icons/arrow-forward.tsx";

export default function CreateGig(props: PageProps) {
  return (
    <>
      <Head>
        <link rel="stylesheet" href={asset("create-gig.css")} />
      </Head>

      <MainLayout>
        <form action={`/${props.params.groupSlug}/gigs`} method="POST" class="create-gig">
          <div class="create-gig__wrapper">
            <div class="create-gig__scroller">
              <section class="create-gig__section">
                <fieldset class="create-gig__info">
                  <label>
                    Name
                    <input type="text" name="name" />
                  </label>

                  <label>
                    Location
                    <input type="text" name="locationName" />
                  </label>
                </fieldset>
              </section>

              <section  class="create-gig__section">
                <label class="create-gig__score">
                  Catchyness
                  <input type="range" name="catchyness" min="1" max="5" />
                </label>
              </section>

              <section  class="create-gig__section">
                <label class="create-gig__score">
                  Vocals
                  <input type="range" name="vocals" min="1" max="5" />
                </label>
              </section>

              <section  class="create-gig__section">
                <label class="create-gig__score">
                  Sound
                  <input type="range" name="sound" min="1" max="5" />
                </label>
              </section>

              <section  class="create-gig__section">
                <label class="create-gig__score">
                  Immersion
                  <input type="range" name="immersion" min="1" max="5" />
                </label>
              </section>

              <section  class="create-gig__section">
                <label class="create-gig__score">
                  Performance
                  <input type="range" name="performance" min="1" max="5" />
                </label>
              </section>

              <div class="create-gig__submit">
                <button type="submit">Rate!</button>
              </div>
            </div>
          </div>
          <aside class="create-gig__scroll-hint">
            <ArrowForward />
          </aside>
        </form>
      </MainLayout>
    </>
  );
}

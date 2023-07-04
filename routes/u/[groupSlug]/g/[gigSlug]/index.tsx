import { Handlers, PageProps } from "$fresh/server.ts";
import { getGigBySlug, Gig } from "~/db/gigs.ts";
import { getGroupBySlug, Group } from "~/db/groups.ts";
import { APIError, getLanguage, getTimeAgo, getVerdict } from "~/utils.ts";
import { listScores, Score } from "~/db/scores.ts";
import { WithSession } from "fresh_session";
import { ScoreSnippet } from "@/ScoreSnippet.tsx";
import { asset, Head } from "$fresh/runtime.ts";
import MainLayout from "@/layouts/main-layout.tsx";
import { Breadcrumb } from "@/Breadcrumb.tsx";
import { getLocationByGig, Location } from "~/db/locations.ts";

type Data = {
  group: Group;
  scores: Score[];
  score: Omit<Score, "createdAt" | "id">;
  gig: Gig;
  location: Location;
  language: string;
};

export const handler: Handlers<Data, WithSession> = {
  // Read gig
  GET: async (req, ctx) => {
    try {
      const [gropErr, group] = await getGroupBySlug({
        groupSlug: ctx.params.groupSlug,
      });
      if (gropErr) throw gropErr;

      const [gigErr, gig] = await getGigBySlug({
        groupId: group.id,
        gigSlug: ctx.params.gigSlug,
      });
      if (gigErr) throw gigErr;

      const [locationErr, location] = await getLocationByGig({
        groupId: group.id,
        gigId: gig.id,
      });
      if (locationErr) throw locationErr;

      const [scoresErr, scores] = await listScores({
        groupId: group.id,
        gigId: gig.id,
      });
      if (scoresErr) throw scoresErr;

      const score: Data["score"] = {
        catchyness: scores.reduce((sum, item) => sum + item.catchyness, 0) /
          scores.length,
        vocals: scores.reduce((sum, item) => sum + item.vocals, 0) /
          scores.length,
        sound: scores.reduce((sum, item) => sum + item.sound, 0) /
          scores.length,
        immersion: scores.reduce((sum, item) => sum + item.immersion, 0) /
          scores.length,
        performance: scores.reduce((sum, item) => sum + item.performance, 0) /
          scores.length,
        average: scores.reduce((sum, item) => sum + item.average, 0) /
          scores.length,
      };

      return ctx.render({
        group,
        gig,
        scores,
        score,
        location,
        language: getLanguage(req),
      });
    } catch (err) {
      return new Response("", {
        status: (err as APIError).status ?? 500,
        statusText: (err as APIError).statusText ?? err.message,
      });
    }
  },
};

export default function GigDetails(props: PageProps<Data>) {
  return (
    <>
      <Head>
        <link rel="stylesheet" href={asset("/components/score-list.css")} />
        <link rel="stylesheet" href={asset("/components/score-snippet.css")} />
        <link rel="stylesheet" href={asset("/components/score-summary.css")} />
        <link rel="stylesheet" href={asset("/pages/gig-page.css")} />
      </Head>

      <MainLayout>
        <main class="gig-page">
          <header>
            <Breadcrumb
              items={[{
                url: `/u/${props.data.group.slug}`,
                label: props.data.group.name,
              }, {
                url: `/u/${props.data.group.slug}/g`,
                label: "gigs",
              }, {
                url: `/u/${props.data.group.slug}/g/${props.data.gig.slug}`,
                label: props.data.gig.name,
              }]}
            />
          </header>

          <section class="gig-page__top-section">
            <div class="gig-page__gig-details">
              <p>
                {Intl.DateTimeFormat(props.data.language).format(
                  props.data.gig.createdAt,
                )}
              </p>
              <h1>{props.data.gig.name}</h1>
              {/* TODO: add option to select when they played, not just same day */}
              {props.data.location
                ? (
                  <p>
                    {props.data.location.name}
                  </p>
                )
                : null}
            </div>

            <aside class="gig-page__score">
              <h3>Score</h3>

              <div class="score-summary">
                <div class="score-summary__value">
                  {props.data.score.average}
                </div>
                <ScoreSnippet score={props.data.score} />
              </div>
            </aside>
          </section>

          <section class="score-list">
            <h3>Latest scores</h3>

            <ol>
              {props.data.scores.map((score) => (
                <li key={score.id} class="score-summary">
                  <div class="score-summary__value">
                    <span>{score.average}</span>
                    <i>
                      {getTimeAgo(score.createdAt, {
                        language: props.data.language,
                      })}
                    </i>
                  </div>
                  <ScoreSnippet score={score} />
                </li>
              ))}
            </ol>
          </section>
        </main>
      </MainLayout>
    </>
  );
}

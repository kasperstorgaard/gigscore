import { Handlers, PageProps } from "$fresh/server.ts";
import { asset, Head } from "$fresh/runtime.ts";
import { WithSession } from "fresh_session";

import { getGigBySlug, Gig } from "~/db/gigs.ts";
import { getGroupBySlug, Group } from "~/db/groups.ts";
import { getLocationByGig, Location } from "~/db/locations.ts";
import { getAggregatedScore, listScores, Score } from "~/db/scores.ts";
import { getTheme, Theme } from "~/db/theme.ts";
import { APIError } from "~/utils/errors.ts";
import { getLanguage } from "~/utils/request.ts";
import { getTimeAgo } from "~/utils/formatters.ts";
import { ScoreSnippet } from "@/ScoreSnippet.tsx";
import SplitLayout from "@/layouts/SplitLayout.tsx";
import { Breadcrumb } from "@/Breadcrumb.tsx";
import HeaderActions from "#/HeaderActions.tsx";

type Data = {
  group: Group;
  scores: Score[];
  score: Omit<Score, "createdAt" | "id">;
  gig: Gig;
  location: Location | null;
  language: string;
  theme: Theme;
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

      const [_locationErr, location] = await getLocationByGig({
        groupId: group.id,
        gigId: gig.id,
      });

      const [scoresErr, scores] = await listScores({
        groupId: group.id,
        gigId: gig.id,
      });
      if (scoresErr) throw scoresErr;

      const [scoreErr, score] = await getAggregatedScore({
        groupId: group.id,
        gigId: gig.id,
      });
      if (scoreErr) throw scoreErr;

      return ctx.render({
        group,
        gig,
        scores,
        score,
        location,
        language: getLanguage(req),
        theme: getTheme(ctx.state.session),
      });
    } catch (err) {
      console.log("ehm what?", err);
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

        <title>Gigscore - {props.data.gig.name}</title>

        <meta
          name="description"
          content={`Check the scores for ${props.data.gig.name}`}
        />
      </Head>

      <header class="header" color-scheme={props.data.theme}>
        <Breadcrumb
          items={[{
            url: `/u/${props.data.group.slug}`,
            label: props.data.group.name,
          }, {
            url: `/u/${props.data.group.slug}/g/${props.data.gig.slug}`,
            label: props.data.gig.name,
          }]}
        />
        <HeaderActions initialTheme={props.data.theme} />
      </header>

      <SplitLayout>
        <main class="gig-page" color-scheme={props.data.theme}>
          <section class="gig-page__top-section">
            <div class="gig-page__gig-details">
              <span class="kicker">
                {Intl.DateTimeFormat(props.data.language).format(
                  props.data.gig.createdAt,
                )}
              </span>

              <h1>{props.data.gig.name}</h1>

              {/* TODO: add option to select when they played, not just same day */}
              {props.data.location
                ? (
                  <span>
                    {props.data.location.name}
                  </span>
                )
                : null}
            </div>

            <aside class="gig-page__score">
              <p>score</p>
              <span>
                {props.data.score.average.toFixed(1)}
              </span>
              <p>avg.</p>
            </aside>

            <aside class="gig-page__score-figure">
              <ScoreSnippet score={props.data.score} hasCaption />
            </aside>
          </section>

          <section class="score-list" color-scheme="light">
            <h3>Latest scores</h3>

            <ol>
              {props.data.scores.map((score) => (
                <li key={score.id} class="score-summary">
                  <div class="score-summary__value">
                    <span>{score.average.toFixed(1)}</span>
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
      </SplitLayout>
    </>
  );
}

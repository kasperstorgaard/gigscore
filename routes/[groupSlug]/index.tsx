import { PageProps } from "$fresh/server.ts";

export default function Index(props: PageProps) {
  return (
    <section>
      <form action={`/${props.params.groupSlug}/gigs`} method="POST">
        <label for="name">Name</label>
        <input type="text" name="name" />

        <label for="locationName">Location</label>
        <input type="text" name="locationName" />

        <input type="range" name="track" min="1" max="5" />
        <input type="range" name="lead" min="1" max="5" />
        <input type="range" name="sound" min="1" max="5" />
        <input type="range" name="immersion" min="1" max="5" />
        <input type="range" name="performance" min="1" max="5" />
        <input type="hidden" name="groupSlug" value={props.params.groupSlug} />
        <button type="submit">Rate!</button>
      </form>
    </section>
  );
}
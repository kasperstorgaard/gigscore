import { PageProps } from "$fresh/server.ts";

export default function Index(props: PageProps) {
  return (
    <section>
      <form action={`/${props.params.sid}/gig`} method="POST">
        <input type="text" name="name" />
        <input type="range" name="track" min="1" max="5" />
        <input type="range" name="lead" min="1" max="5" />
        <input type="range" name="sound" min="1" max="5" />
        <input type="range" name="immersion" min="1" max="5" />
        <input type="range" name="performance" min="1" max="5" />
        <input type="hidden" name="sid" value={props.params.sid} />
        <button type="submit">Rate!</button>
      </form>
    </section>
  );
}

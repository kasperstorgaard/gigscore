import { asset, Head } from "$fresh/runtime.ts";
import { useEffect, useState } from "preact/hooks";
import { ComponentChildren, createRef } from "preact";
import { useIntersect } from "~/hooks/use-intersect.ts";

type Props = {
  children: ComponentChildren;
};

export default function ScoreGuides({ children }: Props) {
  const ref = createRef();
  const [setNode, entry] = useIntersect({ rootMargin: "200px" });

  useEffect(() => setNode(ref.current), []);

  return (
    <>
      <Head>
        <link rel="stylesheet" href={asset("/components/score-guides.css")} />
      </Head>

      <aside
        ref={ref}
        class="score-guides"
        data-is-intersecting={entry?.isIntersecting}
      >
        {children}
      </aside>
    </>
  );
}

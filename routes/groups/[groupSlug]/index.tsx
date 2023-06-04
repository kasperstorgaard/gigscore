import { PageProps } from "$fresh/server.ts";
import { asset, Head } from "$fresh/runtime.ts";
import MainLayout from "@/layouts/main-layout.tsx";
import GigForm from "#/GigForm.tsx";

export default function GroupPage(props: PageProps) {
  return (
    <MainLayout>
      <Head>
        <link rel="stylesheet" href={asset("/group-page.css")} />
        <link rel="stylesheet" href={asset("/gig-form.css")} />
        <link rel="stylesheet" href={asset("/score-input.css")} />
      </Head>

      <main class="group-page">
        <GigForm groupSlug={props.params.groupSlug} />
      </main>
    </MainLayout>
  );
}

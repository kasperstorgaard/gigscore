import { PageProps } from "$fresh/server.ts";
import { asset, Head } from "$fresh/runtime.ts";
import MainLayout from "@/layouts/main-layout.tsx";
import GigForm from "@/GigForm.tsx";

export default function CreateGig(props: PageProps) {
  return (
    <>
      <Head>
        <link rel="stylesheet" href={asset("create-gig.css")} />
      </Head>

      <MainLayout>
        <GigForm groupSlug={props.params.groupSlug} />
      </MainLayout>
    </>
  );
}

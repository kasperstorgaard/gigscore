import { Head, asset } from "$fresh/runtime.ts";
import { ComponentChildren } from "preact";

type Props = {
  children: ComponentChildren;
};

export default function MainLayout({ children }: Props) {
  return (
    <>
      <Head>
        <link rel="stylesheet" href={asset("/base/open-props.min.css")} />
        <link rel="stylesheet" href={asset("/base/normalize.min.css")} />
        <link rel="stylesheet" href={asset("/base/vars.css")} />
        <link rel="stylesheet" href={asset("/base/buttons.min.css")} />

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Roboto+Slab&display=swap" rel="stylesheet" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="crossOrigin" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@200&display=swap" rel="stylesheet" />

        <link rel="stylesheet" href={asset("/base/main.css")} />
        <link rel="stylesheet" href={asset("/layouts/main-layout.css")} />
        <link rel="stylesheet" href={asset("/base/forms.css")} />
        <link rel="stylesheet" href={asset("/components/breadcrumbs.css")} />
      </Head>
      
      {children}
    </>
  )
}
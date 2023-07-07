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

        {/* @ts-ignore */}
        <link href="https://fonts.googleapis.com/css2?family=Source+Code+Pro&display=swap" rel="preload" as="style" onLoad="this.rel ='stylesheet';this.onload=null;" />
        <noscript>
          <link href="https://fonts.googleapis.com/css2?family=Source+Code+Pro&display=swap" rel="stylesheet" />
        </noscript>
        
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="crossOrigin" />

        <link rel="stylesheet" href={asset("/base/main.css")} />
        <link rel="stylesheet" href={asset("/base/header.css")} />
        <link rel="stylesheet" href={asset("/layouts/focus-layout.css")} />
        <link rel="stylesheet" href={asset("/base/forms.css")} />
        <link rel="stylesheet" href={asset("/components/breadcrumbs.css")} />
      </Head>
      
      {children}
    </>
  )
}
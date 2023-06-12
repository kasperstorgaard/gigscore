// DO NOT EDIT. This file is generated by fresh.
// This file SHOULD be checked into source version control.
// This file is automatically updated during development when running `dev.ts`.

import config from "./deno.json" assert { type: "json" };
import * as $0 from "./routes/_middleware.ts";
import * as $1 from "./routes/index.tsx";
import * as $2 from "./routes/u/[groupSlug]/g/[gigSlug]/index.tsx";
import * as $3 from "./routes/u/[groupSlug]/g/[gigSlug]/rate.tsx";
import * as $4 from "./routes/u/[groupSlug]/g/index.tsx";
import * as $5 from "./routes/u/[groupSlug]/index.tsx";
import * as $6 from "./routes/u/[groupSlug]/locations/[locationSlug].tsx";
import * as $7 from "./routes/u/[groupSlug]/locations/index.tsx";
import * as $8 from "./routes/u/_middleware.ts";
import * as $$0 from "./islands/Counter.tsx";
import * as $$1 from "./islands/GigForm.tsx";
import * as $$2 from "./islands/ScoreGuides.tsx";

const manifest = {
  routes: {
    "./routes/_middleware.ts": $0,
    "./routes/index.tsx": $1,
    "./routes/u/[groupSlug]/g/[gigSlug]/index.tsx": $2,
    "./routes/u/[groupSlug]/g/[gigSlug]/rate.tsx": $3,
    "./routes/u/[groupSlug]/g/index.tsx": $4,
    "./routes/u/[groupSlug]/index.tsx": $5,
    "./routes/u/[groupSlug]/locations/[locationSlug].tsx": $6,
    "./routes/u/[groupSlug]/locations/index.tsx": $7,
    "./routes/u/_middleware.ts": $8,
  },
  islands: {
    "./islands/Counter.tsx": $$0,
    "./islands/GigForm.tsx": $$1,
    "./islands/ScoreGuides.tsx": $$2,
  },
  baseUrl: import.meta.url,
  config,
};

export default manifest;

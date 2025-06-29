import * as Sentry from "@sentry/astro";

import { nodeProfilingIntegration } from "@sentry/profiling-node";

Sentry.init({
  dsn: "https://d5125af91b291729449645d7875e47d6@o4505172549369856.ingest.us.sentry.io/4508826852458496",
  integrations: [
    // Add our Profiling integration
    nodeProfilingIntegration(),
  ],

  // Define how likely traces are sampled. Adjust this value in production,
  // or use tracesSampler for greater control.
  tracesSampleRate: 1.0,

  // Set sampling rate for profiling
  // This is relative to tracesSampleRate
  profilesSampleRate: 1.0,
});

import { wrap } from "svelte-spa-router/wrap";

import Home from "./lib/Home.svelte";
import LoadingAnim from "./lib/loadingAnim.svelte";

export const routes = {
  // Home page
  "/": wrap({
    asyncComponent: () => import("./lib/Home.svelte"),
  }),
  "/Svelt-Components-TJ": wrap({
    asyncComponent: () => import("./lib/Home.svelte"),
  }),
  "/home": wrap({
    asyncComponent: () => import("./lib/Home.svelte"),
  }),

  // main pages
  "/firstRun": wrap({
    asyncComponent: () => import("./lib/Adventures/FirstRun/FirstRun.svelte"),
  }),

  "/SvelteFFT": wrap({
    asyncComponent: () => import("./lib/Others/Svelte-fft/SvelteFFT.svelte"),
  }),
  "/otherTry": wrap({
    asyncComponent: () => import("./lib/Others/Svelte-fft/otherTry.svelte"),
  }),
  "/visualizing": wrap({
    asyncComponent: () => import("./lib/Others/Svelte-fft/visualizing.svelte"),
  }),

  // utility page

  // error catching
  "*": wrap({
    asyncComponent: () => import("./lib/E404.svelte"),
  }),
};

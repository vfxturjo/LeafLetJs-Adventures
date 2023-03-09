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

  // utility page

  // error catching
  "*": wrap({
    asyncComponent: () => import("./lib/E404.svelte"),
  }),
};

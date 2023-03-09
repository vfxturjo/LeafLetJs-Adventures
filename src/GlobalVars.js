import { writable } from "svelte-local-storage-store";

export const Current_app = writable("Current_app", 0);
export const color_theme = writable("color-theme", "light");

// svelte-inview vars
export const inview_options_persistant = {
  rootMargin: "-300px",
  unobserveOnEnter: false,
};
export const inview_options_onetime = {
  rootMargin: "-100px",
  unobserveOnEnter: true,
};

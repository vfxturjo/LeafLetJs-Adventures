<script>
// #region IMPORTS
// importing CSS
import "./app.postcss";

// importing modules
import Router, { link } from "svelte-spa-router";
import { routes } from "./routes";
import LoadingAnim from "./lib/loadingAnim.svelte";
import AppTopBar from "./AppTopBar.svelte";

// #endregion

// main script
let loading_page = false;
</script>

<main>
  <!-- Top bar -->
  <AppTopBar />

  <!-- PAGE LOADING ANIMATION -->
  {#if loading_page}
    <LoadingAnim />
  {/if}

  <!-- PAGES -->
  <Router
    routes="{routes}"
    on:routeLoading="{() => {
      loading_page = true;
    }}"
    on:routeLoaded="{() => {
      loading_page = false;
    }}"
  />
</main>

<script lang="ts">
import { P, Card, A, Hr } from "flowbite-svelte";
import { blur, slide } from "svelte/transition";
// Icons loading
import Icon from "@iconify/svelte";
import counterIcon from "@iconify/icons-mdi/counter";
import timerOutline from "@iconify/icons-material-symbols/timer-outline";
import imageGalleryLine from "@iconify/icons-clarity/image-gallery-line";

let pages = [
  {
    App_name: "First Run",
    icon: counterIcon,
    href: "#/firstRun",
  },
  {
    App_name: "Multi-Counter App",
    icon: counterIcon,
    href: "#/CounterApp",
  },
  {
    App_name: "Other -> Svelte-FFT",
    icon: counterIcon,
    href: "#/SvelteFFT",
  },
  {
    App_name: "Other -> otherTry",
    icon: counterIcon,
    href: "#/otherTry",
  },
  {
    App_name: "Other -> visualizing",
    icon: counterIcon,
    href: "#/visualizing",
  },
];
</script>

<div class="p-2">
  <!-- Intro text -->
  <div class="pb-2">
    <P size="4xl" class="text-center">Leaflet.js Adventures!</P>
    <P size="xl" class="text-center"
      >A gallery of things I have done with leaflet.js</P
    >
  </div>

  <!-- Apps links -->
  <div class="flex justify-center gap-4 flex-wrap">
    {#each pages as page}
      <Card
        size="xs"
        href="{page.href}"
        class="basis-52 hover:drop-shadow-xl transition-all duration-500"
      >
        <!-- <span class="app_icon_card {page.icon}"></span> -->
        <Icon icon="{page.icon}" class="app_icon_card" />
        <P align="center">{page.App_name}</P></Card
      >
    {/each}
  </div>

  <div class="mt-8 text-right bottom-0 left-0 right-0 fixed z-10">
    <P class="opacity-50 text-center">WIP, expect bugs and broken links...</P>
    <Hr class="bg-gray-300" />
    <A href="#/Designer">Green Room... for designing elements...</A><br />
    <A href="#/Designer1">Error Link</A>
  </div>
</div>

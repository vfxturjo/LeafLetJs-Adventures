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
    App_name: "Gallery of components",
    icon: imageGalleryLine,
    href: "#/Gallery",
  },
  {
    App_name: "Multi-Counter App",
    icon: counterIcon,
    href: "#/CounterApp",
  },
];
</script>

<div class="p-2">
  <!-- Intro text -->
  <div class="pb-2">
    <P size="4xl" class="text-center">Survapps: Surveying Apps!</P>
    <P size="xl" class="text-center"
      >An unified place for many useful survey apps.</P
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

  <div class="mt-8 text-right">
    <P class="opacity-50">
      Currently the Multi-Counter app is being developed. Timer app is just a
      placeholder.
    </P>
    <Hr class="bg-gray-300" />
    <A href="#/Designer">Green Room... for designing elements...</A><br />
    <A href="#/Designer1">Error Link</A>
  </div>
</div>

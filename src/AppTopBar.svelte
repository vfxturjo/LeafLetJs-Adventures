<script>
// #region IMPORTS
import {
  Navbar,
  NavBrand,
  NavLi,
  NavUl,
  NavHamburger,
  ToolbarButton,
  Dropdown,
  DropdownItem,
  DropdownDivider,
  P,
} from "flowbite-svelte";
import { slide } from "svelte/transition";
import { Current_app, color_theme } from "./GlobalVars";

// #endregion

// main script
const toggleTheme = () => {
  const DarkMode = window.document.documentElement.classList.toggle("dark");
  $color_theme = DarkMode ? "dark" : "light";
  // localStorage.setItem("color-theme", $DarkMode ? "dark" : "light");
};
</script>

<!-- LOAD THE THEME COLOR -->
<svelte:head>
  <script>
  if (window) {
    localStorage.getItem("color-theme") === "dark" ||
    (!("color-theme" in localStorage) &&
      window.matchMedia("(prefers-color-scheme: dark)").matches)
      ? window.document.documentElement.classList.add("dark")
      : window.document.documentElement.classList.remove("dark");
  }
  </script>
</svelte:head>

<Navbar let:hidden let:toggle>
  <NavBrand href="./">
    <span class="fab fa-unity m-3"></span>
    <span
      class="self-center whitespace-nowrap text-xl font-semibold dark:text-white"
    >
      Survapps
    </span>
  </NavBrand>

  <NavHamburger on:click="{toggle}" />
  <NavUl hidden="{hidden}">
    <NavLi class="cursor-pointer" on:click="{toggleTheme}">Toggle Theme</NavLi>
    <NavLi href="#/Gallery" active="{$Current_app == 'Gallery'}">Gallery</NavLi>
    <NavLi href="./">Created By: vfxTurjo</NavLi>
  </NavUl>
</Navbar>

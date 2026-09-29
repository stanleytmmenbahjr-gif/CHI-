<script setup>
import { RouterView } from 'vue-router'
import SiteHeader from './components/SiteHeader.vue'
import SiteFooter from './components/SiteFooter.vue'
import ScrollEffects from './components/ScrollEffects.vue'
</script>

<template>
  <div class="site-frame">
    <SiteHeader />
    <main id="main-content"><RouterView /></main>
    <SiteFooter />
    <ScrollEffects />
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import { ArrowRight } from '@lucide/vue'
import { photos, team } from '../data/site'
import TeamCard from '../components/TeamCard.vue'
import SectionHeading from '../components/SectionHeading.vue'
</script>

<template>
  <div>
    <section class="page-hero"><img :src="photos.teamHero" alt="Count Her In team members working with young people" loading="eager" fetchpriority="high" decoding="async" /><div class="container page-hero-content"><span class="eyebrow">People behind the work</span><h1 class="display">Meet the team.</h1><p>The passionate individuals working to empower girls and create lasting change across Liberia.</p><div class="breadcrumb"><RouterLink to="/">Home</RouterLink><span>/</span><span>Our team</span></div></div></section>
    <section class="section team-section" v-reveal><div class="container"><SectionHeading eyebrow="Our people" title="Local knowledge. Shared purpose." description="We bring different experiences together around one belief: girls deserve the freedom and support to shape their own future." /><div class="team-full-grid"><TeamCard v-for="member in team" :key="member.name" :member="member" /></div></div></section>
    <section class="cta-band"><div class="container cta-inner"><div><h2 class="display">Make room for girls to lead.</h2><p>Meet us as a volunteer, partner, or advocate for change.</p></div><RouterLink class="button button-light" to="/volunteer">Join the team <ArrowRight :size="15" /></RouterLink></div></section>
  </div>
</template>
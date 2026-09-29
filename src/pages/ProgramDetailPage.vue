<script setup>
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { ArrowRight, Check } from '@lucide/vue'
import SectionHeading from '../components/SectionHeading.vue'
import ProgramCard from '../components/ProgramCard.vue'
import { programs } from '../data/site'

const route = useRoute()
const program = computed(() => programs.find((item) => item.slug === route.params.slug) || programs[0])
const morePrograms = computed(() => programs.filter((item) => item.slug !== program.value.slug).slice(0, 3))
</script>

<template>
  <div>
    <section class="page-hero"><img :src="program.image" :alt="program.title" loading="eager" fetchpriority="high" decoding="async" /><div class="container page-hero-content"><span class="eyebrow">{{ program.tag }}</span><h1 class="display">{{ program.title }}.</h1><p>{{ program.description }}</p><div class="breadcrumb"><RouterLink to="/">Home</RouterLink><span>/</span><RouterLink to="/programs">Programs</RouterLink><span>/</span><span>{{ program.title }}</span></div></div></section>
    <section class="section" v-reveal><div class="container about-grid"><div class="about-copy"><span class="eyebrow">The program</span><h2 class="display">Growing skills, voice, and possibility.</h2><p>{{ program.description }} Count Her In works with young people, families, and community partners to make sure the learning is relevant, accessible, and led by local voices.</p><p>Through practical sessions, peer connection, and ongoing mentorship, participants build confidence and create steps toward the change they want to see.</p><RouterLink class="button button-primary" to="/volunteer">Take part <ArrowRight :size="15" /></RouterLink></div><div class="program-outcomes"><SectionHeading eyebrow="What grows here" title="A stronger foundation." description="Participants take away skills and support they can keep using." /><ul class="outcome-list"><li><Check :size="17" /> Confidence to speak and participate</li><li><Check :size="17" /> Practical knowledge and peer connection</li><li><Check :size="17" /> Leadership opportunities close to home</li><li><Check :size="17" /> Trusted relationships and community support</li></ul></div></div></section>
    <section class="section focus-section" v-reveal><div class="container"><SectionHeading eyebrow="Explore more" title="Other ways to grow." /><div class="program-grid"><ProgramCard v-for="item in morePrograms" :key="item.slug" :program="item" /></div></div></section>
  </div>
</template>
<script setup>
import { ArrowUpRight } from '@lucide/vue'
defineProps({ program: { type: Object, required: true } })
</script>

<template>
  <article class="program-card">
    <div class="program-image"><img :src="program.image" :alt="program.title + ' program'" loading="lazy" decoding="async" /><span class="program-tag">{{ program.tag }}</span></div>
    <div class="program-copy"><h3>{{ program.title }}</h3><p>{{ program.description }}</p><RouterLink class="text-link" :to="`/programs/${program.slug}`">Learn more <ArrowUpRight :size="15" /></RouterLink></div>
  </article>
</template>
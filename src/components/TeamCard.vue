<script setup>
import { ArrowUpRight } from '@lucide/vue'
defineProps({ member: { type: Object, required: true } })
</script>

<template>
  <article class="team-card">
    <div class="team-photo"><img class="photo" :src="member.image" :alt="member.name" loading="lazy" decoding="async" /></div>
    <div class="team-copy"><h3>{{ member.name }}</h3><span class="team-role">{{ member.role }}</span><p>{{ member.bio }}</p><div class="socials"><a href="https://linkedin.com" :aria-label="`${member.name} on LinkedIn`"><span aria-hidden="true">in</span></a><a href="https://instagram.com" :aria-label="`${member.name} on Instagram`"><ArrowUpRight :size="15" /></a></div></div>
  </article>
</template>
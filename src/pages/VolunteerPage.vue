<script setup>
import { ref } from 'vue'
import { HeartHandshake, UsersRound } from '@lucide/vue'
import { photos } from '../data/site'

const sent = ref(false)
function submit() { sent.value = true }
</script>

<template>
  <section class="page-hero"><img :src="photos.impact" alt="Count Her In youth leaders celebrating program progress" loading="eager" fetchpriority="high" decoding="async" /><div class="container page-hero-content"><span class="eyebrow">Be part of the change</span><h1 class="display">Give your time.</h1><p>Join a community of people helping girls learn, lead, and make their voices heard.</p></div></section>
  <section class="section"><div class="container form-layout"><div class="form-aside"><span class="eyebrow">Volunteer with CHI</span><h2 class="display">Your time can make room for possibility.</h2><p>We welcome youth leaders, peer educators, mentors, and community members who care about girls’ rights and future.</p><div class="impact-grid"><div class="impact-item"><span class="impact-icon"><HeartHandshake :size="19" /></span><span>Share your skills</span></div><div class="impact-item"><span class="impact-icon"><UsersRound :size="19" /></span><span>Grow with community</span></div></div></div><form class="form-panel" @submit.prevent="submit"><div class="form-grid"><div class="field"><label for="vol-name">Your name</label><input id="vol-name" autocomplete="name" required /></div><div class="field"><label for="vol-email">Email address</label><input id="vol-email" type="email" autocomplete="email" required /></div><div class="field"><label for="vol-phone">Phone number</label><input id="vol-phone" type="tel" autocomplete="tel" /></div><div class="field"><label for="vol-interest">I'm interested in</label><select id="vol-interest"><option>Peer education</option><option>Mentorship</option><option>Community outreach</option><option>Events and logistics</option></select></div><div class="field field-full"><label for="vol-message">Tell us a little about yourself</label><textarea id="vol-message" required></textarea></div></div><button class="button button-primary" type="submit">Send my interest <HeartHandshake :size="15" /></button><p v-if="sent" class="form-success" role="status">Thank you for stepping forward. Our team will follow up soon.</p></form></div></section>
</template>
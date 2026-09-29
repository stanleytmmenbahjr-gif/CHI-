<script setup>
import { Mail, MapPin, Phone } from '@lucide/vue'
import { photos } from '../data/site'
import ContactForm from '../components/ContactForm.vue'
</script>

<template>
  <section class="page-hero"><img :src="photos.contact" alt="Count Her In team meeting with community members" loading="eager" fetchpriority="high" decoding="async" /><div class="container page-hero-content"><span class="eyebrow">Let’s connect</span><h1 class="display">Contact us.</h1><p>Have a question, partnership idea, or story to share? We’d love to hear from you.</p></div></section>
  <section class="section"><div class="container form-layout"><div class="form-aside"><span class="eyebrow">We’re listening</span><h2 class="display">Start a conversation.</h2><p>Whether you’re a young leader, a potential partner, or simply curious about our work, our team is here to connect.</p><div class="footer-contact"><span><MapPin :size="16" /> Monrovia, Liberia</span><span><Mail :size="16" /> countherin2023@gmail.com</span><span><Phone :size="16" /> +231 88 093 5662</span></div></div><ContactForm /></div></section>
</template>
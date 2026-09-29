<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { ArrowRight, ArrowUpRight, Mail, MapPin, Phone } from '@lucide/vue'
import { photos } from '../data/site'

const email = ref('')
const subscribed = ref(false)
function subscribe() {
  if (email.value.trim()) subscribed.value = true
}
</script>

<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-about">
          <RouterLink class="brand" to="/">
            <img class="brand-logo" :src="photos.logo" alt="Count Her In" loading="lazy" decoding="async" />
          </RouterLink>
          <p>Empowering adolescent girls and young women to shape a more just, hopeful future for Liberia.</p>
          <div class="footer-socials"><a href="https://instagram.com" aria-label="Instagram"><ArrowUpRight :size="16" /></a><a href="https://facebook.com" aria-label="Facebook"><span aria-hidden="true">f</span></a><a href="https://linkedin.com" aria-label="LinkedIn"><span aria-hidden="true">in</span></a></div>
        </div>
        <div>
          <h2 class="footer-heading">Explore</h2>
          <nav class="footer-links" aria-label="Footer navigation"><RouterLink to="/about">About us</RouterLink><RouterLink to="/programs">Our programs</RouterLink><RouterLink to="/impact">Our impact</RouterLink><RouterLink to="/team">Our team</RouterLink><RouterLink to="/gallery">Gallery</RouterLink></nav>
        </div>
        <div>
          <h2 class="footer-heading">Get involved</h2>
          <nav class="footer-links" aria-label="Get involved links"><RouterLink to="/volunteer">Volunteer</RouterLink><RouterLink to="/contact">Partner with us</RouterLink><RouterLink to="/donate">Donate</RouterLink><RouterLink to="/news">News & updates</RouterLink><RouterLink to="/events">Events</RouterLink></nav>
        </div>
        <div class="footer-news">
          <h2 class="footer-heading">Stay connected</h2>
          <p>Notes from the field, stories from girls, and ways to stand with our work.</p>
          <form class="newsletter-form" @submit.prevent="subscribe"><label class="sr-only" for="newsletter-email">Email address</label><input id="newsletter-email" v-model="email" type="email" autocomplete="email" placeholder="Your email address" required /><button aria-label="Subscribe" type="submit"><ArrowRight :size="17" /></button></form>
          <p v-if="subscribed" class="newsletter-success" role="status">Thank you for joining our community.</p>
        </div>
      </div>
      <div class="footer-bottom"><span>© {{ new Date().getFullYear() }} Count Her In Liberia. Every girl counts.</span><span class="footer-contact"><span><MapPin :size="13" /> Monrovia, Liberia</span><span><Mail :size="13" /> countherin2023@gmail.com</span><span><Phone :size="13" /> +231 88 093 5662</span></span></div>
    </div>
  </footer>
</template>
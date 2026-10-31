<script setup>
import { RouterView } from 'vue-router'
import { MessageCircle, Send } from '@lucide/vue'
import SiteHeader from './components/SiteHeader.vue'
import SiteFooter from './components/SiteFooter.vue'
import ScrollEffects from './components/ScrollEffects.vue'
</script>

<template>
  <div class="site-frame">
    <SiteHeader />
    <main id="main-content"><RouterView /></main>
    <SiteFooter />
    <div class="floating-chat" aria-label="Quick contact options">
      <a class="floating-chat-button whatsapp" href="https://wa.me/231880935662" target="_blank" rel="noreferrer" aria-label="Chat on WhatsApp">
        <Send :size="22" aria-hidden="true" />
      </a>
      <a class="floating-chat-button messenger" href="https://web.facebook.com/profile.php?id=61561626041242" target="_blank" rel="noreferrer" aria-label="Chat on Messenger">
        <MessageCircle :size="22" aria-hidden="true" />
      </a>
    </div>
    <ScrollEffects />
  </div>
</template>

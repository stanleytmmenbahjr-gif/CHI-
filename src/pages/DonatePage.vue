<script setup>
import { computed, ref } from 'vue'
import { Heart, LockKeyhole } from '@lucide/vue'
import { photos } from '../data/site'

const amounts = [25, 50, 100]
const amount = ref(50)
const customAmount = ref('')
const sent = ref(false)
const selectedAmount = computed(() => customAmount.value ? Number(customAmount.value) : amount.value)
function submit() { sent.value = true }
</script>

<template>
  <section class="page-hero"><img :src="photos.hero" alt="Count Her In peer educator speaking with community members" loading="eager" fetchpriority="high" decoding="async" /><div class="container page-hero-content"><span class="eyebrow">Stand with girls</span><h1 class="display">Give possibility.</h1><p>Your support helps girls find their voice, grow as leaders, and access the knowledge and support they deserve.</p></div></section>
  <section class="section"><div class="container form-layout"><div class="form-aside"><span class="eyebrow">Make a difference</span><h2 class="display">Every gift moves a girl forward.</h2><p>Your contribution supports peer educator training, learning materials, community dialogue, and youth-led initiatives.</p><p><LockKeyhole :size="15" /> This demo form does not process payments. Connect a verified payment provider before accepting donations.</p></div><form class="form-panel" @submit.prevent="submit"><h2 class="footer-heading">Choose your gift</h2><div class="donation-options"><button v-for="value in amounts" :key="value" type="button" :class="{ active: amount === value && !customAmount }" @click="amount = value; customAmount = ''">${{ value }}</button></div><div class="form-grid"><div class="field field-full"><label for="custom-amount">Or enter an amount (USD)</label><input id="custom-amount" v-model="customAmount" type="number" min="1" placeholder="Other amount" @input="amount = 0" /></div><div class="field"><label for="donor-name">Your name</label><input id="donor-name" autocomplete="name" required /></div><div class="field"><label for="donor-email">Email address</label><input id="donor-email" type="email" autocomplete="email" required /></div></div><button class="button button-primary" type="submit"><Heart :size="15" /> Continue with ${{ selectedAmount || 0 }}</button><p v-if="sent" class="form-success" role="status">Thank you for your generosity. Payment processing will be available once a secure payment partner is configured.</p></form></div></section>
</template>
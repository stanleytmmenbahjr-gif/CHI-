<script setup>
import { ref } from 'vue'
import { ChevronDown } from '@lucide/vue'
import { faqs } from '../data/site'

const active = ref(0)
</script>

<template>
  <div class="faq-list">
    <article v-for="(item, index) in faqs" :key="item.question" class="faq-item">
      <button class="faq-question" type="button" :aria-expanded="active === index" @click="active = active === index ? -1 : index">{{ item.question }}<ChevronDown :size="17" /></button>
      <Transition name="faq-panel"><div v-if="active === index" class="faq-answer">{{ item.answer }}</div></Transition>
    </article>
  </div>
</template>
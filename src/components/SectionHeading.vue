<script setup>
defineProps({ eyebrow: String, title: String, description: String, centered: Boolean })
</script>

<template>
  <div class="section-heading" :class="{ centered }">
    <span class="eyebrow">{{ eyebrow }}</span>
    <h2 class="display">{{ title }}</h2>
    <p v-if="description">{{ description }}</p>
  </div>
</template>
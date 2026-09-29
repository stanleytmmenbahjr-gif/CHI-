<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { ArrowLeft, ArrowRight, X } from '@lucide/vue'
import { photos, gallery } from '../data/site'

const categories = ['All moments', 'Workshops', 'Community Outreach', 'Training', 'Leadership Events']
const active = ref('All moments')
const lightboxIndex = ref(-1)
const lightboxDialog = ref(null)
let previousFocus
let touchStartX = 0
const filtered = computed(() => active.value === 'All moments' ? gallery : gallery.filter((item) => item.category === active.value))
const lightboxItem = computed(() => lightboxIndex.value < 0 ? null : filtered.value[lightboxIndex.value] || null)

function openLightbox(index) {
  previousFocus = document.activeElement
  lightboxIndex.value = index
  window.__chiLenis?.stop()
  nextTick(() => lightboxDialog.value?.focus())
}

function closeLightbox() {
  lightboxIndex.value = -1
  window.__chiLenis?.start()
  nextTick(() => previousFocus?.focus?.())
}

function moveLightbox(direction) {
  lightboxIndex.value = (lightboxIndex.value + direction + filtered.value.length) % filtered.value.length
}

function onGalleryKeydown(event) {
  if (lightboxIndex.value < 0) return
  if (event.key === 'Escape') closeLightbox()
  if (event.key === 'ArrowLeft') moveLightbox(-1)
  if (event.key === 'ArrowRight') moveLightbox(1)
  if (event.key === 'Tab' && lightboxDialog.value) {
    const focusable = [...lightboxDialog.value.querySelectorAll('button:not([disabled])')]
    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    if (event.shiftKey && (document.activeElement === first || document.activeElement === lightboxDialog.value)) {
      event.preventDefault()
      last?.focus()
    } else if (!event.shiftKey && (document.activeElement === last || document.activeElement === lightboxDialog.value)) {
      event.preventDefault()
      first?.focus()
    }
  }
}

function onTouchStart(event) {
  touchStartX = event.changedTouches[0].clientX
}

function onTouchEnd(event) {
  const distance = event.changedTouches[0].clientX - touchStartX
  if (Math.abs(distance) > 45) moveLightbox(distance < 0 ? 1 : -1)
}

onMounted(() => window.addEventListener('keydown', onGalleryKeydown))
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onGalleryKeydown)
  if (lightboxIndex.value >= 0) window.__chiLenis?.start()
})
</script>

<template>
  <div>
    <section class="page-hero"><img :src="gallery[0].image" alt="Count Her In team members in the community" loading="eager" fetchpriority="high" decoding="async" /><div class="container page-hero-content"><span class="eyebrow">Moments from our work</span><h1 class="display">The gallery.</h1><p>Small moments, shared work, and the people creating change across Liberia.</p><div class="breadcrumb"><RouterLink to="/">Home</RouterLink><span>/</span><span>Gallery</span></div></div></section>
    <section class="section" v-reveal><div class="container"><div class="gallery-filters" role="group" aria-label="Filter gallery"><button v-for="category in categories" :key="category" type="button" class="filter-button" :class="{ active: active === category }" :aria-pressed="active === category" @click="active = category; lightboxIndex = -1">{{ category }}</button></div><TransitionGroup name="gallery-filter" tag="div" class="gallery-page-grid"><article v-for="(item, index) in filtered" :key="item.label" class="gallery-page-item" role="button" tabindex="0" :aria-label="`Open photo: ${item.label}`" @click="openLightbox(index)" @keydown.enter.prevent="openLightbox(index)" @keydown.space.prevent="openLightbox(index)"><img :src="item.image" :alt="item.label" loading="lazy" decoding="async" /><span>{{ item.label }} · {{ item.category }}</span></article></TransitionGroup></div></section>
    <Teleport to="body">
      <Transition name="gallery-lightbox">
        <div v-if="lightboxItem" class="gallery-lightbox" @click.self="closeLightbox" @touchstart.passive="onTouchStart" @touchend.passive="onTouchEnd">
          <div ref="lightboxDialog" class="gallery-lightbox-dialog" role="dialog" aria-modal="true" :aria-label="lightboxItem.label" tabindex="-1">
            <button class="gallery-lightbox-close" type="button" aria-label="Close photo viewer" @click="closeLightbox"><X :size="21" /></button>
            <button class="gallery-lightbox-nav gallery-lightbox-previous" type="button" aria-label="Previous photo" @click="moveLightbox(-1)"><ArrowLeft :size="20" /></button>
            <figure class="gallery-lightbox-figure"><img :key="lightboxItem.image" :src="lightboxItem.image" :alt="lightboxItem.label" /><figcaption>{{ lightboxItem.label }} · {{ lightboxItem.category }}</figcaption></figure>
            <button class="gallery-lightbox-nav gallery-lightbox-next" type="button" aria-label="Next photo" @click="moveLightbox(1)"><ArrowRight :size="20" /></button>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>
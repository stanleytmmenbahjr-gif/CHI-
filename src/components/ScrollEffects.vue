<script setup>
import { Motion, useScroll } from 'motion-v'
import Lenis from 'lenis'
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { ArrowUp } from '@lucide/vue'

const { scrollYProgress } = useScroll()
const showScrollToTop = ref(false)
const prefersReducedMotion = ref(false)
let lenis
let motionPreference

function updateScrollState({ scroll }) {
  showScrollToTop.value = scroll > 480
}

function scrollToTop() {
  lenis?.scrollTo(0, { duration: 0.9 })
}

function updateMotionPreference() {
  prefersReducedMotion.value = motionPreference.matches
}

onMounted(() => {
  motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)')
  prefersReducedMotion.value = motionPreference.matches
  motionPreference.addEventListener('change', updateMotionPreference)
  lenis = new Lenis({
    autoRaf: true,
    anchors: true,
    stopInertiaOnNavigate: true,
    lerp: 0.085,
    syncTouch: false,
  })
  window.__chiLenis = lenis
  lenis.on('scroll', updateScrollState)
})

onBeforeUnmount(() => {
  lenis?.destroy()
  motionPreference?.removeEventListener('change', updateMotionPreference)
  if (window.__chiLenis === lenis) delete window.__chiLenis
})
</script>

<template>
  <Teleport to="body">
    <Motion as="div" class="scroll-progress" :style="{ scaleX: scrollYProgress }" aria-hidden="true" />
    <Motion
      v-if="showScrollToTop"
      as="button"
      class="scroll-to-top"
      type="button"
      aria-label="Scroll to top"
      title="Back to top"
      :initial="{ opacity: 0, scale: 0.86, y: 8 }"
      :animate="{ opacity: 1, scale: 1, y: 0 }"
      :whileHover="prefersReducedMotion ? undefined : { scale: 1.06 }"
      :whilePress="prefersReducedMotion ? undefined : { scale: 0.94 }"
      :transition="{ type: 'spring', stiffness: 320, damping: 25 }"
      @click="scrollToTop"
    >
      <ArrowUp :size="18" aria-hidden="true" />
    </Motion>
  </Teleport>
</template>

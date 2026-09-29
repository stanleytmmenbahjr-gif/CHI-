import { onBeforeUnmount, onMounted, ref } from 'vue'

export function useCountUp(target, duration = 1300) {
  const count = ref(0)
  const element = ref(null)
  let observer
  let frame

  onMounted(() => {
    const start = () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        count.value = target
        return
      }
      const startedAt = performance.now()
      const tick = (now) => {
        const progress = Math.min((now - startedAt) / duration, 1)
        count.value = Math.round(target * (1 - (1 - progress) ** 3))
        if (progress < 1) frame = requestAnimationFrame(tick)
      }
      frame = requestAnimationFrame(tick)
    }

    if (!('IntersectionObserver' in window)) {
      start()
      return
    }
    observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        start()
        observer.disconnect()
      }
    }, { threshold: 0.2 })
    if (element.value) observer.observe(element.value)
  })

  onBeforeUnmount(() => {
    observer?.disconnect()
    if (frame) cancelAnimationFrame(frame)
  })

  return { count, element }
}
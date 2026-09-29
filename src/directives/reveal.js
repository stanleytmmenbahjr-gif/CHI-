const reveal = {
  mounted(element) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    element.classList.add('scroll-reveal')
    const sectionDirection = element.dataset.revealDirection
    if (['left', 'right', 'scale'].includes(sectionDirection)) {
      element.classList.add(`reveal-section-${sectionDirection}`)
    }
    element.querySelectorAll('.focus-card, .program-card, .team-card, .interior-card, .gallery-tile, .gallery-page-item, .impact-item').forEach((item, index) => {
      item.classList.add('reveal-item')
      const direction = ['up', 'left', 'right', 'scale'][index % 4]
      item.classList.add(`reveal-item-${direction}`)
      item.style.setProperty('--reveal-delay', `${Math.min(index, 5) * 75}ms`)
    })

    const revealWhenVisible = () => {
      const rect = element.getBoundingClientRect()
      if (rect.top < window.innerHeight * 0.9 && rect.bottom > 0) {
        element.classList.add('is-visible')
        element.__revealObserver?.disconnect()
        window.removeEventListener('scroll', revealWhenVisible)
        window.removeEventListener('resize', revealWhenVisible)
      }
    }

    if ('IntersectionObserver' in window) {
      element.__revealObserver = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) revealWhenVisible()
      }, { threshold: 0.01 })
      element.__revealObserver.observe(element)
    }

    element.__revealOnScroll = revealWhenVisible
    window.addEventListener('scroll', revealWhenVisible, { passive: true })
    window.addEventListener('resize', revealWhenVisible, { passive: true })
    revealWhenVisible()
  },
  unmounted(element) {
    element.__revealObserver?.disconnect()
    if (element.__revealOnScroll) {
      window.removeEventListener('scroll', element.__revealOnScroll)
      window.removeEventListener('resize', element.__revealOnScroll)
    }
  },
}

export default reveal
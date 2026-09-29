import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../pages/HomePage.vue'
import ContentPage from '../pages/ContentPage.vue'
import ProgramDetailPage from '../pages/ProgramDetailPage.vue'
import TeamPage from '../pages/TeamPage.vue'
import GalleryPage from '../pages/GalleryPage.vue'
import ContactPage from '../pages/ContactPage.vue'
import VolunteerPage from '../pages/VolunteerPage.vue'
import DonatePage from '../pages/DonatePage.vue'

const routes = [
  { path: '/', component: HomePage, meta: { title: 'Every Girl Counts', description: 'Count Her In Liberia empowers adolescent girls and young women through advocacy, leadership development, education, and community engagement.' } },
  { path: '/about', component: ContentPage, props: { pageKey: 'about' }, meta: { title: 'About Us' } },
  { path: '/programs', component: ContentPage, props: { pageKey: 'programs' }, meta: { title: 'Programs' } },
  { path: '/programs/:slug', component: ProgramDetailPage, meta: { title: 'Program Details' } },
  { path: '/impact', component: ContentPage, props: { pageKey: 'impact' }, meta: { title: 'Our Impact' } },
  { path: '/team', component: TeamPage, meta: { title: 'Our Team' } },
  { path: '/gallery', component: GalleryPage, meta: { title: 'Gallery' } },
  { path: '/news', component: ContentPage, props: { pageKey: 'news' }, meta: { title: 'News & Updates' } },
  { path: '/events', component: ContentPage, props: { pageKey: 'events' }, meta: { title: 'Events' } },
  { path: '/contact', component: ContactPage, meta: { title: 'Contact' } },
  { path: '/volunteer', component: VolunteerPage, meta: { title: 'Volunteer' } },
  { path: '/donate', component: DonatePage, meta: { title: 'Donate' } },
  { path: '/:pathMatch(.*)*', redirect: '/' },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, _from, savedPosition) {
    const lenis = window.__chiLenis
    if (lenis) {
      if (savedPosition) lenis.scrollTo(savedPosition.top, { immediate: true })
      else if (to.hash) lenis.scrollTo(to.hash, { offset: -96, duration: 1.05 })
      else lenis.scrollTo(0, { immediate: true })
      return false
    }
    if (savedPosition) return savedPosition
    if (to.hash) return { el: to.hash, behavior: 'smooth' }
    return { top: 0, behavior: 'smooth' }
  },
})
let hasCompletedInitialNavigation = false
let routeFadeTimer

router.beforeEach(async (to, from) => {
  if (!hasCompletedInitialNavigation || to.fullPath === from.fullPath) return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  const main = document.querySelector('#main-content')
  if (!main) return

  main.classList.remove('route-fade-in')
  main.classList.add('route-fade-out')
  await new Promise((resolve) => {
    routeFadeTimer = window.setTimeout(resolve, 180)
  })
})

router.afterEach((to, _from, failure) => {
  window.clearTimeout(routeFadeTimer)
  const main = document.querySelector('#main-content')
  main?.classList.remove('route-fade-out')

  if (failure) return
  document.title = `${to.meta.title || 'Count Her In Liberia'} | Count Her In Liberia`
  const description = document.querySelector('meta[name="description"]')
  if (description && to.meta.description) description.setAttribute('content', to.meta.description)

  if (!hasCompletedInitialNavigation) {
    hasCompletedInitialNavigation = true
    return
  }

  if (!main || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  main.classList.remove('route-fade-in')
  requestAnimationFrame(() => {
    main.classList.add('route-fade-in')
    window.setTimeout(() => main.classList.remove('route-fade-in'), 260)
  })
})

export default router
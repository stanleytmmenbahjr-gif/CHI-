<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { ChevronDown, Heart, Menu, Moon, X, Sparkles, Sun } from '@lucide/vue'
import { photos } from '../data/site'

const route = useRoute()
const menuOpen = ref(false)
const openGroup = ref('')
const darkMode = ref(false)
const scrolled = ref(false)
const nav = [
  { label: 'Home', to: '/' },
  { label: 'About Us', to: '/about', children: [['Our Story', '/about'], ['Mission & Vision', '/about#mission'], ['Our Team', '/team'], ['Strategic Plan', '/impact'], ['Partners', '/impact#partners']] },
  { label: 'Programs', to: '/programs', children: [['Girls Rights Advocacy', '/programs/her-voice-matters'], ['Her Voice Matters', '/programs/her-voice-matters'], ['My Health My Rights', '/programs/my-health-my-rights'], ['Climate Leadership', '/programs/climate-leadership'], ['Leadership Development', '/programs/mentorship-program']] },
  { label: 'Impact', to: '/impact' },
  { label: 'Media', to: '/gallery', children: [['Gallery', '/gallery'], ['News & Updates', '/news'], ['Events', '/events']] },
  { label: 'Get Involved', to: '/volunteer', children: [['Volunteer', '/volunteer'], ['Partner With Us', '/contact'], ['Donate', '/donate'], ['Become A Peer Educator', '/volunteer']] },
  { label: 'Contact', to: '/contact' },
]

function toggleGroup(label) {
  openGroup.value = openGroup.value === label ? '' : label
}

function closeMenu() {
  menuOpen.value = false
  openGroup.value = ''
}

function updateScrollState() {
  scrolled.value = window.scrollY > 8
}

function toggleTheme() {
  darkMode.value = !darkMode.value
  document.documentElement.classList.toggle('dark', darkMode.value)
  localStorage.setItem('chi-theme', darkMode.value ? 'dark' : 'light')
}

onMounted(() => {
  darkMode.value = localStorage.getItem('chi-theme') === 'dark'
  document.documentElement.classList.toggle('dark', darkMode.value)
  updateScrollState()
  window.addEventListener('scroll', updateScrollState, { passive: true })
})

onBeforeUnmount(() => window.removeEventListener('scroll', updateScrollState))
</script>

<template>
  <div class="announcement"><span><Sparkles :size="13" /> Empowering girls and amplifying voices across Liberia.</span></div>
  <header class="header" :class="{ 'is-scrolled': scrolled }">
    <div class="container nav-wrap">
      <RouterLink class="brand" to="/" aria-label="Count Her In Liberia home" @click="closeMenu">
        <img class="brand-logo" :src="photos.logo" alt="Count Her In" decoding="async" fetchpriority="high" />
      </RouterLink>
      <nav id="primary-navigation" class="desktop-nav" :class="{ 'is-open': menuOpen }" aria-label="Main navigation">
        <div v-for="item in nav" :key="item.label" class="nav-item" :class="{ open: openGroup === item.label }">
          <div class="nav-link-row">
            <RouterLink class="nav-link" :to="item.to" :aria-current="route.path === item.to || (item.to !== '/' && route.path.startsWith(item.to)) ? 'page' : undefined" @click="closeMenu">{{ item.label }}</RouterLink>
            <button v-if="item.children" class="submenu-toggle" type="button" :aria-label="`${openGroup === item.label ? 'Close' : 'Open'} ${item.label} submenu`" :aria-expanded="openGroup === item.label" @click="toggleGroup(item.label)"><ChevronDown :size="14" /></button>
          </div>
          <div v-if="item.children" class="dropdown" :class="{ 'is-open': openGroup === item.label }">
            <RouterLink v-for="[label, to] in item.children" :key="label" :to="to" @click="closeMenu">{{ label }}<span aria-hidden="true">↗</span></RouterLink>
          </div>
        </div>
      </nav>
      <div class="nav-actions">
        <button class="theme-toggle" type="button" :aria-label="darkMode ? 'Switch to light mode' : 'Switch to dark mode'" :aria-pressed="darkMode" @click="toggleTheme"><Sun v-if="darkMode" :size="17" /><Moon v-else :size="17" /></button>
        <RouterLink class="button button-primary" to="/donate"><Heart :size="14" /> Donate</RouterLink>
        <button class="menu-toggle" type="button" :aria-label="menuOpen ? 'Close menu' : 'Open menu'" :aria-expanded="menuOpen" aria-controls="primary-navigation" @click="menuOpen = !menuOpen"><X v-if="menuOpen" :size="19" /><Menu v-else :size="19" /></button>
      </div>
    </div>
  </header>
</template>
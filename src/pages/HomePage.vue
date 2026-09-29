<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { ArrowLeft, ArrowRight, ArrowUpRight, BookOpenCheck, CirclePause, CirclePlay, Heart, Leaf, MessageCircleHeart, Quote, ShieldCheck, UsersRound } from '@lucide/vue'
import SectionHeading from '../components/SectionHeading.vue'
import ProgramCard from '../components/ProgramCard.vue'
import TeamCard from '../components/TeamCard.vue'
import FaqList from '../components/FaqList.vue'
import ImpactNumber from '../components/ImpactNumber.vue'
import { faqs, gallery as galleryItems, photos, programs, team, testimonials } from '../data/site'

const testimonialIndex = ref(0)
const testimonialTouchStart = ref(0)
const testimonialHovered = ref(false)
const testimonial = computed(() => testimonials[testimonialIndex.value])
const heroSlides = [
  { image: photos.hero, alt: 'A Count Her In educator speaking with community members' },
  { image: photos.voice, alt: 'Girls taking part in a Her Voice Matters activity' },
  { image: photos.about, alt: 'A community learning session in Liberia' },
]
const heroSlideIndex = ref(0)
const heroPaused = ref(false)
const prefersReducedMotion = ref(false)
let heroTimer
let testimonialTimer
let motionPreference

function scheduleHeroRotation() {
  window.clearInterval(heroTimer)
  if (heroPaused.value || prefersReducedMotion.value) return
  heroTimer = window.setInterval(() => {
    heroSlideIndex.value = (heroSlideIndex.value + 1) % heroSlides.length
  }, 5000)
}

function selectHeroSlide(index) {
  heroSlideIndex.value = index
  scheduleHeroRotation()
}

function stepHeroSlide(direction) {
  selectHeroSlide((heroSlideIndex.value + direction + heroSlides.length) % heroSlides.length)
}

function scheduleTestimonialRotation() {
  window.clearInterval(testimonialTimer)
  if (prefersReducedMotion.value || testimonialHovered.value) return
  testimonialTimer = window.setInterval(() => {
    if (!document.hidden) testimonialIndex.value = (testimonialIndex.value + 1) % testimonials.length
  }, 7500)
}

function stepTestimonial(direction) {
  testimonialIndex.value = (testimonialIndex.value + direction + testimonials.length) % testimonials.length
  scheduleTestimonialRotation()
}

function startTestimonialTouch(event) {
  testimonialTouchStart.value = event.changedTouches[0].clientX
}

function endTestimonialTouch(event) {
  const distance = event.changedTouches[0].clientX - testimonialTouchStart.value
  if (Math.abs(distance) > 45) stepTestimonial(distance < 0 ? 1 : -1)
}

function toggleHeroRotation() {
  heroPaused.value = !heroPaused.value
  scheduleHeroRotation()
}

function updateMotionPreference() {
  prefersReducedMotion.value = motionPreference.matches
  scheduleHeroRotation()
  scheduleTestimonialRotation()
}

onMounted(() => {
  motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)')
  prefersReducedMotion.value = motionPreference.matches
  motionPreference.addEventListener('change', updateMotionPreference)
  scheduleHeroRotation()
  scheduleTestimonialRotation()
})

onBeforeUnmount(() => {
  window.clearInterval(heroTimer)
  window.clearInterval(testimonialTimer)
  motionPreference?.removeEventListener('change', updateMotionPreference)
})

const focusAreas = [
  { title: 'Girls’ Rights', description: 'Advocating for dignity, safety, and equal opportunity for every girl.', icon: ShieldCheck },
  { title: 'Health & Rights', description: 'Sharing trusted information so girls can make informed choices.', icon: Heart },
  { title: 'Climate Action', description: 'Backing young women to lead climate resilience in their communities.', icon: Leaf },
  { title: 'Leadership Development', description: 'Growing confidence, skills, and space for girls to lead.', icon: UsersRound },
]
const gallery = galleryItems.slice(0, 4)
const partners = ['UN WOMEN', 'Plan International', 'Ministry of Gender', 'Youth for Change', 'Girls First', 'Community Partners']
const visibleFaqs = faqs.slice(0, 4)
</script>

<template>
  <section class="hero" aria-roledescription="carousel" aria-label="Count Her In community stories">
    <img v-for="(slide, index) in heroSlides" :key="slide.image" class="hero-image" :class="{ active: heroSlideIndex === index }" :src="slide.image" :alt="slide.alt" :aria-hidden="heroSlideIndex !== index" loading="eager" :fetchpriority="heroSlideIndex === index ? 'high' : 'low'" decoding="async" />
    <div class="container hero-content fade-up">
      <span class="eyebrow">{{ ['Girls lead. Communities grow.', 'Her voice matters.', 'Learning creates possibility.'][heroSlideIndex] }}</span>
      <h1 class="display">Every Girl Counts.<br />Every Voice Matters.</h1>
      <p class="hero-copy">Count Her In Liberia empowers adolescent girls through advocacy, leadership development, education, and community engagement.</p>
      <div class="hero-buttons"><RouterLink class="button button-light" to="/about">Learn more <ArrowUpRight :size="15" /></RouterLink><RouterLink class="button button-primary" to="/donate">Support our work <Heart :size="14" /></RouterLink></div>
    </div>
    <div class="container hero-carousel-controls" role="group" aria-label="Hero image controls">
      <button class="hero-control" type="button" aria-label="Previous hero image" @click="stepHeroSlide(-1)"><ArrowLeft :size="15" /></button>
      <div class="hero-slide-dots" role="group" aria-label="Choose hero image">
        <button v-for="(slide, index) in heroSlides" :key="slide.image" class="hero-slide-dot" :class="{ active: heroSlideIndex === index }" type="button" :aria-label="`Show hero image ${index + 1}`" :aria-pressed="heroSlideIndex === index" @click="selectHeroSlide(index)"></button>
      </div>
      <button class="hero-control" type="button" aria-label="Next hero image" @click="stepHeroSlide(1)"><ArrowRight :size="15" /></button>
      <button v-if="!prefersReducedMotion" class="hero-control hero-playback" type="button" :aria-label="heroPaused ? 'Resume hero rotation' : 'Pause hero rotation'" :aria-pressed="heroPaused" @click="toggleHeroRotation"><CirclePlay v-if="heroPaused" :size="17" /><CirclePause v-else :size="17" /></button>
    </div>
    <div class="hero-stats"><div class="container hero-stats-inner"><div class="hero-stat"><ImpactNumber :value="5000" suffix="+" /><span>Girls reached</span></div><div class="hero-stat"><ImpactNumber :value="150" suffix="+" /><span>Peer educators</span></div><div class="hero-stat"><ImpactNumber :value="20" suffix="+" /><span>Communities</span></div><div class="hero-stat"><ImpactNumber :value="15" suffix="+" /><span>Projects</span></div></div></div>
  </section>

  <section class="impact-strip" aria-label="Our impact at a glance" v-reveal><div class="container impact-grid"><div class="impact-item"><span class="impact-icon"><UsersRound :size="19" /></span><div><ImpactNumber :value="5000" suffix="+" /><span>girls reached with opportunity</span></div></div><div class="impact-item"><span class="impact-icon"><MessageCircleHeart :size="19" /></span><div><ImpactNumber :value="150" suffix="+" /><span>peer educators lifting voices</span></div></div><div class="impact-item"><span class="impact-icon"><BookOpenCheck :size="19" /></span><div><ImpactNumber :value="20" suffix="+" /><span>communities working together</span></div></div><div class="impact-item"><span class="impact-icon"><Heart :size="18" /></span><div><ImpactNumber :value="15" suffix="+" /><span>projects shaped with girls</span></div></div></div></section>

  <section class="section" v-reveal data-reveal-direction="left"><div class="container about-grid"><div class="about-copy"><span class="eyebrow">Who we are</span><h2 class="display">A movement that starts by listening.</h2><p>We are a Liberian organization working with adolescent girls and young women to claim their rights, find their voice, and shape the future of their communities.</p><p>With local partners and youth leaders, we create space for girls to learn, lead, and be part of the decisions that affect their lives.</p><RouterLink class="button button-outline" to="/about">Read our story <ArrowUpRight :size="15" /></RouterLink></div><div class="about-collage"><div class="collage-main"><img class="photo" :src="photos.about" alt="A young woman participating in a learning program" loading="lazy" decoding="async" /></div><div class="collage-small"><img class="photo" :src="photos.aboutSmall" alt="Young women connecting in a group" loading="lazy" decoding="async" /></div><div class="collage-note">Her future.<br />Her voice.<br />Her choice.</div></div></div></section>

  <section class="section focus-section" v-reveal data-reveal-direction="right"><div class="container"><SectionHeading eyebrow="Where we focus" title="A more equal future, built together." description="We work across the issues that shape girls’ choices and opportunities, connecting individual confidence with community-wide change." /><div class="focus-grid"><article v-for="area in focusAreas" :key="area.title" class="focus-card"><span class="focus-icon"><component :is="area.icon" :size="21" /></span><h3>{{ area.title }}</h3><p>{{ area.description }}</p></article></div></div></section>

  <section class="section" v-reveal><div class="container"><SectionHeading eyebrow="Our programs" title="Ideas growing into action." description="From the first conversation to community leadership, our programs help girls build the skills and support to move forward." /><div class="program-grid"><ProgramCard v-for="program in programs" :key="program.slug" :program="program" /></div><div class="section-action"><RouterLink class="button button-outline" to="/programs">Explore all programs <ArrowRight :size="15" /></RouterLink></div></div></section>

  <section class="section team-section" v-reveal><div class="container"><SectionHeading eyebrow="People behind the work" title="Meet the team." description="The passionate individuals working to empower girls and create lasting change across Liberia." /><div class="team-grid"><TeamCard v-for="member in team" :key="member.name" :member="member" /></div><div class="section-action"><RouterLink class="button button-outline" to="/team">View full team <ArrowRight :size="15" /></RouterLink></div></div></section>

  <section class="section" v-reveal><div class="container story-feature"><div class="story-image"><img class="photo" :src="photos.story" alt="A girl taking part in a community learning activity" loading="lazy" decoding="async" /></div><div class="story-copy"><span class="eyebrow">A story of change</span><h2 class="display">“Now I know my voice can open doors.”</h2><p>Through peer education, young women are sharing knowledge and growing into trusted leaders in their communities.</p><div class="story-quote">“When one girl steps forward, she makes room for others to follow.”</div><RouterLink class="text-link" to="/impact">Read her story <ArrowRight :size="15" /></RouterLink></div></div></section>

  <section class="section testimonial-section" v-reveal><div class="container testimonial-shell" role="region" aria-roledescription="carousel" aria-label="Girls’ testimonials" tabindex="0" @touchstart.passive="startTestimonialTouch" @touchend.passive="endTestimonialTouch" @keydown.left.prevent="stepTestimonial(-1)" @keydown.right.prevent="stepTestimonial(1)" @mouseenter="testimonialHovered = true; scheduleTestimonialRotation()" @mouseleave="testimonialHovered = false; scheduleTestimonialRotation()"><span class="eyebrow">Girls’ voices</span><div class="quote-mark"><Quote :size="21" fill="currentColor" /></div><blockquote :key="testimonialIndex" class="testimonial-text">“{{ testimonial.quote }}”</blockquote><div class="testimonial-person">{{ testimonial.name }}<span>{{ testimonial.role }}</span></div><div class="slider-controls"><button type="button" aria-label="Previous testimonial" @click="stepTestimonial(-1)"><ArrowLeft :size="16" /></button><button type="button" aria-label="Next testimonial" @click="stepTestimonial(1)"><ArrowRight :size="16" /></button></div></div></section>

  <section class="section" v-reveal><div class="container"><SectionHeading eyebrow="Moments from the field" title="Learning, leading, together." description="A glimpse into the conversations, connections, and shared work happening across our community." /><div class="gallery-grid"><RouterLink v-for="item in gallery" :key="item.label" class="gallery-tile" to="/gallery"><img class="photo" :src="item.image" :alt="item.label" loading="lazy" decoding="async" /><span class="gallery-label">{{ item.label }}</span></RouterLink></div><div class="section-action"><RouterLink class="text-link" to="/gallery">Visit the gallery <ArrowRight :size="15" /></RouterLink></div></div></section>

  <section id="partners" class="partners-section"><p class="partners-title">In good company, working toward a shared future</p><div class="partners-track" aria-label="Our partners"><span v-for="(partner, i) in [...partners, ...partners]" :key="`${partner}-${i}`" class="partner-wordmark">{{ partner }}</span></div></section>

  <section id="faq" class="section" v-reveal><div class="container"><SectionHeading centered eyebrow="Questions & answers" title="Good to know." description="A few things people often ask about our work." /><FaqList /></div></section>

  <section class="cta-band"><div class="container cta-inner"><div><h2 class="display">Join us in building a future where every girl counts.</h2><p>Stand with girls as they make their voices heard and futures their own.</p></div><div class="cta-actions"><RouterLink class="button button-light" to="/volunteer">Become a volunteer <ArrowUpRight :size="15" /></RouterLink><RouterLink class="button button-primary" to="/donate">Donate today <Heart :size="14" /></RouterLink></div></div></section>
</template>
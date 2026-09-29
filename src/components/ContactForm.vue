<script setup>
import { ref } from 'vue'
import { Send } from '@lucide/vue'
import { submitContactMessage } from '../services/contactService'

const categories = [
  'General Inquiry',
  'Partnership Request',
  'Volunteer Application',
  'Media Inquiry',
  'Program Information',
  'Donation Support',
  'Safeguarding Concern',
]

const formElement = ref(null)
const pending = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

async function submit() {
  successMessage.value = ''
  errorMessage.value = ''
  if (!formElement.value?.reportValidity()) return

  const payload = Object.fromEntries(new FormData(formElement.value).entries())
  pending.value = true

  try {
    const result = await submitContactMessage(payload)
    successMessage.value = result.message
    formElement.value.reset()
  } catch (error) {
    errorMessage.value = error.message || 'Your message could not be sent. Please try again.'
  } finally {
    pending.value = false
  }
}
</script>

<template>
  <form ref="formElement" class="form-panel contact-form" novalidate :aria-busy="pending" @submit.prevent="submit">
    <div class="form-grid">
      <div class="field">
        <label for="contact-full-name">Full name <span aria-hidden="true">*</span></label>
        <input id="contact-full-name" name="fullName" type="text" autocomplete="name" minlength="2" maxlength="120" required />
      </div>
      <div class="field">
        <label for="contact-email">Email address <span aria-hidden="true">*</span></label>
        <input id="contact-email" name="email" type="email" autocomplete="email" maxlength="254" required />
      </div>
      <div class="field">
        <label for="contact-phone">Phone number <span class="optional-label">Optional</span></label>
        <input id="contact-phone" name="phone" type="tel" autocomplete="tel" maxlength="40" />
      </div>
      <div class="field">
        <label for="contact-organization">Organization <span class="optional-label">Optional</span></label>
        <input id="contact-organization" name="organization" type="text" autocomplete="organization" maxlength="160" />
      </div>
      <div class="field field-full">
        <label for="contact-category">Category <span aria-hidden="true">*</span></label>
        <select id="contact-category" name="category" required>
          <option value="" disabled selected>Select a category</option>
          <option v-for="category in categories" :key="category" :value="category">{{ category }}</option>
        </select>
      </div>
      <div class="field field-full">
        <label for="contact-subject">Subject <span aria-hidden="true">*</span></label>
        <input id="contact-subject" name="subject" type="text" minlength="2" maxlength="160" required />
      </div>
      <div class="field field-full">
        <label for="contact-message">Message <span aria-hidden="true">*</span></label>
        <textarea id="contact-message" name="message" rows="6" minlength="1" maxlength="5000" required></textarea>
      </div>
      <div class="contact-trap" aria-hidden="true" inert><input name="website" type="text" tabindex="-1" autocomplete="off" /></div>
    </div>

    <Transition name="contact-feedback" mode="out-in">
      <p v-if="successMessage" key="success" class="contact-feedback contact-feedback-success" role="status" tabindex="-1">{{ successMessage }}</p>
      <p v-else-if="errorMessage" key="error" class="contact-feedback contact-feedback-error" role="alert">{{ errorMessage }}</p>
    </Transition>

    <button class="button button-primary contact-submit" type="submit" :disabled="pending">
      <span v-if="pending" class="contact-spinner" aria-hidden="true"></span>
      <Send v-else :size="14" aria-hidden="true" />
      {{ pending ? 'Sending message...' : 'Send your message' }}
    </button>
    <p class="contact-required-note">Fields marked <span aria-hidden="true">*</span> are required.</p>
  </form>
</template>
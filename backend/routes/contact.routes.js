import { Router } from 'express'
import { createContact } from '../controllers/contact.controller.js'

export default function contactRoutes(contactRateLimiter) {
	const router = Router()
	router.post('/', contactRateLimiter, createContact)
	return router
}

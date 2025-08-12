import { z } from 'zod'
import { form } from '$app/server'
import { createValidated } from '$lib/index.js'

// Create the validated function using your app's form function
const validated = createValidated(form)

const createPostSchema = z.object({
	title: z.string().min(3, 'Title must be at least 3 characters'),
	content: z.string().min(10, 'Content must be at least 10 characters'),
	category: z.enum(['tech', 'lifestyle', 'food'], {
		message: 'Please select a valid category'
	})
})

export const createPost = validated(createPostSchema, async (data) => {
	console.log('Valid data received:', data)

	// Simulate saving to database
	await new Promise((resolve) => setTimeout(resolve, 500))

	// For demo, just return success
	return {
		success: true,
		post: {
			id: Math.random().toString(36).substring(7),
			...data,
			createdAt: new Date().toISOString()
		}
	}
})

const contactSchema = z.object({
	name: z.string().min(2, 'Name is too short'),
	email: z.email('Invalid email address'),
	message: z.string().min(20, 'Message must be at least 20 characters')
})

export const submitContact = validated(contactSchema, async (data) => {
	console.log('Contact form submitted:', data)

	// Simulate API call
	await new Promise((resolve) => setTimeout(resolve, 300))

	return {
		success: true,
		message: 'Thank you for your message!'
	}
})

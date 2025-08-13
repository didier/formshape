import * as v from 'valibot'
import { error, redirect } from '@sveltejs/kit'
import { form } from '$app/server'
import { createValidated } from 'formshape'

// Create validated function using our local formshape package
const validated = createValidated(form)

// Mock database and auth for testing
const mockDatabase = {
	posts: new Map<string, { slug: string; title: string; content: string; createdAt: Date }>(),

	async insertPost(slug: string, title: string, content: string) {
		const post = { slug, title, content, createdAt: new Date() }
		this.posts.set(slug, post)
		return post
	},

	async getPosts() {
		return Array.from(this.posts.values())
	}
}

const mockAuth = {
	async getUser() {
		// For testing, always return a user
		return { id: 1, name: 'Test User' }
	}
}

// Schema for blog post creation
const createPostSchema = v.object({
	title: v.pipe(v.string(), v.minLength(3, 'Title must be at least 3 characters')),
	content: v.pipe(v.string(), v.minLength(10, 'Content must be at least 10 characters'))
})

// Basic form example - returns data
export const createPost = validated(createPostSchema, async (data) => {
	// Check the user is logged in
	const user = await mockAuth.getUser()
	if (!user) error(401, 'Unauthorized')

	const { title, content } = data
	const slug = title.toLowerCase().replace(/ /g, '-')

	// Insert into the database
	const post = await mockDatabase.insertPost(slug, title, content)

	return {
		success: true,
		post,
		message: `Post "${title}" created successfully!`
	}
})

// Form example with redirect
export const createPostWithRedirect = validated(createPostSchema, async (data) => {
	const user = await mockAuth.getUser()
	if (!user) error(401, 'Unauthorized')

	const { title, content } = data
	const slug = title.toLowerCase().replace(/ /g, '-')

	await mockDatabase.insertPost(slug, title, content)

	// Redirect to the newly created page
	redirect(303, `/blog/${slug}`)
})

// Login/Register form schemas for buttonProps testing
const loginSchema = v.object({
	username: v.pipe(v.string(), v.minLength(2, 'Username too short')),
	password: v.pipe(v.string(), v.minLength(6, 'Password must be at least 6 characters'))
})

const registerSchema = v.object({
	username: v.pipe(v.string(), v.minLength(2, 'Username too short')),
	password: v.pipe(v.string(), v.minLength(6, 'Password must be at least 6 characters')),
	email: v.pipe(v.string(), v.email('Invalid email address'))
})

export const login = validated(loginSchema, async (data) => {
	// Mock login logic
	await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate API call

	return {
		success: true,
		user: { id: 1, username: data.username },
		message: 'Logged in successfully!'
	}
})

export const register = validated(registerSchema, async (data) => {
	// Mock register logic
	await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate API call

	return {
		success: true,
		user: { id: 2, username: data.username, email: data.email },
		message: 'Account created successfully!'
	}
})

// Contact form for additional testing
const contactSchema = v.object({
	name: v.pipe(v.string(), v.minLength(2, 'Name must be at least 2 characters')),
	email: v.pipe(v.string(), v.email('Invalid email address')),
	message: v.pipe(v.string(), v.minLength(20, 'Message must be at least 20 characters'))
})

export const submitContact = validated(contactSchema, async (data) => {
	// Simulate sending email
	await new Promise((resolve) => setTimeout(resolve, 300))

	return {
		success: true,
		message: "Thank you for your message! We'll get back to you soon."
	}
})

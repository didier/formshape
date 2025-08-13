import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createValidated } from 'formshape'
import * as v from 'valibot'

// Test the exact scenarios from our test-app
describe('test-app scenarios', () => {
	const mockForm = vi.fn().mockImplementation((handler) => ({
		method: 'POST' as const,
		action: '/test',
		onsubmit: vi.fn(),
		result: undefined,
		pending: 0,
		enhance: vi.fn().mockReturnValue({ method: 'POST', action: '/test', onsubmit: vi.fn() }),
		buttonProps: {
			type: 'submit' as const,
			formmethod: 'POST' as const,
			formaction: '/test',
			onclick: vi.fn(),
			enhance: vi.fn()
		},
		for: vi.fn(),
		_handler: handler // Store for testing
	}))

	beforeEach(() => {
		mockForm.mockClear()
	})

	describe('blog post creation (from test-app/src/routes/blog/data.remote.ts)', () => {
		const createPostSchema = v.object({
			title: v.pipe(v.string(), v.minLength(3, 'Title must be at least 3 characters')),
			content: v.pipe(v.string(), v.minLength(10, 'Content must be at least 10 characters'))
		})

		it('should create post successfully with valid data', async () => {
			const validated = createValidated(mockForm)

			const createPost = validated(createPostSchema, async (data) => {
				const slug = data.title.toLowerCase().replace(/ /g, '-')
				return {
					success: true,
					post: {
						id: 'test-id',
						slug,
						...data,
						createdAt: new Date().toISOString()
					},
					message: `Post "${data.title}" created successfully!`
				}
			})

			const handler = mockForm.mock.results[0].value._handler

			const formData = new FormData()
			formData.append('title', 'My Great Blog Post')
			formData.append('content', 'This is the content of my blog post with enough characters.')

			const result = await handler(formData)

			expect(result).toMatchObject({
				success: true,
				post: {
					id: 'test-id',
					slug: 'my-great-blog-post',
					title: 'My Great Blog Post',
					content: 'This is the content of my blog post with enough characters.'
				},
				message: 'Post "My Great Blog Post" created successfully!'
			})
		})

		it('should return validation errors for invalid data', async () => {
			const validated = createValidated(mockForm)

			const createPost = validated(createPostSchema, vi.fn())
			const handler = mockForm.mock.results[0].value._handler

			const formData = new FormData()
			formData.append('title', 'Hi') // Too short
			formData.append('content', 'Short') // Too short

			const result = await handler(formData)

			expect(result).toMatchObject({
				success: false,
				errors: {
					title: ['Title must be at least 3 characters'],
					content: ['Content must be at least 10 characters']
				},
				data: {
					title: 'Hi',
					content: 'Short'
				}
			})
		})
	})

	describe('login/register forms (buttonProps test)', () => {
		const loginSchema = v.object({
			username: v.pipe(v.string(), v.minLength(2, 'Username too short')),
			password: v.pipe(v.string(), v.minLength(6, 'Password must be at least 6 characters'))
		})

		const registerSchema = v.object({
			username: v.pipe(v.string(), v.minLength(2, 'Username too short')),
			password: v.pipe(v.string(), v.minLength(6, 'Password must be at least 6 characters')),
			email: v.pipe(v.string(), v.email('Invalid email address'))
		})

		it('should handle login successfully', async () => {
			const validated = createValidated(mockForm)

			const login = validated(loginSchema, async (data) => {
				return {
					success: true,
					user: { id: 1, username: data.username },
					message: 'Logged in successfully!'
				}
			})

			const handler = mockForm.mock.results[0].value._handler

			const formData = new FormData()
			formData.append('username', 'testuser')
			formData.append('password', 'password123')

			const result = await handler(formData)

			expect(result).toMatchObject({
				success: true,
				user: { id: 1, username: 'testuser' },
				message: 'Logged in successfully!'
			})
		})

		it('should handle registration successfully', async () => {
			const validated = createValidated(mockForm)

			const register = validated(registerSchema, async (data) => {
				return {
					success: true,
					user: { id: 2, username: data.username, email: data.email },
					message: 'Account created successfully!'
				}
			})

			const handler = mockForm.mock.results[0].value._handler

			const formData = new FormData()
			formData.append('username', 'newuser')
			formData.append('password', 'newpassword123')
			formData.append('email', 'newuser@example.com')

			const result = await handler(formData)

			expect(result).toMatchObject({
				success: true,
				user: {
					id: 2,
					username: 'newuser',
					email: 'newuser@example.com'
				},
				message: 'Account created successfully!'
			})
		})

		it('should validate login fields correctly', async () => {
			const validated = createValidated(mockForm)

			const login = validated(loginSchema, vi.fn())
			const handler = mockForm.mock.results[0].value._handler

			const formData = new FormData()
			formData.append('username', 'u') // Too short
			formData.append('password', '123') // Too short

			const result = await handler(formData)

			expect(result.success).toBe(false)
			expect(result.errors).toMatchObject({
				username: ['Username too short'],
				password: ['Password must be at least 6 characters']
			})
		})

		it('should validate register fields including email', async () => {
			const validated = createValidated(mockForm)

			const register = validated(registerSchema, vi.fn())
			const handler = mockForm.mock.results[0].value._handler

			const formData = new FormData()
			formData.append('username', 'validuser')
			formData.append('password', 'validpass123')
			formData.append('email', 'invalid-email') // Invalid email

			const result = await handler(formData)

			expect(result.success).toBe(false)
			expect(result.errors).toMatchObject({
				email: ['Invalid email address']
			})
		})
	})

	describe('contact form (enhance test)', () => {
		const contactSchema = v.object({
			name: v.pipe(v.string(), v.minLength(2, 'Name must be at least 2 characters')),
			email: v.pipe(v.string(), v.email('Invalid email address')),
			message: v.pipe(v.string(), v.minLength(20, 'Message must be at least 20 characters'))
		})

		it('should handle contact form submission', async () => {
			const validated = createValidated(mockForm)

			const submitContact = validated(contactSchema, async (data) => {
				// Simulate API delay
				await new Promise((resolve) => setTimeout(resolve, 10))

				return {
					success: true,
					message: "Thank you for your message! We'll get back to you soon."
				}
			})

			const handler = mockForm.mock.results[0].value._handler

			const formData = new FormData()
			formData.append('name', 'John Doe')
			formData.append('email', 'john@example.com')
			formData.append(
				'message',
				'This is a test message with enough characters to pass validation.'
			)

			const result = await handler(formData)

			expect(result).toMatchObject({
				success: true,
				message: "Thank you for your message! We'll get back to you soon."
			})
		})

		it('should validate all contact form fields', async () => {
			const validated = createValidated(mockForm)

			const submitContact = validated(contactSchema, vi.fn())
			const handler = mockForm.mock.results[0].value._handler

			const formData = new FormData()
			formData.append('name', 'J') // Too short
			formData.append('email', 'bad-email') // Invalid
			formData.append('message', 'Short msg') // Too short

			const result = await handler(formData)

			expect(result.success).toBe(false)
			expect(result.errors).toMatchObject({
				name: ['Name must be at least 2 characters'],
				email: ['Invalid email address'],
				message: ['Message must be at least 20 characters']
			})
		})
	})

	describe('form object structure', () => {
		it('should return properly structured form objects', () => {
			const validated = createValidated(mockForm)
			const schema = v.object({ test: v.string() })
			const handler = vi.fn()

			const formObject = validated(schema, handler)

			// Verify it has all the SvelteKit RemoteForm properties
			expect(formObject).toHaveProperty('method', 'POST')
			expect(formObject).toHaveProperty('action')
			expect(formObject).toHaveProperty('onsubmit')
			expect(formObject).toHaveProperty('result')
			expect(formObject).toHaveProperty('pending', 0)
			expect(formObject).toHaveProperty('enhance')
			expect(formObject).toHaveProperty('buttonProps')
			expect(formObject).toHaveProperty('for')

			// Verify buttonProps structure
			expect(formObject.buttonProps).toHaveProperty('type', 'submit')
			expect(formObject.buttonProps).toHaveProperty('formmethod', 'POST')
			expect(formObject.buttonProps).toHaveProperty('formaction')
			expect(formObject.buttonProps).toHaveProperty('onclick')
		})

		it('should allow chaining enhance method', () => {
			const validated = createValidated(mockForm)
			const schema = v.object({ test: v.string() })
			const handler = vi.fn()

			const formObject = validated(schema, handler)
			const enhanceCallback = vi.fn()
			const enhancedForm = formObject.enhance(enhanceCallback)

			expect(formObject.enhance).toHaveBeenCalledWith(enhanceCallback)
			expect(enhancedForm).toHaveProperty('method', 'POST')
			expect(enhancedForm).toHaveProperty('action')
			expect(enhancedForm).toHaveProperty('onsubmit')
		})
	})
})

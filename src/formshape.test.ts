import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createValidated, type ValidationError } from './lib/validated.js'
import { z } from 'zod'
import * as v from 'valibot'

describe('formshape', () => {
	let mockForm: ReturnType<typeof vi.fn>

	beforeEach(() => {
		mockForm = vi.fn().mockReturnValue({
			method: 'POST',
			action: '/test',
			onsubmit: vi.fn(),
			result: undefined,
			pending: 0,
			enhance: vi.fn(),
			buttonProps: { type: 'submit', formmethod: 'POST', formaction: '/test', onclick: vi.fn() },
			for: vi.fn()
		})
	})

	describe('createValidated function', () => {
		it('should return a function', () => {
			const validated = createValidated(mockForm)
			expect(typeof validated).toBe('function')
		})

		it('should call the form function when creating a validated form', () => {
			const validated = createValidated(mockForm)
			const schema = z.object({ name: z.string() })
			const handler = vi.fn()

			validated(schema, handler)

			expect(mockForm).toHaveBeenCalledWith(expect.any(Function))
		})
	})

	describe('Zod integration', () => {
		it('should validate and pass through valid data', async () => {
			const validated = createValidated(mockForm)
			const schema = z.object({
				name: z.string(),
				age: z.coerce.number()
			})

			const handler = vi.fn().mockResolvedValue({ success: true })
			validated(schema, handler)

			// Get the wrapped handler
			const wrappedHandler = mockForm.mock.calls[0][0]

			const formData = new FormData()
			formData.append('name', 'John')
			formData.append('age', '25')

			await wrappedHandler(formData)

			expect(handler).toHaveBeenCalledWith({
				name: 'John',
				age: 25
			})
		})

		it('should return validation errors for invalid data', async () => {
			const validated = createValidated(mockForm)
			const schema = z.object({
				name: z.string().min(3, 'Name too short'),
				email: z.string().email('Invalid email')
			})

			const handler = vi.fn()
			validated(schema, handler)

			const wrappedHandler = mockForm.mock.calls[0][0]

			const formData = new FormData()
			formData.append('name', 'Jo') // Too short
			formData.append('email', 'not-email') // Invalid

			const result = (await wrappedHandler(formData)) as ValidationError

			expect(handler).not.toHaveBeenCalled()
			expect(result.success).toBe(false)
			expect(result.errors).toHaveProperty('name')
			expect(result.errors).toHaveProperty('email')
			expect(result.errors.name).toContain('Name too short')
			expect(result.errors.email).toContain('Invalid email')
		})
	})

	describe('Valibot integration', () => {
		it('should validate and pass through valid valibot data', async () => {
			const validated = createValidated(mockForm)
			const schema = v.object({
				username: v.string(),
				age: v.pipe(v.string(), v.transform(Number), v.number())
			})

			const handler = vi.fn().mockResolvedValue({ id: 1 })
			validated(schema, handler)

			const wrappedHandler = mockForm.mock.calls[0][0]

			const formData = new FormData()
			formData.append('username', 'testuser')
			formData.append('age', '30')

			await wrappedHandler(formData)

			expect(handler).toHaveBeenCalledWith({
				username: 'testuser',
				age: 30
			})
		})

		it('should return valibot validation errors', async () => {
			const validated = createValidated(mockForm)
			const schema = v.object({
				username: v.pipe(v.string(), v.minLength(3, 'Username too short')),
				email: v.pipe(v.string(), v.email('Invalid email'))
			})

			const handler = vi.fn()
			validated(schema, handler)

			const wrappedHandler = mockForm.mock.calls[0][0]

			const formData = new FormData()
			formData.append('username', 'ab') // Too short
			formData.append('email', 'bad-email') // Invalid

			const result = (await wrappedHandler(formData)) as ValidationError

			expect(result.success).toBe(false)
			expect(result.errors).toHaveProperty('username')
			expect(result.errors).toHaveProperty('email')
		})
	})

	describe('error handling', () => {
		it('should include original form data in error response', async () => {
			const validated = createValidated(mockForm)
			const schema = z.object({
				name: z.string().min(5, 'Too short')
			})

			const handler = vi.fn()
			validated(schema, handler)

			const wrappedHandler = mockForm.mock.calls[0][0]

			const formData = new FormData()
			formData.append('name', 'Bob') // Too short

			const result = (await wrappedHandler(formData)) as ValidationError

			expect(result.success).toBe(false)
			expect(result.data).toEqual({ name: 'Bob' })
		})

		it('should handle missing required fields', async () => {
			const validated = createValidated(mockForm)
			const schema = z.object({
				required: z.string()
			})

			const handler = vi.fn()
			validated(schema, handler)

			const wrappedHandler = mockForm.mock.calls[0][0]

			const formData = new FormData()
			// No fields added

			const result = (await wrappedHandler(formData)) as ValidationError

			expect(result.success).toBe(false)
			expect(result.errors).toHaveProperty('required')
		})
	})

	describe('success cases', () => {
		it('should pass through handler return value on success', async () => {
			const validated = createValidated(mockForm)
			const schema = z.object({ test: z.string() })

			const expectedResult = { id: 123, message: 'Success!' }
			const handler = vi.fn().mockResolvedValue(expectedResult)
			validated(schema, handler)

			const wrappedHandler = mockForm.mock.calls[0][0]

			const formData = new FormData()
			formData.append('test', 'valid')

			const result = await wrappedHandler(formData)

			expect(result).toEqual(expectedResult)
		})

		it('should handle async handlers', async () => {
			const validated = createValidated(mockForm)
			const schema = v.object({
				message: v.string()
			})

			const handler = vi.fn().mockImplementation(async (data) => {
				await new Promise((resolve) => setTimeout(resolve, 1))
				return { processed: data.message.toUpperCase() }
			})

			validated(schema, handler)

			const wrappedHandler = mockForm.mock.calls[0][0]

			const formData = new FormData()
			formData.append('message', 'hello')

			const result = await wrappedHandler(formData)

			expect(result).toEqual({ processed: 'HELLO' })
		})
	})

	describe('form object structure', () => {
		it('should return form object with correct properties', () => {
			const validated = createValidated(mockForm)
			const schema = z.object({ test: z.string() })
			const handler = vi.fn()

			const formObject = validated(schema, handler)

			expect(formObject).toHaveProperty('method', 'POST')
			expect(formObject).toHaveProperty('action', '/test')
			expect(formObject).toHaveProperty('onsubmit')
			expect(formObject).toHaveProperty('result')
			expect(formObject).toHaveProperty('pending', 0)
			expect(formObject).toHaveProperty('enhance')
			expect(formObject).toHaveProperty('buttonProps')
			expect(formObject).toHaveProperty('for')
		})

		it('should have properly structured buttonProps', () => {
			const validated = createValidated(mockForm)
			const schema = v.object({ test: v.string() })
			const handler = vi.fn()

			const formObject = validated(schema, handler)

			expect(formObject.buttonProps).toHaveProperty('type', 'submit')
			expect(formObject.buttonProps).toHaveProperty('formmethod', 'POST')
			expect(formObject.buttonProps).toHaveProperty('formaction', '/test')
			expect(formObject.buttonProps).toHaveProperty('onclick')
		})
	})

	describe('real world scenarios', () => {
		it('should handle blog post creation', async () => {
			const validated = createValidated(mockForm)
			const schema = z.object({
				title: z.string().min(3),
				content: z.string().min(10)
			})

			const handler = vi.fn().mockImplementation(async (data) => ({
				success: true,
				post: {
					id: 'post-123',
					slug: data.title.toLowerCase().replace(/ /g, '-'),
					...data
				}
			}))

			validated(schema, handler)

			const wrappedHandler = mockForm.mock.calls[0][0]

			const formData = new FormData()
			formData.append('title', 'My Blog Post')
			formData.append('content', 'This is the content of my blog post.')

			const result = await wrappedHandler(formData)

			expect(result).toMatchObject({
				success: true,
				post: {
					id: 'post-123',
					slug: 'my-blog-post',
					title: 'My Blog Post',
					content: 'This is the content of my blog post.'
				}
			})
		})

		it('should handle contact form submission', async () => {
			const validated = createValidated(mockForm)
			const schema = v.object({
				name: v.pipe(v.string(), v.minLength(2)),
				email: v.pipe(v.string(), v.email()),
				message: v.pipe(v.string(), v.minLength(20))
			})

			const handler = vi.fn().mockResolvedValue({
				success: true,
				message: 'Thank you for your message!'
			})

			validated(schema, handler)

			const wrappedHandler = mockForm.mock.calls[0][0]

			const formData = new FormData()
			formData.append('name', 'John Doe')
			formData.append('email', 'john@example.com')
			formData.append('message', 'This is a test message with enough content to pass validation.')

			const result = await wrappedHandler(formData)

			expect(result).toEqual({
				success: true,
				message: 'Thank you for your message!'
			})
		})
	})
})

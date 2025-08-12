// Types
import type { StandardSchemaV1 } from '@standard-schema/spec'
import type { RemoteForm } from '@sveltejs/kit'

type MaybePromise<T> = T | Promise<T>
type InferSchemaOutput<T> = T extends StandardSchemaV1<unknown, infer O> ? O : never
type FormFunction = <T>(fn: (data: FormData) => MaybePromise<T>) => RemoteForm<T>

export type ValidationError = {
	success: false
	errors: Record<string, string[]>
	data: unknown
}

/**
 * Creates a validated form function using your app's form function.
 *
 * @example
 * ```ts
 * // In your app's server code (e.g., data.remote.ts)
 * import { form } from '$app/server'
 * import { createValidated } from 'formshape'
 *
 * const validated = createValidated(form)
 * ```
 */
export function createValidated(form: FormFunction) {
	return function validated<Schema extends StandardSchemaV1, Result = unknown>(
		schema: Schema,
		handler: (data: InferSchemaOutput<Schema>) => MaybePromise<Result>
	): RemoteForm<Result | ValidationError> {
		return form<Result | ValidationError>(async (formData) => {
			const data = Object.fromEntries(formData.entries())

			const result = await schema['~standard'].validate(data)

			if (result.issues) {
				const errors: Record<string, string[]> = {}

				for (const issue of result.issues) {
					const path =
						issue.path
							?.map((p: PropertyKey | { key: PropertyKey }) =>
								typeof p === 'object' && 'key' in p ? p.key : p
							)
							.join('.') || '_errors'

					if (!errors[path]) {
						errors[path] = []
					}
					errors[path].push(issue.message)
				}

				return {
					success: false,
					errors,
					data
				} as ValidationError
			}

			return handler(result.value as InferSchemaOutput<Schema>)
		})
	}
}

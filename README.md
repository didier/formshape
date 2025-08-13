# formshape

Type-safe form validation for SvelteKit Remote Functions using [Standard Schema](https://standardschema.dev/) compatible validators.

## Features

- 🎯 Works with any Standard Schema compatible library (Zod, Valibot, Arktype, etc.)
- 🔒 Full type safety with automatic type inference
- ⚡ Preserves all SvelteKit form features (progressive enhancement, `enhance`, `buttonProps`, etc.)
- 📦 Lightweight with zero dependencies (besides your validator)
- 🎭 Same API as SvelteKit's `form` function

## Installation

```bash
npm install formshape
# or
pnpm add formshape
```

## Usage

### 1. Create a validated function in your server code

```typescript
// src/routes/contact/data.remote.ts
import { z } from 'zod'
import { form } from '$app/server'
import { createValidated } from 'formshape'

// Create the validated function using your app's form function
const validated = createValidated(form)

// Define your schema
const contactSchema = z.object({
	name: z.string().min(2, 'Name must be at least 2 characters'),
	email: z.string().email('Invalid email address'),
	message: z.string().min(10, 'Message must be at least 10 characters')
})

// Create your form handler - data is fully typed!
export const submitContact = validated(contactSchema, async (data) => {
	// data is typed as { name: string; email: string; message: string }
	await sendEmail(data)

	return {
		success: true,
		message: 'Thank you for your message!'
	}
})
```

### 2. Use it in your Svelte component

```svelte
<script lang="ts">
	import { submitContact } from './data.remote.js'
</script>

<form {...submitContact}>
	<input name="name" />
	{#if submitContact.result && 'errors' in submitContact.result}
		<span>{submitContact.result.errors.name?.join(', ')}</span>
	{/if}

	<input name="email" type="email" />
	{#if submitContact.result && 'errors' in submitContact.result}
		<span>{submitContact.result.errors.email?.join(', ')}</span>
	{/if}

	<textarea name="message"></textarea>
	{#if submitContact.result && 'errors' in submitContact.result}
		<span>{submitContact.result.errors.message?.join(', ')}</span>
	{/if}

	<button>Send Message</button>
</form>

{#if submitContact.result?.success === true}
	<p>{submitContact.result.message}</p>
{/if}
```

## How it works

The `createValidated` function takes your app's `form` function and returns a `validated` function. This approach ensures that the package works correctly when installed from npm, as it uses your app's SvelteKit context rather than trying to import from `$app/server` directly.

When validation fails, the function returns:

```typescript
{
  success: false,
  errors: Record<string, string[]>,
  data: unknown // The original form data
}
```

When validation succeeds, your handler is called with the validated data and its return value is passed through.

## Using with enhance

The validated form maintains full compatibility with SvelteKit's `enhance`:

```svelte
<form
	{...submitContact.enhance(async ({ submit }) => {
		const result = await submit()
		// Handle the result
	})}
>
	<!-- form fields -->
</form>
```

## Using with other validators

Any Standard Schema compatible validator works:

### Valibot

```typescript
import * as v from 'valibot'

const schema = v.object({
	email: v.pipe(v.string(), v.email())
})

export const myForm = validated(schema, async (data) => {
	// ...
})
```

### Arktype

```typescript
import { type } from 'arktype'

const schema = type({
	email: 'email',
	age: 'number > 0'
})

export const myForm = validated(schema, async (data) => {
	// ...
})
```

## API

### `createValidated(form)`

Creates a validated function using your app's form function.

- **Parameters:**
  - `form`: The form function from `$app/server`
- **Returns:** A `validated` function

### `validated(schema, handler)`

Creates a form handler with validation.

- **Parameters:**
  - `schema`: A Standard Schema compatible validator
  - `handler`: An async function that receives validated data
- **Returns:** A `RemoteForm` object (same as SvelteKit's `form`)

## License

MIT

export const dataRemoteExample = `// data.remote.ts
import { form } from '$app/server'
import { createValidated } from 'formshape'
import * as v from 'valibot'

const validated = createValidated(form)

const schema = v.object({
  title: v.pipe(v.string(), v.minLength(1, 'Title required')),
  content: v.pipe(v.string(), v.minLength(10, 'Content too short'))
})

export const createPost = validated(schema, async (data) => {
  // data is fully typed based on schema
  return { post: { id: 1, ...data } }
})`

export const svelteExample = `// +page.svelte
<form {...createPost}>
  <input name="title" />
  <textarea name="content"></textarea>
  <button>Create</button>
</form>`

export const errorFormat = `{
  success: false,
  errors: {
    "title": ["Title required"],
    "content": ["Content too short"]
  },
  data: { /* original form data */ }
}`

export const errorHandling = `{#if form.result?.errors?.fieldName}
  <div class="error">{form.result.errors.fieldName.join(', ')}</div>
{/if}`
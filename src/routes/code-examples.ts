export const dataRemoteExample = `// post.remote.ts
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

export const diffExample = `// BEFORE: Verbose manual validation
- export const createPost = form(async (formData) => {
-   const data = Object.fromEntries(formData.entries())
-
-   // Manual validation (so much boilerplate!)
-   if (!data.title || typeof data.title !== 'string') {
-     return { success: false, errors: { title: ['Title required'] } }
-   }
-   if (data.title.length < 1) {
-     return { success: false, errors: { title: ['Title too short'] } }
-   }
-   if (!data.content || typeof data.content !== 'string') {
-     return { success: false, errors: { content: ['Content required'] } }
-   }
-   if (data.content.length < 10) {
-     return { success: false, errors: { content: ['Content too short'] } }
-   }
-
-   return { post: { id: 1, ...data as { title: string; content: string } } }
- })

// AFTER: Clean schema-based validation
+ const schema = v.object({
+   title: v.pipe(v.string(), v.minLength(1, 'Title required')),
+   content: v.pipe(v.string(), v.minLength(10, 'Content too short'))
+ })
+
+ export const createPost = validated(schema, async (data) => {
+   return { post: { id: 1, ...data } } // data is fully typed!
+ })`

export const svelteExample = `<!-- +page.svelte -->
<script lang="ts">
    import { createPost } from '$lib/post.remote.ts'
</script>

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

export const errorHandling = `{#each form.result?.errors?.email as error}
    <p class="text-red-500">{error}</p>
{/each}`

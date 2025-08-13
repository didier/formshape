<script lang="ts">
	import { createPost } from './data.remote.js'
	import { dataRemoteExample, svelteExample, errorFormat, errorHandling } from './code-examples.js'
	import CodeBlock from './CodeBlock.svelte'
</script>

<div class="mx-auto min-h-screen max-w-3xl p-8">
	<header class="my-20 grid gap-4">
		<h1 class="text-title my-0">formshape</h1>

		<p class="text-subtitle mt-0">Type-safe form validation for SvelteKit's remote functions.</p>
	</header>

	<main>
		<h2 class="text-heading">Basic usage</h2>

		<CodeBlock
			code={dataRemoteExample}
			language="typescript"
			class="mb-6"
			highlight={['createValidated', 'validated']}
		/>

		<!-- <p class="text-muted">Or see the difference from vanilla SvelteKit:</p> -->

		<!-- <CodeBlock code={diffExample} language="typescript" class="mb-6" /> -->

		<CodeBlock code={svelteExample} language="svelte" class="mb-8" />

		<h2 class="text-heading">Try it</h2>

		<div class="mb-8 rounded-lg border border-stone-200 p-6 dark:border-stone-700">
			<form {...createPost} class="mb-4">
				<label class="form-label">Title</label>
				<input name="title" placeholder="Enter a title..." class="mb-3 form-input" />
				{#if createPost.result?.errors?.title}
					<div class="form-error mb-3">{createPost.result.errors.title.join(', ')}</div>
				{/if}

				<label class="form-label">Content</label>
				<textarea
					name="content"
					rows="4"
					placeholder="Write your content here..."
					class="mb-3 form-input"
				></textarea>
				{#if createPost.result?.errors?.content}
					<div class="form-error mb-3">{createPost.result.errors.content.join(', ')}</div>
				{/if}

				<label class="form-label">Category</label>
				<select name="category" class="mb-4 form-input">
					<option value="">Select category</option>
					<option value="tech">Tech</option>
					<option value="lifestyle">Lifestyle</option>
				</select>
				{#if createPost.result?.errors?.category}
					<div class="form-error mb-4">{createPost.result.errors.category.join(', ')}</div>
				{/if}

				<button class="form-button">Create Post</button>
			</form>

			{#if createPost.result && 'post' in createPost.result}
				<div class="form-success">
					Post created! ID: {createPost.result.post.id}
				</div>
			{/if}
		</div>

		<h2 class="text-heading">Error handling</h2>

		<p class="text-muted">Validation errors are returned in this format:</p>

		<CodeBlock code={errorFormat} language="json" class="mb-4" />

		<p class="text-muted">Display errors next to fields:</p>

		<CodeBlock code={errorHandling} language="svelte" class="mb-8" />

		<h2 class="text-heading">Works with any Standard Schema validator</h2>

		<div class="flex flex-wrap gap-3">
			{#each [{ name: 'Zod', url: 'https://zod.dev', color: 'border-blue-500' }, { name: 'Valibot', url: 'https://valibot.dev', color: 'border-purple-500' }, { name: 'Joi', url: 'https://joi.dev', color: 'border-orange-500' }, { name: 'Yup', url: 'https://github.com/jquense/yup', color: 'border-green-500' }] as validator (validator.url)}
				<a
					href={validator.url}
					class="flex items-center gap-0 rounded-md border border-stone-200 p-1 text-inherit no-underline hover:bg-stone-50 dark:border-stone-700 dark:hover:bg-stone-800"
				>
					<div class="h-full w-0 rounded-full border {validator.color}"></div>
					<div class="px-3.5">
						{validator.name}
					</div>
				</a>
			{/each}
			<a
				href="https://standardschema.dev/#what-schema-libraries-implement-the-spec"
				target="_blank"
				class="text-muted my-2 flex items-center gap-2"
			>
				and more...
			</a>
		</div>
	</main>

	<footer class="border-muted text-footer mt-16 grid gap-1 border-t pt-6">
		<p class="my-0">
			By <a href="https://x.com/didiercatz" class="link-hover">Didier Catz (@didier)</a>
		</p>
		<p class="my-0">
			<a href="https://github.com/didier/formshape" class="link-hover"
				>github.com/didier/formshape</a
			>
		</p>
	</footer>
</div>

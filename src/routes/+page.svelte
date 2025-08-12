<script lang="ts">
	import { createPost } from './data.remote.js'
	import {
		dataRemoteExample,
		svelteExample,
		errorFormat,
		errorHandling
	} from '$lib/code-examples.js'
	import CodeBlock from '$lib/CodeBlock.svelte'
</script>

<div class="mx-auto min-h-screen max-w-3xl p-8">
	<h1 class="text-title">formshape</h1>

	<p class="text-subtitle">Type-safe form validation for SvelteKit's remote functions.</p>

	<h2 class="text-heading mt-12">Basic usage</h2>

	<CodeBlock code={dataRemoteExample} language="typescript" class="mb-6" />

	<CodeBlock code={svelteExample} language="svelte" class="mb-8" />

	<h2 class="text-heading">Try it</h2>

	<form {...createPost} class="mb-8">
		<label class="form-label">Title</label>
		<input name="title" placeholder="Enter a title..." class="mb-3 form-input" />
		{#if createPost.result?.errors?.title}
			<div class="form-error mb-3">{createPost.result.errors.title.join(', ')}</div>
		{/if}

		<label class="form-label">Content</label>
		<textarea name="content" rows="4" placeholder="Write your content here..." class="mb-3 form-input"></textarea>
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
		<div class="form-success mb-8">
			Post created! ID: {createPost.result.post.id}
		</div>
	{/if}

	<h2 class="text-heading">Error handling</h2>

	<p class="text-muted">Validation errors are returned in this format:</p>

	<CodeBlock code={errorFormat} language="json" class="mb-4" />

	<p class="text-muted">Display errors next to fields:</p>

	<CodeBlock code={errorHandling} language="svelte" class="mb-8" />

	<h2 class="text-heading">Works with any Standard Schema validator</h2>

	<ul class="text-muted">
		<li>• Zod</li>
		<li>• Valibot</li>
		<li>• Yup</li>
		<li>• Joi</li>
		<li>• Any library implementing Standard Schema</li>
	</ul>

	<footer class="border-muted text-footer mt-16 border-t pt-8">
		<p class="mb-2">
			By <a href="https://x.com/didiercatz" class="link-hover">Didier Catz</a>
			(<a href="https://github.com/didier" class="link-hover">@didier</a>)
		</p>
		<p>
			<a href="https://github.com/didier/formshape" class="link-hover"
				>github.com/didier/formshape</a
			>
		</p>
	</footer>
</div>

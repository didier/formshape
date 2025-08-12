<script lang="ts">
	import { createPost, submitContact } from './data.remote.js'
</script>

<div class="mx-auto max-w-4xl p-8">
	<h1 class="mb-8 text-3xl font-bold">SvelteKit Validated Forms Demo</h1>

	<div class="grid gap-8 md:grid-cols-2">
		<!-- Create Post Form -->
		<div class="rounded-lg border bg-white p-6 shadow-sm">
			<h2 class="mb-4 text-xl font-semibold">Create Post</h2>

			<form {...createPost} class="space-y-4">
				<div>
					<label for="title" class="mb-1 block text-sm font-medium"> Title </label>
					<input
						id="title"
						name="title"
						type="text"
						class="w-full rounded-md border px-3 py-2"
						class:border-red-500={createPost.result &&
							'errors' in createPost.result &&
							createPost.result.errors?.title}
					/>
					{#if createPost.result && 'errors' in createPost.result && createPost.result.errors?.title}
						<p class="mt-1 text-sm text-red-600">
							{createPost.result.errors.title.join(', ')}
						</p>
					{/if}
				</div>

				<div>
					<label for="content" class="mb-1 block text-sm font-medium"> Content </label>
					<textarea
						id="content"
						name="content"
						rows="4"
						class="w-full rounded-md border px-3 py-2"
						class:border-red-500={createPost.result &&
							'errors' in createPost.result &&
							createPost.result.errors?.content}
					></textarea>
					{#if createPost.result && 'errors' in createPost.result && createPost.result.errors?.content}
						<p class="mt-1 text-sm text-red-600">
							{createPost.result.errors.content.join(', ')}
						</p>
					{/if}
				</div>

				<div>
					<label for="category" class="mb-1 block text-sm font-medium"> Category </label>
					<select
						id="category"
						name="category"
						class="w-full rounded-md border px-3 py-2"
						class:border-red-500={createPost.result &&
							'errors' in createPost.result &&
							createPost.result.errors?.category}
					>
						<option value="">Select a category</option>
						<option value="tech">Technology</option>
						<option value="lifestyle">Lifestyle</option>
						<option value="food">Food</option>
					</select>
					{#if createPost.result && 'errors' in createPost.result && createPost.result.errors?.category}
						<p class="mt-1 text-sm text-red-600">
							{createPost.result.errors.category.join(', ')}
						</p>
					{/if}
				</div>

				<button
					type="submit"
					class="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
				>
					Create Post
				</button>
			</form>

			{#if createPost.result && 'post' in createPost.result}
				<div class="mt-4 rounded-md bg-green-50 p-3">
					<p class="text-sm text-green-800">Post created successfully!</p>
					<pre class="mt-2 text-xs">{JSON.stringify(createPost.result.post, null, 2)}</pre>
				</div>
			{/if}
		</div>

		<!-- Contact Form -->
		<div class="rounded-lg border bg-white p-6 shadow-sm">
			<h2 class="mb-4 text-xl font-semibold">Contact Form</h2>

			<form {...submitContact} class="space-y-4">
				<div>
					<label for="name" class="mb-1 block text-sm font-medium"> Name </label>
					<input
						id="name"
						name="name"
						type="text"
						class="w-full rounded-md border px-3 py-2"
						class:border-red-500={submitContact.result &&
							'errors' in submitContact.result &&
							submitContact.result.errors?.name}
					/>
					{#if submitContact.result && 'errors' in submitContact.result && submitContact.result.errors?.name}
						<p class="mt-1 text-sm text-red-600">
							{submitContact.result.errors.name.join(', ')}
						</p>
					{/if}
				</div>

				<div>
					<label for="email" class="mb-1 block text-sm font-medium"> Email </label>
					<input
						id="email"
						name="email"
						type="email"
						class="w-full rounded-md border px-3 py-2"
						class:border-red-500={submitContact.result &&
							'errors' in submitContact.result &&
							submitContact.result.errors?.email}
					/>
					{#if submitContact.result && 'errors' in submitContact.result && submitContact.result.errors?.email}
						<p class="mt-1 text-sm text-red-600">
							{submitContact.result.errors.email.join(', ')}
						</p>
					{/if}
				</div>

				<div>
					<label for="message" class="mb-1 block text-sm font-medium"> Message </label>
					<textarea
						id="message"
						name="message"
						rows="4"
						class="w-full rounded-md border px-3 py-2"
						class:border-red-500={submitContact.result &&
							'errors' in submitContact.result &&
							submitContact.result.errors?.message}
					></textarea>
					{#if submitContact.result && 'errors' in submitContact.result && submitContact.result.errors?.message}
						<p class="mt-1 text-sm text-red-600">
							{submitContact.result.errors.message.join(', ')}
						</p>
					{/if}
				</div>

				<button
					type="submit"
					class="w-full rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700"
				>
					Send Message
				</button>
			</form>

			{#if submitContact.result && 'message' in submitContact.result && submitContact.result.success}
				<div class="mt-4 rounded-md bg-green-50 p-3">
					<p class="text-sm text-green-800">
						{submitContact.result.message}
					</p>
				</div>
			{/if}
		</div>
	</div>

	<div class="mt-8 rounded-lg bg-gray-50 p-6">
		<h3 class="mb-2 text-lg font-semibold">How it works:</h3>
		<ul class="list-inside list-disc space-y-1 text-sm text-gray-700">
			<li>Forms use the spread operator with validated remote functions</li>
			<li>Validation happens server-side using Zod schemas</li>
			<li>Errors are returned and displayed next to each field</li>
			<li>The form works with and without JavaScript (progressive enhancement)</li>
			<li>Try submitting with invalid data to see validation errors</li>
		</ul>
	</div>
</div>

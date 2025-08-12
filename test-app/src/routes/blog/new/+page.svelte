<script lang="ts">
	import { createPost, createPostWithRedirect } from '../data.remote.js'
</script>

<h1>Create a new post</h1>

<div class="grid gap-8 md:grid-cols-2">
	<!-- Basic form that returns data -->
	<div class="rounded border p-4">
		<h2 class="mb-4 text-lg font-semibold">Form with Result</h2>

		<form {...createPost} class="space-y-4">
			<label class="block">
				<span class="mb-1 block text-sm font-medium">Title</span>
				<input
					name="title"
					class="w-full rounded border px-3 py-2"
					class:border-red-500={createPost.result &&
						'errors' in createPost.result &&
						createPost.result.errors?.title}
				/>
				{#if createPost.result && 'errors' in createPost.result && createPost.result.errors?.title}
					<span class="text-sm text-red-600">{createPost.result.errors.title.join(', ')}</span>
				{/if}
			</label>

			<label class="block">
				<span class="mb-1 block text-sm font-medium">Write your post</span>
				<textarea
					name="content"
					rows="4"
					class="w-full rounded border px-3 py-2"
					class:border-red-500={createPost.result &&
						'errors' in createPost.result &&
						createPost.result.errors?.content}
				></textarea>
				{#if createPost.result && 'errors' in createPost.result && createPost.result.errors?.content}
					<span class="text-sm text-red-600">{createPost.result.errors.content.join(', ')}</span>
				{/if}
			</label>

			<button class="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"> Publish! </button>
		</form>

		{#if createPost.result && 'success' in createPost.result && createPost.result.success}
			<div class="mt-4 rounded border border-green-200 bg-green-50 p-3">
				<p class="text-green-800">{createPost.result.message}</p>
				<pre class="mt-2 text-xs text-green-700">{JSON.stringify(
						createPost.result.post,
						null,
						2
					)}</pre>
			</div>
		{/if}
	</div>

	<!-- Form with redirect -->
	<div class="rounded border p-4">
		<h2 class="mb-4 text-lg font-semibold">Form with Redirect</h2>

		<form {...createPostWithRedirect} class="space-y-4">
			<label class="block">
				<span class="mb-1 block text-sm font-medium">Title</span>
				<input
					name="title"
					class="w-full rounded border px-3 py-2"
					class:border-red-500={createPostWithRedirect.result &&
						'errors' in createPostWithRedirect.result &&
						createPostWithRedirect.result.errors?.title}
				/>
				{#if createPostWithRedirect.result && 'errors' in createPostWithRedirect.result && createPostWithRedirect.result.errors?.title}
					<span class="text-sm text-red-600"
						>{createPostWithRedirect.result.errors.title.join(', ')}</span
					>
				{/if}
			</label>

			<label class="block">
				<span class="mb-1 block text-sm font-medium">Write your post</span>
				<textarea
					name="content"
					rows="4"
					class="w-full rounded border px-3 py-2"
					class:border-red-500={createPostWithRedirect.result &&
						'errors' in createPostWithRedirect.result &&
						createPostWithRedirect.result.errors?.content}
				></textarea>
				{#if createPostWithRedirect.result && 'errors' in createPostWithRedirect.result && createPostWithRedirect.result.errors?.content}
					<span class="text-sm text-red-600"
						>{createPostWithRedirect.result.errors.content.join(', ')}</span
					>
				{/if}
			</label>

			<button class="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700">
				Publish & Redirect!
			</button>
		</form>
	</div>
</div>

<div class="mt-8 rounded bg-gray-50 p-4">
	<h3 class="mb-2 font-semibold">Test Instructions:</h3>
	<ul class="list-inside list-disc space-y-1 text-sm">
		<li>Try submitting with empty fields to see validation errors</li>
		<li>Try short title (&lt;3 chars) or content (&lt;10 chars)</li>
		<li>Left form shows results, right form redirects on success</li>
		<li>Check network tab to see progressive enhancement working</li>
	</ul>
</div>

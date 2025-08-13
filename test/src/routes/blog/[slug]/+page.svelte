<script lang="ts">
	import { page } from '$app/stores'

	$: slug = $page.params.slug
</script>

<h1 class="mb-4 text-2xl font-bold">Blog Post: {slug}</h1>

<div class="mb-6 rounded border border-green-200 bg-green-50 p-4">
	<h2 class="font-semibold text-green-800">✅ Redirect Success!</h2>
	<p class="text-green-700">
		You were redirected here after successfully creating a blog post with slug:
		<code class="rounded bg-green-100 px-1">{slug}</code>
	</p>
</div>

<div class="space-y-4">
	<p>
		This demonstrates that the formshape package works correctly with SvelteKit's redirect
		functionality.
	</p>

	<p>In a real app, this page would:</p>
	<ul class="ml-4 list-inside list-disc space-y-1">
		<li>Load the actual blog post from the database</li>
		<li>Display the post content</li>
		<li>Show comments, related posts, etc.</li>
	</ul>
</div>

<div class="mt-8">
	<a
		href="/blog/new"
		class="inline-block rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
	>
		← Create Another Post
	</a>
	<a href="/" class="ml-4 inline-block rounded border border-gray-300 px-4 py-2 hover:bg-gray-50">
		← Back to Tests
	</a>
</div>

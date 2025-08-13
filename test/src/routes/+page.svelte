<h1 class="mb-6 text-3xl font-bold">Formshape Test Suite</h1>

<p class="mb-8 text-gray-600">
	This app tests all features of the <code class="rounded bg-gray-100 px-1">formshape</code> package
	with SvelteKit's remote functions.
</p>

<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
	<a href="/blog/new" class="block rounded-lg border p-6 transition-shadow hover:shadow-md">
		<h2 class="mb-2 text-xl font-semibold">📝 Basic Forms</h2>
		<p class="mb-4 text-gray-600">Test basic form validation with results and redirects</p>
		<ul class="space-y-1 text-sm">
			<li>• Form with result data</li>
			<li>• Form with redirect</li>
			<li>• Validation error display</li>
			<li>• Progressive enhancement</li>
		</ul>
	</a>

	<a href="/login" class="block rounded-lg border p-6 transition-shadow hover:shadow-md">
		<h2 class="mb-2 text-xl font-semibold">🔘 ButtonProps</h2>
		<p class="mb-4 text-gray-600">Test multiple submit buttons with different actions</p>
		<ul class="space-y-1 text-sm">
			<li>• Login vs Register buttons</li>
			<li>• Different validation schemas</li>
			<li>• Same form, different actions</li>
			<li>• buttonProps spreading</li>
		</ul>
	</a>

	<a href="/enhance" class="block rounded-lg border p-6 transition-shadow hover:shadow-md">
		<h2 class="mb-2 text-xl font-semibold">⚡ Enhance Method</h2>
		<p class="mb-4 text-gray-600">Test form.enhance() with custom submission handling</p>
		<ul class="space-y-1 text-sm">
			<li>• Custom submit callbacks</li>
			<li>• Form reset on success</li>
			<li>• Toast notifications</li>
			<li>• Pending state handling</li>
		</ul>
	</a>
</div>

<div class="mt-12 rounded-lg bg-blue-50 p-6">
	<h3 class="mb-3 text-lg font-semibold">🧪 What we're testing:</h3>
	<div class="grid gap-4 md:grid-cols-2">
		<div>
			<h4 class="mb-2 font-medium">Core Features:</h4>
			<ul class="space-y-1 text-sm">
				<li>✅ Standard Schema validation (Valibot)</li>
				<li>✅ Type-safe form handlers</li>
				<li>✅ Error message display</li>
				<li>✅ Success result handling</li>
			</ul>
		</div>
		<div>
			<h4 class="mb-2 font-medium">SvelteKit Integration:</h4>
			<ul class="space-y-1 text-sm">
				<li>✅ Form spreading <code>&#123;...form&#125;</code></li>
				<li>✅ ButtonProps <code>&#123;...form.buttonProps&#125;</code></li>
				<li>✅ Enhance method <code>form.enhance()</code></li>
				<li>✅ Pending state <code>form.pending</code></li>
			</ul>
		</div>
	</div>
</div>

<div class="mt-8 rounded bg-gray-50 p-4">
	<h4 class="mb-2 font-semibold">Package Info:</h4>
	<p class="text-sm">
		Using <code>formshape@workspace:*</code> (local development version) with <code>valibot</code> for
		validation.
	</p>
</div>

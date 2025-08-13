<script lang="ts">
	import { submitContact } from '../blog/data.remote.js'

	let toastMessage = ''
	let showToast = false

	function showToastMessage(message: string) {
		toastMessage = message
		showToast = true
		setTimeout(() => (showToast = false), 3000)
	}
</script>

<h1>Enhance Method Test</h1>
<p class="mb-6 text-gray-600">Testing form.enhance() functionality</p>

<div class="max-w-md">
	<form
		{...submitContact.enhance(async ({ form, data, submit }) => {
			try {
				console.log('Form submission started with data:', Object.fromEntries(data.entries()))

				await submit()

				// Reset form on success
				form.reset()
				showToastMessage('Message sent successfully!')
			} catch (error) {
				console.error('Form submission failed:', error)
				showToastMessage('Oh no! Something went wrong')
			}
		})}
		class="space-y-4 rounded border p-6"
	>
		<h2 class="text-lg font-semibold">Contact Form with Enhance</h2>

		<label class="block">
			<span class="mb-1 block text-sm font-medium">Name</span>
			<input
				name="name"
				class="w-full rounded border px-3 py-2"
				class:border-red-500={submitContact.result &&
					'errors' in submitContact.result &&
					submitContact.result.errors?.name}
			/>
			{#if submitContact.result && 'errors' in submitContact.result && submitContact.result.errors?.name}
				<span class="text-sm text-red-600">{submitContact.result.errors.name.join(', ')}</span>
			{/if}
		</label>

		<label class="block">
			<span class="mb-1 block text-sm font-medium">Email</span>
			<input
				name="email"
				type="email"
				class="w-full rounded border px-3 py-2"
				class:border-red-500={submitContact.result &&
					'errors' in submitContact.result &&
					submitContact.result.errors?.email}
			/>
			{#if submitContact.result && 'errors' in submitContact.result && submitContact.result.errors?.email}
				<span class="text-sm text-red-600">{submitContact.result.errors.email.join(', ')}</span>
			{/if}
		</label>

		<label class="block">
			<span class="mb-1 block text-sm font-medium">Message</span>
			<textarea
				name="message"
				rows="4"
				class="w-full rounded border px-3 py-2"
				class:border-red-500={submitContact.result &&
					'errors' in submitContact.result &&
					submitContact.result.errors?.message}
			></textarea>
			{#if submitContact.result && 'errors' in submitContact.result && submitContact.result.errors?.message}
				<span class="text-sm text-red-600">{submitContact.result.errors.message.join(', ')}</span>
			{/if}
		</label>

		<button
			class="rounded bg-purple-600 px-4 py-2 text-white hover:bg-purple-700 disabled:opacity-50"
			disabled={submitContact.pending > 0}
		>
			{#if submitContact.pending > 0}
				Sending... ({submitContact.pending})
			{:else}
				Send Message
			{/if}
		</button>
	</form>

	<!-- Toast notification -->
	{#if showToast}
		<div class="fixed top-4 right-4 z-50 rounded-lg border border-gray-200 bg-white p-4 shadow-lg">
			<p class="text-gray-800">{toastMessage}</p>
		</div>
	{/if}

	<!-- Normal result display (will be cleared by form.reset()) -->
	{#if submitContact.result && 'success' in submitContact.result && submitContact.result.success}
		<div class="mt-4 rounded border border-green-200 bg-green-50 p-3">
			<p class="text-green-800">{submitContact.result.message}</p>
		</div>
	{/if}
</div>

<div class="mt-8 rounded bg-gray-50 p-4">
	<h3 class="mb-2 font-semibold">Enhance Features Tested:</h3>
	<ul class="list-inside list-disc space-y-1 text-sm">
		<li><strong>Custom submission handling:</strong> Form data is logged to console</li>
		<li><strong>Form reset:</strong> Form clears automatically on successful submission</li>
		<li><strong>Toast notifications:</strong> Custom success/error messages via enhance</li>
		<li><strong>Pending state:</strong> Button shows loading state and pending count</li>
		<li><strong>Error handling:</strong> Try/catch in enhance callback</li>
		<li><strong>Progressive enhancement:</strong> Works without JavaScript, enhanced with it</li>
	</ul>

	<h4 class="mt-4 mb-2 font-semibold">Test scenarios:</h4>
	<ul class="list-inside list-disc space-y-1 text-sm">
		<li>Submit valid form → see toast, form clears, no page reload</li>
		<li>Submit invalid form → see validation errors, form doesn't clear</li>
		<li>Submit multiple times quickly → see pending count increase</li>
		<li>Check console for logged form data</li>
		<li>Disable JavaScript and test fallback behavior</li>
	</ul>
</div>

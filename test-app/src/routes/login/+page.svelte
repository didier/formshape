<script lang="ts">
	import { login, register } from '../blog/data.remote.js'
</script>

<h1>Login / Register Test</h1>
<p class="mb-6 text-gray-600">Testing buttonProps functionality</p>

<div class="max-w-md">
	<form {...login} class="space-y-4 rounded border p-6">
		<h2 class="text-lg font-semibold">Account Access</h2>

		<label class="block">
			<span class="mb-1 block text-sm font-medium">Your username</span>
			<input
				name="username"
				class="w-full rounded border px-3 py-2"
				class:border-red-500={login.result &&
					'errors' in login.result &&
					login.result.errors?.username}
			/>
			{#if login.result && 'errors' in login.result && login.result.errors?.username}
				<span class="text-sm text-red-600">{login.result.errors.username.join(', ')}</span>
			{/if}
		</label>

		<label class="block">
			<span class="mb-1 block text-sm font-medium">Your password</span>
			<input
				name="password"
				type="password"
				class="w-full rounded border px-3 py-2"
				class:border-red-500={login.result &&
					'errors' in login.result &&
					login.result.errors?.password}
			/>
			{#if login.result && 'errors' in login.result && login.result.errors?.password}
				<span class="text-sm text-red-600">{login.result.errors.password.join(', ')}</span>
			{/if}
		</label>

		<!-- Additional field for register (only shows register errors) -->
		<label class="block">
			<span class="mb-1 block text-sm font-medium">Your email (for registration)</span>
			<input
				name="email"
				type="email"
				class="w-full rounded border px-3 py-2"
				class:border-red-500={register.result &&
					'errors' in register.result &&
					register.result.errors?.email}
			/>
			{#if register.result && 'errors' in register.result && register.result.errors?.email}
				<span class="text-sm text-red-600">{register.result.errors.email.join(', ')}</span>
			{/if}
		</label>

		<div class="flex gap-4">
			<button class="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"> Login </button>
			<button
				{...register.buttonProps}
				class="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
			>
				Register
			</button>
		</div>
	</form>

	<!-- Results display -->
	{#if login.result && 'success' in login.result && login.result.success}
		<div class="mt-4 rounded border border-blue-200 bg-blue-50 p-3">
			<p class="font-semibold text-blue-800">Login Success!</p>
			<p class="text-blue-700">{login.result.message}</p>
			<pre class="mt-2 text-xs text-blue-600">{JSON.stringify(login.result.user, null, 2)}</pre>
		</div>
	{/if}

	{#if register.result && 'success' in register.result && register.result.success}
		<div class="mt-4 rounded border border-green-200 bg-green-50 p-3">
			<p class="font-semibold text-green-800">Registration Success!</p>
			<p class="text-green-700">{register.result.message}</p>
			<pre class="mt-2 text-xs text-green-600">{JSON.stringify(register.result.user, null, 2)}</pre>
		</div>
	{/if}
</div>

<div class="mt-8 rounded bg-gray-50 p-4">
	<h3 class="mb-2 font-semibold">ButtonProps Test:</h3>
	<ul class="list-inside list-disc space-y-1 text-sm">
		<li>The form uses the <code>login</code> action by default</li>
		<li>
			The "Register" button has <code>&#123;...register.buttonProps&#125;</code> to use the register
			action
		</li>
		<li>Fill all fields and try both buttons</li>
		<li>For register, email is required. For login, email is ignored.</li>
		<li>Try short passwords (&lt;6 chars) to test validation</li>
	</ul>
</div>

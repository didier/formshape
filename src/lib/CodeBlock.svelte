<script lang="ts">
	import { codeToHtml } from 'shiki'
	import { onMount } from 'svelte'
	import { browser } from '$app/environment'

	interface Props {
		code: string
		language: string
		class?: string
	}

	let { code, language, class: classes = '' }: Props = $props()

	let highlightedCode = $state('')

	function getTheme() {
		if (!browser) return 'vitesse-light'
		return window.matchMedia('(prefers-color-scheme: dark)').matches
			? 'vitesse-dark'
			: 'vitesse-light'
	}

	async function updateHighlight() {
		highlightedCode = await codeToHtml(code, {
			lang: language,
			theme: getTheme()
		})
	}

	onMount(() => {
		updateHighlight()

		// Listen for theme changes
		const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
		mediaQuery.addEventListener('change', updateHighlight)

		return () => mediaQuery.removeEventListener('change', updateHighlight)
	})
</script>

<div class={['[&>pre]:p-4 [&>pre]:overflow-x-auto', classes]}>
	{@html highlightedCode}
</div>

<script lang="ts">
	import { codeToHtml } from 'shiki'
	import { onMount } from 'svelte'
	import { browser } from '$app/environment'

	interface Props {
		code: string
		language: string
		class?: string
		highlight?: string[]
	}

	let { code, language, class: classes = '', highlight = [] }: Props = $props()

	let highlightedCode = $state('')

	function getTheme() {
		if (!browser) return 'vitesse-light'
		return window.matchMedia('(prefers-color-scheme: dark)').matches
			? 'vitesse-dark'
			: 'vitesse-light'
	}

	function createDecorations() {
		const decorations = []
		const lines = code.split('\n')

		// Add highlighting for specific terms
		if (highlight.length) {
			for (const term of highlight) {
				const regex = new RegExp(`\\b${term}\\b`, 'g')
				let match

				lines.forEach((line, lineIndex) => {
					while ((match = regex.exec(line)) !== null) {
						decorations.push({
							start: { line: lineIndex, character: match.index },
							end: { line: lineIndex, character: match.index + term.length },
							properties: { class: 'highlighted-term' }
						})
					}
					regex.lastIndex = 0
				})
			}
		}

		// Add diff highlighting for + and - lines (regardless of language)
		lines.forEach((line, lineIndex) => {
			if (line.startsWith('+ ')) {
				// Highlight just the + character (position 0 to 1)
				decorations.push({
					start: { line: lineIndex, character: 0 },
					end: { line: lineIndex, character: 1 },
					properties: { class: 'diff-marker-added' }
				})
				// Highlight the added content (from position 2 to end)
				if (line.length > 2) {
					decorations.push({
						start: { line: lineIndex, character: 2 },
						end: { line: lineIndex, character: line.length },
						properties: { class: 'diff-added' }
					})
				}
			} else if (line.startsWith('- ')) {
				// Highlight just the - character (position 0 to 1)
				decorations.push({
					start: { line: lineIndex, character: 0 },
					end: { line: lineIndex, character: 1 },
					properties: { class: 'diff-marker-removed' }
				})
				// Highlight the removed content (from position 2 to end)
				if (line.length > 2) {
					decorations.push({
						start: { line: lineIndex, character: 2 },
						end: { line: lineIndex, character: line.length },
						properties: { class: 'diff-removed' }
					})
				}
			}
		})

		return decorations
	}

	async function updateHighlight() {
		highlightedCode = await codeToHtml(code, {
			lang: language,
			theme: getTheme(),
			decorations: createDecorations()
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

<div class={['[&>pre]:overflow-x-auto [&>pre]:p-4', classes]}>
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	{@html highlightedCode}
</div>

<style lang="postcss">
	@reference '../app.css';

	:global(.highlighted-term) {
		background: rgba(255, 255, 0, 0.2);
		border-radius: 2px;
		padding: 1px 2px;
	}

	:global(.diff-added) {
		background: rgb(34 197 94 / 0.1);
	}

	:global(.diff-removed) {
		background: rgb(239 68 68 / 0.1);
	}

	:global(.diff-marker-added) {
		color: rgb(34 197 94 / 0.6) !important;
		font-weight: bold;
	}

	:global(.diff-marker-removed) {
		color: rgb(239 68 68 / 0.6) !important;
		font-weight: bold;
	}
</style>

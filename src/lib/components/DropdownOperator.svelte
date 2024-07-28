<script lang="ts">
	import { onDestroy } from 'svelte';

	export let operator;
	let isOpen = false;
	let selectedOperator = $operator;
	let dropdownRef;

	const toggleDropdown = () => {
		isOpen = !isOpen;
		if (isOpen) {
			if (typeof document !== 'undefined') {
				document.addEventListener('click', handleClickOutside);
			}
		} else {
			if (typeof document !== 'undefined') {
				document.removeEventListener('click', handleClickOutside);
			}
		}
	};

	const selectOperator = (op) => {
		selectedOperator = op;
		operator.set(op);
		isOpen = false;
		if (typeof document !== 'undefined') {
			document.removeEventListener('click', handleClickOutside);
		}
	};

	const handleClickOutside = (event) => {
		if (dropdownRef && !dropdownRef.contains(event.target)) {
			isOpen = false;
			if (typeof document !== 'undefined') {
				document.removeEventListener('click', handleClickOutside);
			}
		}
	};

	onDestroy(() => {
		if (typeof document !== 'undefined') {
			document.removeEventListener('click', handleClickOutside);
		}
	});
</script>

<div bind:this={dropdownRef} class="relative inline-block text-left w-full" title="Choose an operator">
	<div>
		<button
			class="inline-flex justify-between w-full rounded-lg border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-500 transition duration-150 ease-in-out"
			on:click={toggleDropdown}
			type="button">
			{selectedOperator}
			<svg aria-hidden="true" class="-mr-1 ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
					 xmlns="http://www.w3.org/2000/svg">
				<path d="M19 9l-7 7-7-7" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
			</svg>
		</button>
	</div>

	{#if isOpen}
		<div
			class="origin-top-right absolute right-0 mt-2 w-full rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 transition duration-150 ease-in-out">
			<div class="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
				{#each ['+', '-', '*', '/'] as op}
					<a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
						 role="menuitem" on:click={() => selectOperator(op)}>
						{op}
					</a>
				{/each}
			</div>
		</div>
	{/if}
</div>
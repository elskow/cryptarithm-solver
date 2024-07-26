<script lang="ts">
	export let puzzle;
	export let numRows;
	export let numCols;

	const handleInput = (event, rowIndex, colIndex) => {
		const input = event.target as HTMLInputElement;
		puzzle.update(p => {
			p[rowIndex][colIndex] = input.value.replace(/[^A-Za-z]/g, '');
			return p;
		});
		if (input.value && colIndex < $numCols - 1) {
			const nextInput = input.nextElementSibling as HTMLInputElement;
			if (nextInput) nextInput.focus();
		}
	};

	const handleKeydown = (event, rowIndex, colIndex) => {
		const input = event.target as HTMLInputElement;
		if (event.key === 'Backspace' && !input.value && colIndex > 0) {
			const prevInput = input.previousElementSibling as HTMLInputElement;
			if (prevInput) prevInput.focus();
		} else if (event.key === 'ArrowRight' && colIndex < $numCols - 1) {
			const nextInput = input.nextElementSibling as HTMLInputElement;
			if (nextInput) nextInput.focus();
		} else if (event.key === 'ArrowLeft' && colIndex > 0) {
			const prevInput = input.previousElementSibling as HTMLInputElement;
			if (prevInput) prevInput.focus();
		} else if (event.key === 'ArrowDown' && rowIndex < $numRows - 1) {
			const nextRowInput = document.querySelector(`input[data-row="${rowIndex + 1}"][data-col="${colIndex}"]`) as HTMLInputElement;
			if (nextRowInput) nextRowInput.focus();
		} else if (event.key === 'ArrowUp' && rowIndex > 0) {
			const prevRowInput = document.querySelector(`input[data-row="${rowIndex - 1}"][data-col="${colIndex}"]`) as HTMLInputElement;
			if (prevRowInput) prevRowInput.focus();
		}
	};
</script>

<div class="flex flex-col items-center space-y-4 w-full">
	{#each $puzzle as row, rowIndex}
		<div class="flex flex-wrap justify-center space-x-1 md:space-x-2 font-mono">
			{#each row as value, colIndex}
				<input
					type="text"
					class="p-1.5 md:p-2 border border-gray-300 rounded-md w-12 text-center"
					maxlength="1"
					bind:value={$puzzle[rowIndex][colIndex]}
					on:input={(event) => handleInput(event, rowIndex, colIndex)}
					on:keydown={(event) => handleKeydown(event, rowIndex, colIndex)}
					data-row={rowIndex}
					data-col={colIndex}
				/>
			{/each}
		</div>
	{/each}
</div>
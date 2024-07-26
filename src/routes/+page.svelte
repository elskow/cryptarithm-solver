<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import CryptarithmWorker from '$lib/workers/cryptarithmWorker?worker';
	import {
		error,
		isLoading,
		numCols,
		numRows,
		operator,
		puzzle,
		solution,
		successMessage,
		timeExecution
	} from '$lib/stores/cryptarithmStore';

	const formatSolutionAsEquation = (solution) => {
		const lines = solution.split('\n');
		const maxLength = Math.max(...lines.map(line => line.length));
		const formattedLines = lines.map(line => line.padStart(maxLength, ' '));
		const equation = formattedLines.join('\n');
		const separator = '-'.repeat(maxLength);
		return `${equation}\n${separator}`;
	};

	const solveCryptarithm = async () => {
		isLoading.set(true);
		successMessage.set('');
		solution.set('');
		timeExecution.set('');
		error.set('');
		try {
			const worker = new CryptarithmWorker();
			const begin = Date.now();

			worker.postMessage({ puzzle: $puzzle, operator: $operator });

			worker.onmessage = (event) => {
				const { result, error: workerError } = event.data;
				const end = Date.now();

				if (workerError) {
					error.set(workerError);
				} else {
					solution.set(formatSolutionAsEquation(result));
					timeExecution.set(`Execution time: ${(end - begin) / 1000}s`);
					successMessage.set('Solution found!');
				}

				isLoading.set(false);
				worker.terminate();
			};
		} catch (err) {
			error.set('An error occurred while solving the puzzle.');
			solution.set('');
			timeExecution.set('');
			isLoading.set(false);
		}
	};

	const clearForm = () => {
		numRows.set(3);
		numCols.set(3);
		puzzle.set(Array.from({ length: 3 }, () => Array(3).fill('')));
		solution.set('');
		timeExecution.set('');
		error.set('');
		successMessage.set('');
	};

	const addRow = () => {
		numRows.update(n => n + 1);
		puzzle.update(p => [...p, Array($numCols).fill('')]);
	};

	const addColumn = () => {
		numCols.update(n => n + 1);
		puzzle.update(p => p.map(row => [...row, '']));
	};

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

<svelte:head>
	<title>Cryptarithm Solver</title>
	<meta content="A cryptarithm solver that finds the correct digit for each letter in an arithmetic expression."
				name="description" />
	<meta content="cryptarithm, solver, puzzle, arithmetic, expression, equation, math, mathematics" name="keywords" />
	<meta content="SvelteKit" name="author" />
	<meta content="Cryptarithm Solver" property="og:title" />
	<meta content="A cryptarithm solver that finds the correct digit for each letter in an arithmetic expression."
				property="og:description" />
	<meta content="website" property="og:type" />
	<meta content="https://cryptarithm.helmyl.com" property="og:url" />
</svelte:head>

<main class="min-h-screen flex flex-col items-center md:p-6 justify-center">
	<section
		class="text-center flex flex-col items-center space-y-6 p-4 md:p-8 bg-accent rounded-sm md:rounded-xl max-w-2xl w-full py-12 md:py-16 filter drop-shadow-lg min-h-screen md:min-h-0 pt-24 pb-24">
		<h1 class="text-2xl md:text-4xl font-bold text-accent-foreground font-serif">
			Cryptarithm Solver
		</h1>
		<p class="max-w-lg text-secondary-foreground">
			A cryptarithm is a mathematical puzzle where the digits in an arithmetic expression are replaced by letters of the
			alphabet. The goal is to find the correct digit for each letter so that the equation is true.
		</p>
		<div class="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
			<Button on:click={addRow} title="Add a new row to the puzzle" variant="outline">Add Row</Button>
			<Button on:click={addColumn} title="Add a new column to the puzzle" variant="outline">Add Column</Button>
		</div>
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
		<div class="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
			<Button on:click={clearForm} title="Clear the puzzle and reset the form" variant="destructive">Clear</Button>
		</div>
		<div class="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-4">
			<div class="flex items-center space-x-4">
				<select bind:value={$operator} class="p-2 border border-gray-300 rounded-md"
								title="Select the operator for the puzzle">
					{#each ['+', '-', '*', '/'] as op}
						<option value={op}>{op}</option>
					{/each}
				</select>
			</div>
			<Button class="{$isLoading ? 'cursor-not-allowed' : ''}" disabled={$isLoading} on:click={solveCryptarithm}
							title="Solve the puzzle">
				{#if $isLoading}
					<svg class="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
						<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
						<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
					</svg>
				{/if}
				Solve
			</Button>
		</div>
		{#if $successMessage}
			<p class="text-green-600 mt-4">{$successMessage}</p>
		{/if}
		{#if $error}
			<p class="text-red-600 mt-4">{$error}</p>
		{/if}
		{#if $solution}
			<pre class="text-blue-600 mt-4 whitespace-pre-wrap break-words w-full md:w-auto font-mono">{$solution}</pre>
			<p class="text-gray-600">{$timeExecution}</p>
		{/if}
	</section>
</main>
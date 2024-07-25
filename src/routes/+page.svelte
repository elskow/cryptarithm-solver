<script lang="ts">
	import { Button } from '$lib/components/ui/button';

	let expectedNumVariables = 2;
	let puzzle = Array.from({ length: expectedNumVariables + 1 }, () => Array(expectedNumVariables + 1).fill(''));
	let solution = '';
	let timeExecution = '';
	let error = '';
	let operator = '+';
	let isLoading = false;
	let successMessage = '';

	const solveCryptarithm = async () => {
		isLoading = true;
		successMessage = '';
		solution = '';
		timeExecution = '';
		error = '';
		try {
			const response = await fetch('/api/solve', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ puzzle, operator })
			});
			const result = await response.json();
			if (result.error) {
				error = result.error;
				solution = '';
				timeExecution = '';
			} else {
				solution = result.solution;
				timeExecution = `Execution time: ${(result.time / 1000).toFixed(2)}s`;
				error = '';
				successMessage = 'Solution found!';
			}
		} catch (err) {
			error = 'An error occurred while solving the puzzle.';
			solution = '';
			timeExecution = '';
		} finally {
			isLoading = false;
		}
	};

	const clearForm = () => {
		puzzle = Array.from({ length: expectedNumVariables + 1 }, () => Array(expectedNumVariables + 1).fill(''));
		solution = '';
		timeExecution = '';
		error = '';
		successMessage = '';
	};

	const addField = () => {
		expectedNumVariables++;
		puzzle = Array.from({ length: expectedNumVariables + 1 }, () => Array(expectedNumVariables + 1).fill(''));
	};

	const removeField = () => {
		if (expectedNumVariables > 2) {
			expectedNumVariables--;
			puzzle = Array.from({ length: expectedNumVariables + 1 }, () => Array(expectedNumVariables + 1).fill(''));
		}
	};

	const handleInput = (event, rowIndex, colIndex) => {
		const input = event.target;
		puzzle[rowIndex][colIndex] = input.value.replace(/[^A-Za-z]/g, '');
		if (input.value && colIndex < expectedNumVariables) {
			const nextInput = input.nextElementSibling;
			if (nextInput) nextInput.focus();
		}
	};

	const handleKeydown = (event, rowIndex, colIndex) => {
		const input = event.target;
		if (event.key === 'Backspace' && !input.value && colIndex > 0) {
			const prevInput = input.previousElementSibling;
			if (prevInput) prevInput.focus();
		}
	};
</script>

<main class="min-h-screen flex flex-col items-center p-6 bg-gray-100 justify-center pb-24">
	<section class="text-center flex flex-col items-center space-y-6 p-8 bg-white rounded-lg shadow-lg max-w-2xl w-full">
		<h1 class="text-4xl font-bold text-gray-800">Cryptarithm Solver</h1>
		<p class="max-w-lg text-gray-600">
			A cryptarithm is a mathematical puzzle where the digits in an arithmetic expression are replaced by letters of the
			alphabet. The goal is to find the correct digit for each letter so that the equation is true.
		</p>
		<div class="flex items-center space-x-4">
			<Button on:click={addField} variant="secondary">Increase Field</Button>
			<Button on:click={removeField} variant="secondary">Decrease Field</Button>
		</div>
		<div class="flex flex-col items-center space-y-4 w-full">
			{#each puzzle as row, rowIndex}
				<div class="flex space-x-2">
					{#each row as value, colIndex}
						<input
							type="text"
							class="p-2 border border-gray-300 rounded-md w-12 text-center"
							maxlength="1"
							bind:value={puzzle[rowIndex][colIndex]}
							on:input={(event) => handleInput(event, rowIndex, colIndex)}
							on:keydown={(event) => handleKeydown(event, rowIndex, colIndex)}
						/>
					{/each}
				</div>
			{/each}
			<Button on:click={clearForm} variant="destructive">Clear</Button>
		</div>
		<div class="flex items-center space-x-4">
			<div class="flex items-center space-x-4">
				<select bind:value={operator} class="p-2 border border-gray-300 rounded-md">
					{#each ['+', '-'] as op}
						<option value={op}>{op}</option>
					{/each}
				</select>
			</div>
			<Button disabled={isLoading} on:click={solveCryptarithm}>
				{#if isLoading}
					<svg class="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
						<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
						<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
					</svg>
				{/if}
				Solve
			</Button>
		</div>
		{#if successMessage}
			<p class="text-green-600 mt-4">{successMessage}</p>
		{/if}
		{#if error}
			<p class="text-red-600 mt-4">{error}</p>
		{/if}
		{#if solution}
			<p class="text-blue-600 mt-4">Solution: {solution}</p>
			<p class="text-gray-600">{timeExecution}</p>
		{/if}
	</section>
</main>
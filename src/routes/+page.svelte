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
		solvedPuzzle,
		successMessage,
		timeExecution
	} from '$lib/stores/cryptarithmStore';
	import InputGrid from '$lib/components/InputGrid.svelte';
	import { onDestroy, onMount } from 'svelte';
	import DropdownOperator from '$lib/components/DropdownOperator.svelte';

	let worker: Worker;
	let begin: number;

	onMount(() => {
		worker = new CryptarithmWorker();

		worker.onmessage = (event) => {
			const { result, error: workerError } = event.data;
			const end = Date.now();

			if (workerError) {
				error.set(workerError);
			} else {
				solution.set(result);
				timeExecution.set(`Execution time: ${(end - begin) / 1000}s`);
				successMessage.set('Solution found!');

				const resultObj = JSON.parse(result);

				const solvedPuzzleArr = $puzzle.map((row) => row.map((value) => {
					if (value === '') return '';

					return resultObj.hasOwnProperty(value) ? resultObj[value] : value;
				}));
				solvedPuzzle.set(solvedPuzzleArr);
			}

			isLoading.set(false);
		};

		document.addEventListener('keydown', handleKeyDown);

		onDestroy(() => {
			worker.terminate();
			document.removeEventListener('keydown', handleKeyDown);
		});
	});

	const solveCryptarithm = async () => {
		isLoading.set(true);
		successMessage.set('');
		solution.set('');
		solvedPuzzle.set(Array.from({ length: $numRows }, () => Array($numCols).fill('')));
		timeExecution.set('');
		error.set('');

		begin = Date.now();

		worker.postMessage({ puzzle: $puzzle, operator: $operator });
	};

	const clearForm = () => {
		numRows.set(3);
		numCols.set(3);
		puzzle.set(Array.from({ length: 3 }, () => Array(3).fill('')));
		solvedPuzzle.set(Array.from({ length: 3 }, () => Array(3).fill('')));
		solution.set('');
		timeExecution.set('');
		error.set('');
		successMessage.set('');
	};

	const addRow = () => {
		numRows.update(n => n + 1);
		puzzle.update(p => [...p, Array($numCols).fill('')]);
		solvedPuzzle.update(p => [...p, Array($numCols).fill('')]);
	};

	const addColumn = () => {
		numCols.update(n => n + 1);
		puzzle.update(p => p.map(row => [...row, '']));
		solvedPuzzle.update(p => p.map(row => [...row, '']));
	};

	const handleKeyDown = (event: KeyboardEvent) => {
		if (event.key === 'Enter') {
			solveCryptarithm();
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
		class="text-center flex flex-col items-center space-y-6 p-4 md:p-8 bg-accent rounded-sm md:rounded-xl max-w-3xl w-full py-12 md:py-16 filter drop-shadow-lg min-h-screen md:min-h-0 pt-24 pb-24">
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
		<InputGrid {numCols} {numRows} {puzzle} />
		<div class="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
			<Button on:click={clearForm} title="Clear the puzzle and reset the form" variant="destructive">Clear</Button>
		</div>
		<div class="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-4">
			<DropdownOperator {operator} />
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
		{#if solution}
			<div class="flex flex-col items-center space-y-4 mt-4">
				{#each $solvedPuzzle as row, rowIndex}
					<div class="flex flex-wrap justify-center space-x-1 md:space-x-2 font-mono font-bold">
						{#each row as value, colIndex}
							<input
								type="text"
								class="p-1.5 md:p-2 border border-gray-300 rounded-md w-12 text-center {rowIndex === $numRows - 1 ? 'border-t-4 bg-green-50/50' : ''}"
								maxlength="1"
								value={value}
								disabled
							/>
						{/each}
					</div>
				{/each}
				<p class="text-secondary-foreground">
					{$timeExecution}
				</p>
			</div>
		{/if}
	</section>
	<footer
		class="text-center text-sm text-secondary-foreground mt-8 bg-accent/20 px-6 py-2 hidden md:block filter backdrop-blur-lg rounded-xl">
		<p>
			Developed by
			<a
				class="underline underline-offset-4 hover:text-blue-800"
				href="https://helmyl.com" target="_blank"
				title="Helmy's personal website">
				Helmy
			</a> | Source code on{' '}
			<a
				class="underline underline-offset-4 hover:text-blue-800"
				href="https://github.com/elskow/cryptarithm-solver" target="_blank"
				title="Cryptarithm Solver on GitHub">
				GitHub
			</a>
			.
		</p>
	</footer>
</main>
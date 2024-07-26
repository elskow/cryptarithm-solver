import { writable } from 'svelte/store';

export const numRows = writable(3);
export const numCols = writable(3);
export const puzzle = writable(Array.from({ length: 3 }, () => Array(3).fill('')));
export const solution = writable('');
export const timeExecution = writable('');
export const error = writable('');
export const operator = writable('+');
export const isLoading = writable(false);
export const successMessage = writable('');

export const solvedPuzzle = writable(Array.from({ length: 3 }, () => Array(3).fill('')));
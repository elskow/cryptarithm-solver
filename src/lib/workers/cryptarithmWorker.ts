import { solve } from '$lib/utils/cryptarithm';

self.onmessage = (event) => {
	const { puzzle, operator } = event.data;
	try {
		const result = solve(puzzle, operator);
		self.postMessage({ result });
	} catch (error) {
		self.postMessage({ error: error.message });
	}
};

export default null as any;
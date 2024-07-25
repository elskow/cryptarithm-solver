import { json } from '@sveltejs/kit';

export async function GET() {
	const companyDetails = {
		details: {
			message: 'Its Works!'
		}
	};
	return json(companyDetails);
}

export async function POST(event) {
	const { puzzle, operator } = await event.request.json();


	try {
		const begin = Date.now();
		const solution = solve(puzzle, operator);
		const end = Date.now();
		return json({ solution, time: end - begin }, { status: 200 });
	} catch (error) {
		return json({ error: error.message }, { status: 400 });
	}
}

function solve(puzzle: string[][], operator: string): string {
	const letters = new Set<string>();
	puzzle.flat().forEach(char => {
		if (char) letters.add(char);
	});

	const uniqueLetters = Array.from(letters);
	if (uniqueLetters.length > 10) {
		throw new Error('Too many unique letters for a valid solution');
	}

	const digits = Array.from({ length: 10 }, (_, i) => i);
	const permutations = getPermutations(digits, uniqueLetters.length);

	for (const perm of permutations) {
		const assignment: { [p: string]: string } = Object.fromEntries(uniqueLetters.map((letter, i) => [letter, perm[i]]));
		if (isValidAssignment(puzzle, operator, assignment)) {
			return JSON.stringify(assignment);
		}
	}

	throw new Error('No valid solution found');
}

function getPermutations(digits: number[], length: number): number[][] {
	const result: number[][] = [];
	const stack: { perm: number[], remaining: number[] }[] = [{ perm: [], remaining: digits }];

	while (stack.length) {
		const { perm, remaining } = stack.pop()!;
		if (perm.length === length) {
			result.push(perm);
		} else {
			for (const digit of remaining) {
				stack.push({ perm: [...perm, digit], remaining: remaining.filter(d => d !== digit) });
			}
		}
	}

	return result;
}

const memo: { [key: string]: boolean } = {};

function isValidAssignment(puzzle: string[][], operator: string, assignment: { [p: string]: string }): boolean {
	const key = JSON.stringify({ puzzle, operator, assignment });
	if (memo[key] !== undefined) {
		return memo[key];
	}

	const evaluate = (expr: string[]): number => {
		return parseInt(expr.map(char => assignment[char]).join(''));
	};

	const left = evaluate(puzzle[0]);
	const right = evaluate(puzzle[1]);
	const result = evaluate(puzzle[2]);

	let isValid = false;
	if (operator === '+') {
		isValid = left + right === result;
	} else if (operator === '-') {
		isValid = left - right === result;
	} else if (operator === '*') {
		isValid = left * right === result;
	} else if (operator === '/') {
		isValid = left / right === result;
	} else {
		throw new Error('Unsupported operator');
	}

	memo[key] = isValid;
	return isValid;
}
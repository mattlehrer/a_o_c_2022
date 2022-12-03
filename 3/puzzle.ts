import { readFileSync } from 'node:fs';

const input = readFileSync('./input.txt', 'utf-8');

// split by new line
const lines = input.split('\n');

// Part 1
// priorities a-z == 1-26
// priorities A-Z == 27-52

const priority = (char: string): number => {
	const charCode = char.charCodeAt(0);
	if (charCode >= 65 && charCode <= 90) {
		return charCode - 38;
	}
	return charCode - 96;
}

console.log(priority('Z'));

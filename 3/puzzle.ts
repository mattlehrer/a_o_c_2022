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

let sum = 0;
for (const line of lines) {
	if (line.length === 0) continue;
	if (line.length % 2 !== 0) throw new Error('Odd line length');

	const [one, two] = [line.slice(0, line.length / 2), line.slice(line.length / 2)];
	const common = [...new Set(one.split('').filter(char => two.includes(char)))];
	if (common.length === 0) throw new Error('No common letter');
	if (common.length > 1) {
		console.log(line, common);
		throw new Error('More than one common letter');
	}
	sum += priority(common[0]);
}

console.log(sum);

import { readFileSync } from 'node:fs';

const input = readFileSync('./input.txt', 'utf-8');

const lines = input.split('\n');

for (const line of lines) {
	const chars = line.split('');
	let i = 4;
	while (i < chars.length) {
		const slice = chars.slice(i-4, i);
		const test = new Set(slice);
		if (test.size === 4) {
			console.log(`Found it at ${i}`);
			break;
		}
		i++;
	}
}

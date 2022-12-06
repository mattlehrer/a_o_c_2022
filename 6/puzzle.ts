import { readFileSync } from 'node:fs';

const input = readFileSync('./input.txt', 'utf-8');

const lines = input.split('\n');

for (const line of lines) {
	const chars = line.split('');
	detectMarker(chars);
	detectMarker(chars, 14, 2);
}

function detectMarker(chars: string[], length: number = 4, part: number = 1) {
	let i = length;
	while (i < chars.length) {
		const slice = chars.slice(i - length, i);
		const test = new Set(slice);
		if (test.size === length) {
			console.log(`Found part ${part} at ${i}`);
			break;
		}
		i++;
	}
}


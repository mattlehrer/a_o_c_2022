import { readFileSync } from 'node:fs';

const input = readFileSync('./input.txt', 'utf-8');

// split by new line
const lines = input.split('\n');

// Part 1
let fullyContained = 0;

for (const line of lines) {
	if (!line) {
		continue;
	}
	const [one, two] = line.split(',');
	const [min1, max1] = one.split('-').map(Number);
	const [min2, max2] = two.split('-').map(Number);

	if (
		(min1 <= min2 && max1 >= max2) // two is fully contained in one
		|| (min2 <= min1 && max2 >= max1) // one is fully contained in two
	) 
	{
		fullyContained++;
	}
}

console.log('Part 1: ', fullyContained);
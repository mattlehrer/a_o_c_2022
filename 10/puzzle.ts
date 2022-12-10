import { readFileSync } from 'node:fs';

const input = readFileSync('./input.txt', 'utf-8');

const lines = input.split('\n');

let cycle = 1;
let x = 1;
let strengthSum = 0;
const notableStrengths: { cycle: number; x: number }[] = [];

for (const line of lines) {
	if (!line) continue;
	if ((cycle - 20) % 40 === 0) {
		notableStrengths.push({ cycle, x });
		strengthSum += cycle * x;
	}
	if (line === 'noop') {
		cycle++;
	} else {
		const [add, num] = line.split(' ');
		if (add !== 'addx') throw new Error('Invalid op: ' + add);
		cycle++;
		if ((cycle - 20) % 40 === 0) {
			notableStrengths.push({ cycle, x });
			strengthSum += cycle * x;
		}
		cycle++;
		x += Number(num);
	}
}
console.log('Part 1:', strengthSum);

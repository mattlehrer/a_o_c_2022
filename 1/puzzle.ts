import { readFileSync } from 'node:fs';

const input = readFileSync('./puzzle_input.txt', 'utf-8');

// split by new line
const lines = input.split('\n');
console.log(lines.length);

// create array of each elf's calories
const caloriesByElf: number[] = [];
let currentElf = 0;
for (let i = 0; i < lines.length; i++) {
	if (lines[i] === '') {
		caloriesByElf.push(currentElf);
		currentElf = 0;
	} else {
		currentElf += parseInt(lines[i]);
	}
}
caloriesByElf.push(currentElf);

console.log(caloriesByElf.length);
console.log(caloriesByElf.sort((a,b)=>a-b).reverse()[0]);
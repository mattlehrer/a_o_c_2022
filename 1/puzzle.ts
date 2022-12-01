import { readFileSync } from 'node:fs';

const input = readFileSync('./puzzle_input.txt', 'utf-8');

// split by new line
const lines = input.split('\n');

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
// no new line at end of file
caloriesByElf.push(currentElf);

console.log('Number of elves:', caloriesByElf.length);
const caloriesByElfSorted = caloriesByElf.sort((a, b) => a - b).reverse();
console.log('Calories carried by top elf: ', caloriesByElfSorted[0]);
console.log('Calories carried by top 3 elves: ', caloriesByElfSorted.slice(0, 3).reduce((a, b) => a + b, 0));
import { readFileSync } from 'node:fs';

const input = readFileSync('./input.txt', 'utf-8');

const lines = input.split('\n');

let i = 0;
let rightOrderSumOfIndices = 0;

while (i < lines.length - 1) {
	const [left, right] = [JSON.parse(lines[i]), JSON.parse(lines[i + 1])];
	if (isOrdered(left, right)) {
		rightOrderSumOfIndices += Math.floor(i / 3) + 1;
	}
	i = i + 3;
}

console.log('Part 1', rightOrderSumOfIndices);

const newInput = [
	...lines.filter((line) => line !== '' && line !== '\r').map((line) => JSON.parse(line)),
	[[2]],
	[[6]],
];

const sorted = newInput.sort((a, b) => (isOrdered(a, b) ? -1 : 1));
const two = sorted.findIndex((line) => JSON.stringify(line) === JSON.stringify([[2]])) + 1;
const six = sorted.findIndex((line) => JSON.stringify(line) === JSON.stringify([[6]])) + 1;
console.log('Part 2', two * six);

function isOrdered(
	left: number | number[] | undefined,
	right: number | number[] | undefined,
): boolean {
	// same number or both undefined or just left undefined
	if (left === right || left === undefined) {
		return true;
	}
	if (right === undefined) {
		return false;
	}
	if (typeof left === 'number' && typeof right === 'number') {
		return left < right; // equal handled above
	}
	if (Array.isArray(left) && typeof right === 'number') {
		return isOrdered(left, [right]);
	}
	if (typeof left === 'number' && Array.isArray(right)) {
		return isOrdered([left], right);
	}
	if (Array.isArray(left) && Array.isArray(right)) {
		const leftCopy = [...left];
		const rightCopy = [...right];
		let compareLeft = leftCopy.shift();
		let compareRight = rightCopy.shift();
		while (
			compareLeft === compareRight &&
			compareLeft !== undefined &&
			compareRight !== undefined
		) {
			compareLeft = leftCopy.shift();
			compareRight = rightCopy.shift();
		}
		return isOrdered(compareLeft, compareRight);
	}
	throw new Error('Invalid input');
}

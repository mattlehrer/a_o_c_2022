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

console.log(rightOrderSumOfIndices);

function isOrdered(left: number | number[] | undefined, right: number | number[] | undefined) {
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
		let compareLeft = left.shift();
		let compareRight = right.shift();
		while (
			compareLeft === compareRight &&
			compareLeft !== undefined &&
			compareRight !== undefined
		) {
			compareLeft = left.shift();
			compareRight = right.shift();
		}
		return isOrdered(compareLeft, compareRight);
	}
}

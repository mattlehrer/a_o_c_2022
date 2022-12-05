import { readFileSync } from 'node:fs';

const input = readFileSync('./input.txt', 'utf-8');

const lines = input.split('\n');

const stacksInput: string[] = [];

let i = 0;
while (lines[i] !== '') {
	stacksInput.push(lines[i]);
	i++;
}

const movesInput = lines.splice(i+1);

const stackNumbersInput: string = stacksInput[stacksInput.length - 1];
const stackNumbersArray: string[] = stackNumbersInput.split('').filter((_, i) => i % 4 === 1);
const numberOfStacks = parseInt(stackNumbersArray[stackNumbersArray.length - 1]);

part1: {

const stacks: string[][] = [];
for (let n = 0; n < numberOfStacks; n++) {
	stacks.push([]);
}

for (let j = stacksInput.length - 2; j >= 0; j--) {
	const row = parseStackInput(stacksInput[j]);
	for (let k = 0; k < row.length; k++) {
		if (row[k] !== ' ') stacks[k].push(row[k]);
	}
}

for (const move of movesInput) {
	if (!move) continue;
	const [crates, fromNatural, toNatural] = parseMoveInput(move);
	const from = fromNatural - 1;
	const to = toNatural - 1;
	for (let n = 0; n < crates; n++) {
		if (stacks[from].length === 0) throw new Error('Invalid move: no crates to move');
		stacks[to].push(stacks[from].pop()!);
	}
}

const part1 = stacks.reduce((acc, stack) => acc + stack[stack.length - 1], '');
console.log('part 1: ', part1);
}

part2: {
	const stacks: string[][] = [];
for (let n = 0; n < numberOfStacks; n++) {
	stacks.push([]);
}

for (let j = stacksInput.length - 2; j >= 0; j--) {
	const row = parseStackInput(stacksInput[j]);
	for (let k = 0; k < row.length; k++) {
		if (row[k] !== ' ') stacks[k].push(row[k]);
	}
}

for (const move of movesInput) {
	if (!move) continue;
	const [crates, fromNatural, toNatural] = parseMoveInput(move);
	const from = fromNatural - 1;
	const to = toNatural - 1;
	const tempStack: string[] = [];
	for (let n = 0; n < crates; n++) {
		if (stacks[from].length === 0) throw new Error('Invalid move: no crates to move');
		tempStack.push(stacks[from].pop()!);
	}
	tempStack.reverse();
	stacks[to].push(...tempStack);
}

const part2 = stacks.reduce((acc, stack) => acc + stack[stack.length - 1], '');
console.log('part 2: ', part2);
}

function parseStackInput(stackInput: string): string[] {
	// split it and return the 2nd and then every 4th element
	// this will return ' ' for empty stack spots
	return stackInput.split('').filter((_, i) => i % 4 === 1);
}

function parseMoveInput(moveInput: string): [crates: number, from: number, to: number] {
	const parsed = moveInput.match(/(\d+)/gm)
	if (parsed?.length !== 3 || parsed.every(n => typeof n === 'number')) throw new Error('Invalid move input');
	const output = parsed.map((n) => parseInt(n));
	return output as [number, number, number];
}

import { readFileSync } from 'node:fs';

const MAX_ROCKS = 3;
console.time('Part 1');
const file: './test.txt' | './input.txt' = './test.txt';
const input = readFileSync(file, 'utf-8');

const lines = input.split('\n').slice(0, -1);

const rocks = `####

.#.
###
.#.

..#
..#
###

#
#
#
#

##
##`
	.split('\n\n')
	.map((r) => r.split('\n'));

// console.log(rocks);

const cave = ['-------'];
// console.log(cave);

let c = 0;
while (c < MAX_ROCKS) {
	let next = seq();
	let { rock, jetPush } = next;
	// const [rock, jetPush] = [rockSeq().next().value, jetPushSeq().next().value];
	if (!rock) break;
	cave.unshift('.......');
	cave.unshift('.......');
	cave.unshift('.......');
	rock
		.reverse()
		.forEach((r) =>
			cave.unshift(['.', '.', ...r, ...Array.from({ length: 5 - r.length }, () => '.')].join('')),
		);
	next = seq();
	c++;
	// next.rock = undefined;
}
console.log(cave.join('\n'));

console.log('Part 1', 'answer');
console.timeEnd('Part 1');

console.time('Part 2');

console.log('Part 2');

console.timeEnd('Part 2');

function canBePushedRight(rock: string[][], cave: string[][], x: number, y: number) {
	const rockWidth = rock[0].length;
	const rockHeight = rock.length;
	const caveWidth = cave[0].length;

	if (x + rockWidth > caveWidth) {
		return false;
	}

	for (let i = 0; i < rockHeight; i++) {
		for (let j = 0; j < rockWidth; j++) {
			if (rock[i][j] === '#' && cave[y + i][x + j] === '#') {
				return false;
			}
		}
	}

	return true;
}

function canBePushedLeft(rock: string[][], cave: string[][], x: number, y: number) {
	const rockWidth = rock[0].length;
	const rockHeight = rock.length;

	if (x - rockWidth < 0) {
		return false;
	}

	for (let i = 0; i < rockHeight; i++) {
		for (let j = 0; j < rockWidth; j++) {
			if (rock[i][j] === '#' && cave[y + i][x - j] === '#') {
				return false;
			}
		}
	}

	return true;
}

function canFall(rock: string[][], cave: string[][], x: number, y: number) {
	const rockWidth = rock[0].length;
	const rockHeight = rock.length;
	const caveHeight = cave.length;

	if (y + rockHeight > caveHeight) {
		return false;
	}

	for (let i = 0; i < rockHeight; i++) {
		for (let j = 0; j < rockWidth; j++) {
			if (rock[i][j] === '#' && cave[y + i][x + j] === '#') {
				return false;
			}
		}
	}

	return true;
}

function seq() {
	return { rock: rockSeq().next().value, jetPush: jetPushSeq().next().value };
}

function* rockSeq() {
	while (true) {
		yield rocks[c];
		c = (c + 1) % rocks.length;
	}
}

function* jetPushSeq() {
	while (true) {
		yield lines[0][c];
		c = (c + 1) % lines.length;
	}
}

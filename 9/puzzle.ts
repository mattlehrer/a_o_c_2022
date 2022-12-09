import { readFileSync } from 'node:fs';
import compare from 'just-compare';

const input = readFileSync('./input.txt', 'utf-8');

const lines = input.split('\n');

type Position = {
	x: number;
	y: number;
};

type Direction = 'U' | 'R' | 'D' | 'L';

const tailHasVisited: Position[] = [];
let currentTailPosition: Position = { x: 0, y: 0 };
let currentHeadPosition: Position = { x: 0, y: 0 };

for (const line of lines) {
	const [direction, stepsString] = line.split(' ');
	const steps = Number(stepsString);
	if (Number.isNaN(steps)) throw new Error('Invalid steps: ' + stepsString);
	if (!isDirection(direction)) throw new Error('Invalid direction: ' + direction);
	for (let i = 0; i < steps; i++) {
		currentHeadPosition = moveHead(currentHeadPosition, direction);
		currentTailPosition = moveTail(currentHeadPosition, currentTailPosition);
		addIfUnique(tailHasVisited, currentTailPosition);
	}
}

console.log('Part 1:', tailHasVisited.length);

function moveHead(h: Position, d: Direction): Position {
	let newH = { ...h };
	switch (d) {
		case 'U':
			newH.y += 1;
			break;
		case 'R':
			newH.x += 1;
			break;
		case 'D':
			newH.y -= 1;
			break;
		case 'L':
			newH.x -= 1;
			break;
	}
	return newH;
}

function areTouching(h: Position, t: Position): boolean {
	return Math.abs(h.x - t.x) <= 1 && Math.abs(h.y - t.y) <= 1;
}

function moveTail(h: Position, t: Position): Position {
	if (areTouching(h, t)) return t;
	if (h.x === t.x) {
		return {
			x: t.x,
			y: h.y > t.y ? t.y + 1 : t.y - 1,
		};
	} else if (h.y === t.y) {
		return {
			x: h.x > t.x ? t.x + 1 : t.x - 1,
			y: t.y,
		};
	} else {
		return {
			x: h.x > t.x ? t.x + 1 : t.x - 1,
			y: h.y > t.y ? t.y + 1 : t.y - 1,
		};
	}
}

function addIfUnique(set: Position[], position: Position) {
	if (!set.some((p) => compare(p, position))) {
		set.push(position);
	}
}

function isDirection(d: string): d is Direction {
	return ['U', 'R', 'D', 'L'].includes(d);
}

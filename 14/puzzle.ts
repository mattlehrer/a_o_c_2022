import { readFileSync } from 'node:fs';
import clone from 'just-clone';

console.time('Part 1');
const input = readFileSync('./input.txt', 'utf-8');

const lines = input.split('\n');

// construct map of rock
const origMap: string[][] = [[]];
origMap[0] = [];
origMap[0][500] = '+';
let minX = 500;
let maxX = 500;
let maxY = 0;
for (const line of lines) {
	const points = line.split(' -> ');
	let [x1, y1] = points.shift()?.split(',').map(Number)!;
	minX = Math.min(minX, x1);
	maxX = Math.max(maxX, x1);
	maxY = Math.max(maxY, y1);
	while (points.length) {
		let [x2, y2] = points.shift()?.split(',').map(Number)!;
		if (x1 === x2) {
			// vertical
			for (let y = Math.min(y1, y2); y <= Math.max(y1, y2); y++) {
				if (!origMap[y]) origMap[y] = [];
				origMap[y][x1] = '#';
			}
		} else if (y1 === y2) {
			// horizontal
			if (!origMap[y1]) origMap[y1] = [];
			for (let x = Math.min(x1, x2); x <= Math.max(x1, x2); x++) {
				origMap[y1][x] = '#';
			}
		}
		minX = Math.min(minX, x2);
		maxX = Math.max(maxX, x2);
		maxY = Math.max(maxY, y2);
		x1 = x2;
		y1 = y2;
	}
}

for (let y = 0; y <= maxY; y++) {
	for (let x = minX; x <= maxX; x++) {
		if (!origMap[y]) origMap[y] = [];
		if (!origMap[y][x]) origMap[y][x] = '.';
	}
}

const map = origMap.map((row) => row.slice(minX));
const start = map[0].indexOf('+');

const sandMap = clone(map);
console.log('Part 1', sandFall(sandMap, start, 0));

console.timeEnd('Part 1');

console.time('Part 2');

const mapWithFloor = clone(origMap);
mapWithFloor[maxY + 1] = [];
mapWithFloor[maxY + 2] = [];
for (let i = 500 - 10 * (500 - minX); i < 500 + 10 * (maxX - 500); i++) {
	for (let y = 0; y <= maxY; y++) {
		if (!mapWithFloor[y][i]) mapWithFloor[y][i] = '.';
	}
	mapWithFloor[maxY + 1][i] = '.';
	mapWithFloor[maxY + 2][i] = '#';
}

console.log('Part 2', sandFall2(mapWithFloor, mapWithFloor[0].indexOf('+'), 0));

console.timeEnd('Part 2');

function sandFall2(map: string[][], startX: number, startY: number): number {
	let amountOfSand = 0;
	let nextX: number | undefined, nextY: number | undefined;

	try {
		while (!(nextX === 500 && nextY === 0)) {
			[nextX, nextY] = canFallTo2(map, startX, startY);
			map[nextY][nextX] = 'o';
			amountOfSand++;
		}
	} catch (error) {
		console.log(error);
		// printmap(map);
	}

	return amountOfSand;
}

function canFallTo2(map: string[][], currentX: number, currentY: number): [number, number] {
	// can fall straight down
	if (!['o', '#'].includes(map[currentY + 1][currentX]))
		return canFallTo2(map, currentX, currentY + 1);
	// can fall down left
	if (!['o', '#'].includes(map[currentY + 1][currentX - 1]))
		return canFallTo2(map, currentX - 1, currentY + 1);
	// can fall down right
	if (!['o', '#'].includes(map[currentY + 1][currentX + 1]))
		return canFallTo2(map, currentX + 1, currentY + 1);
	// can't fall
	return [currentX, currentY];
}

function printmap(map: string[][]) {
	console.log();
	console.log(map.map((row) => row.join('')).join('\n'));
	console.log();
}

function sandFall(map: string[][], startX: number, startY: number): number {
	let amountOfSand = 0;
	let [nextX, nextY] = [startX, startY];

	try {
		while (true) {
			[nextX, nextY] = canFallTo(map, startX, startY);
			map[nextY][nextX] = 'o';
			amountOfSand++;
		}
	} catch (error) {
		printmap(map);
	}

	return amountOfSand;
}

function canFallTo(map: string[][], currentX: number, currentY: number): [number, number] {
	// can fall straight down
	if (map[currentY + 1][currentX] === '.') return canFallTo(map, currentX, currentY + 1);
	if (currentX - 1 < 0) throw new Error('out of bounds');
	// can fall down left
	if (map[currentY + 1][currentX - 1] === '.') return canFallTo(map, currentX - 1, currentY + 1);
	if (currentX + 1 === map[0].length) throw new Error('out of bounds');
	// can fall down right
	if (map[currentY + 1][currentX + 1] === '.') return canFallTo(map, currentX + 1, currentY + 1);
	// can't fall
	return [currentX, currentY];
}

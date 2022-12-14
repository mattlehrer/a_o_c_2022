import { readFileSync } from 'node:fs';

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

console.log('Part 1', sandFall(map, start, 0));

console.timeEnd('Part 1');

console.time('Part 2');
console.log('Part 2');

console.timeEnd('Part 2');

function sandFall(map: string[][], startX: number, startY: number): number {
	let amountOfSand = 0;
	let [nextX, nextY] = [startX, startY];

	try {
		while (true) {
			[nextX, nextY] = canFallTo(startX, startY);
			map[nextY][nextX] = 'o';
			amountOfSand++;
		}
	} catch (error) {}

	return amountOfSand;
}

function canFallTo(currentX: number, currentY: number): [number, number] {
	// can fall straight down
	if (map[currentY + 1][currentX] === '.') return canFallTo(currentX, currentY + 1);
	if (currentX - 1 < 0) throw new Error('out of bounds');
	// can fall down left
	if (map[currentY + 1][currentX - 1] === '.') return canFallTo(currentX - 1, currentY + 1);
	if (currentX + 1 === map[0].length) throw new Error('out of bounds');
	// can fall down right
	if (map[currentY + 1][currentX + 1] === '.') return canFallTo(currentX + 1, currentY + 1);
	// can't fall
	return [currentX, currentY];
}

function printmap(map: string[][]) {
	console.log();
	console.log(map.map((row) => row.join('')).join('\n'));
	console.log();
}

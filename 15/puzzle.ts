import { readFileSync } from 'node:fs';
import clone from 'just-clone';

console.time('Part 1');
const input = readFileSync('./test.txt', 'utf-8');

const lines = input.split('\n');

const locations: SensorAndBeacon[] = [];
for (const line of lines) {
	const matches = line.matchAll(
		/^Sensor at x=(-?\d*), y=(-?\d*): closest beacon is at x=(-?\d*), y=(-?\d*)$/g,
	);
	const [, x, y, bx, by] = [...matches][0];
	locations.push([parseInt(x), parseInt(y), parseInt(bx), parseInt(by)]);
}

const targetRowHits = new Set<number>();
const targetRow = 10;
for (const [x, y, bx, by] of locations) {
	const d = getDistance([x, y], [bx, by]);
	if (y - d <= targetRow && y + d >= targetRow) {
		range(x - d - Math.abs(y - by), x + d + 1 - Math.abs(y - by)).forEach((x) =>
			targetRowHits.add(x),
		);
		if (by === targetRow) targetRowHits.delete(bx);
	}
}

console.log('Part 1', targetRowHits.size);
console.timeEnd('Part 1');

// console.time('Part 2');

// console.log('Part 2', '');
// console.timeEnd('Part 2');

type SensorAndBeacon = [number, number, number, number];

function getDistance([x1, y1]: [number, number], [x2, y2]: [number, number]) {
	return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}

function range(start: number, end: number): number[] {
	const length = end - start;
	return Array.from({ length }, (_, i) => start + i);
}

import { readFileSync } from 'node:fs';

console.time('Part 1');
const input = readFileSync('./input.txt', 'utf-8');

const lines = input.split('\n');

const locations: SensorAndBeacon[] = [];
for (const line of lines) {
	const matches = line.matchAll(
		/^Sensor at x=(-?\d*), y=(-?\d*): closest beacon is at x=(-?\d*), y=(-?\d*)$/g,
	);
	const [, x, y, bx, by] = [...matches][0];
	locations.push([parseInt(x), parseInt(y), parseInt(bx), parseInt(by)]);
}

// const targetRowHits = new Set<number>();
// const targetRow = 2000000;
// for (const [x, y, bx, by] of locations) {
// 	const d = getDistance([x, y], [bx, by]);
// 	if (y - d <= targetRow && y + d >= targetRow) {
// 		const yDiff = Math.abs(y - targetRow);
// 		const xRange = range(x - (d - yDiff), x + (d - yDiff) + 1);
// 		// console.log({ x, y, bx, by, d, xRange });
// 		xRange.forEach((i) => targetRowHits.add(i));
// 	}
// }
// for (const [, , bx, by] of locations) {
// 	if (by === targetRow) {
// 		targetRowHits.delete(bx);
// 	}
// }

// console.log('Part 1', targetRowHits.size);
console.timeEnd('Part 1');

console.time('Part 2');

const MIN = 0;
const MAX = 4_000_000;
// const MAX = 20;
const TUNING_X_MULTIPLIER = 4_000_000;

for (let i = MIN; i <= MAX; i++) {
	const row = new Set<number>();
	for (const [x, y, bx, by] of locations) {
		const d = getDistance([x, y], [bx, by]);
		if (y - d <= i && y + d >= i) {
			const yDiff = Math.abs(y - i);
			const xRange = range(Math.max(x - (d - yDiff), MIN), Math.min(x + (d - yDiff) + 1, MAX + 1));
			// console.log({ x, y, bx, by, d, xRange });
			xRange.forEach((j) => row.add(j));
		}
	}
	for (const [x, y, bx, by] of locations) {
		if (by === i && bx >= MIN && bx <= MAX) {
			row.add(bx);
		}
		if (y === i && x >= MIN && x <= MAX) {
			row.add(x);
		}
	}
	if (row.size !== MAX + 1) {
		const y = i;
		const x = (MAX * (MAX + 1)) / 2 - [...row].reduce((a, b) => a + b, 0);

		console.log('Part 2', x * TUNING_X_MULTIPLIER + y);
		break;
	}
}

console.timeEnd('Part 2');

type SensorAndBeacon = [number, number, number, number];

function getDistance([x1, y1]: [number, number], [x2, y2]: [number, number]) {
	return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}

function range(start: number, end: number): number[] {
	const length = end - start;
	return Array.from({ length }, (_, i) => start + i);
}

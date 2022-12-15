import { readFileSync } from 'node:fs';
import { exit } from 'node:process';

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

const targetRowHits = new Set<number>();
const targetRow = 2000000;
for (const [x, y, bx, by] of locations) {
	const d = getDistance([x, y], [bx, by]);
	if (y - d <= targetRow && y + d >= targetRow) {
		const yDiff = Math.abs(y - targetRow);
		const xRange = range(x - (d - yDiff), x + (d - yDiff) + 1);
		// console.log({ x, y, bx, by, d, xRange });
		xRange.forEach((i) => targetRowHits.add(i));
	}
}
for (const [, , bx, by] of locations) {
	if (by === targetRow) {
		targetRowHits.delete(bx);
	}
}

console.log('Part 1', targetRowHits.size);
console.timeEnd('Part 1');

console.time('Part 2');

const MIN = 0;
const MAX = 4_000_000;
// const MAX = 20;
const TUNING_X_MULTIPLIER = 4_000_000;

const possiblePoints: Set<string> = new Set();
for (const [x, y, bx, by] of locations) {
	const d = getDistance([x, y], [bx, by]);
	for (let r = Math.max(MIN, y - d - 1); r <= Math.min(MAX, y + d + 1); r++) {
		const left = x - 1 - (d - Math.abs(y - r));
		if (left >= MIN && !isInSensorRange({ px: left, py: r, data: locations })) {
			console.log('Part 2', left * TUNING_X_MULTIPLIER + r);
			console.timeEnd('Part 2');
			exit(0);
			// possiblePoints.add(`${left}_${r}`);
		}
		const right = x + 1 + (d - Math.abs(y - r));
		if (right <= MAX && !isInSensorRange({ px: right, py: r, data: locations })) {
			console.log('Part 2', right * TUNING_X_MULTIPLIER + r);
			console.timeEnd('Part 2');
			exit(0);
			// possiblePoints.add(`${right}_${r}`);
		}
	}
}
// const [x, y] = [...possiblePoints][0].split('_').map(Number);
// console.log({ x, y });
// console.log('Part 2', x * TUNING_X_MULTIPLIER + y);

console.timeEnd('Part 2');

type SensorAndBeacon = [number, number, number, number];

function getDistance([x1, y1]: [number, number], [x2, y2]: [number, number]) {
	return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}

function range(start: number, end: number): number[] {
	const length = end - start;
	return Array.from({ length }, (_, i) => start + i);
}

function isInSensorRange({
	px,
	py,
	data,
}: {
	px: number;
	py: number;
	data: SensorAndBeacon[];
}): boolean {
	for (const [x, y, bx, by] of data) {
		const d = getDistance([x, y], [bx, by]);
		if (getDistance([x, y], [px, py]) <= d) {
			return true;
		}
	}
	return false;
}

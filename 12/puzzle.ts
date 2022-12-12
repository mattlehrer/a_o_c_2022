import { readFileSync } from 'node:fs';

const input = readFileSync('./test.txt', 'utf-8');

const lines = input.split('\n');

// convert to 2d array
const map = lines.map((line) => line.split(''));
const MAP_HEIGHT = map.length;
const MAP_WIDTH = map[0].length;

let start: Position | undefined = undefined;
let end: Position | undefined = undefined;

// construct adjacency map, true if there is a path from x1,y1 to x2,y2
const adjacencyMap = new Map<string, Map<string, boolean>>();

for (let y = 0; y < MAP_HEIGHT; y++) {
	for (let x = 0; x < MAP_WIDTH; x++) {
		if (map[y][x] === 'E') {
			// handle end
			end = { x, y };
		} else {
			if (map[y][x] === 'S') {
				start = { x, y };
			}

			const current = map[y][x] === 'S' ? 'a' : map[y][x];
			const position = { x, y };
			const adjacentPositions = new Map<string, boolean>();
			for (let y2 = y - 1; y2 <= y + 1; y2++) {
				for (let x2 = x - 1; x2 <= x + 1; x2++) {
					if (y2 < 0 || y2 >= MAP_HEIGHT || x2 < 0 || x2 >= MAP_WIDTH || (x === x2 && y === y2))
						continue;
					if (y2 !== y && x2 !== x) continue; // only allow horizontal and vertical movement (no diagonals)
					const position2 = { x: x2, y: y2 };
					const adjacent = map[y2][x2] === 'E' ? 'z' : map[y2][x2];
					const currHeight = current.charCodeAt(0);
					const adjHeight = adjacent.charCodeAt(0);
					if (adjHeight === currHeight || adjHeight === currHeight + 1) {
						adjacentPositions.set(JSON.stringify(position2), true);
					} else {
						adjacentPositions.set(JSON.stringify(position2), false);
					}
				}
			}
			adjacencyMap.set(JSON.stringify(position), adjacentPositions);
		}
	}
}

type Position = { x: number; y: number };

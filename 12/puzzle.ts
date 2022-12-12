import { readFileSync } from 'node:fs';

const input = readFileSync('./input.txt', 'utf-8');

const lines = input.split('\n');

// convert to 2d array
const map = lines.map((line) => line.split(''));
const MAP_HEIGHT = map.length;
const MAP_WIDTH = map[0].length;
const str = JSON.stringify;

let start: Position | undefined = undefined;
let end: Position | undefined = undefined;

const possibleStarts: Position[] = [];

// construct adjacency map, true if there is a path from x1,y1 to x2,y2
const adjacencyMap: AdjacencyMap = new Map();

for (let y = 0; y < MAP_HEIGHT; y++) {
	for (let x = 0; x < MAP_WIDTH; x++) {
		if (map[y][x] === 'E') {
			// handle end
			end = { x, y };
			adjacencyMap.set(str(end), []);
		} else {
			if (map[y][x] === 'S') {
				start = { x, y };
			} else if (map[y][x] === 'a') {
				possibleStarts.push({ x, y });
			}

			const current = map[y][x] === 'S' ? 'a' : map[y][x];
			const position: Position = { x, y };
			const adjacentPositions: Position[] = [];
			for (let y2 = y - 1; y2 <= y + 1; y2++) {
				for (let x2 = x - 1; x2 <= x + 1; x2++) {
					if (y2 < 0 || y2 >= MAP_HEIGHT || x2 < 0 || x2 >= MAP_WIDTH || (x === x2 && y === y2))
						continue;
					if (y2 !== y && x2 !== x) continue; // only allow horizontal and vertical movement (no diagonals)
					const position2: Position = { x: x2, y: y2 };
					const adjacent = map[y2][x2] === 'E' ? 'z' : map[y2][x2];
					const currHeight = current.charCodeAt(0);
					const adjHeight = adjacent.charCodeAt(0);
					if (adjHeight <= currHeight + 1) {
						adjacentPositions.push(position2);
					}
				}
			}
			adjacencyMap.set(str(position), adjacentPositions);
		}
	}
}

let minStartDistance = shortestPath(start!, end!, adjacencyMap);
console.log('Part 1:', minStartDistance);

for (let i = 0; i < possibleStarts.length; i++) {
	const possibleStart = possibleStarts[i];
	const distance = shortestPath(possibleStart!, end!, adjacencyMap);
	if (distance < minStartDistance) {
		minStartDistance = distance;
		console.log('New min:', minStartDistance, 'To go:', possibleStarts.length - i);
	}
}
console.log('Part 2:', minStartDistance);

type AdjacencyMap = Map<string, Position[]>;
type Position = { x: number; y: number };

function shortestPath(start: Position, endPos: Position, graph: AdjacencyMap) {
	const unvisited: Set<string> = new Set();
	const tentativeDistances: Map<string, number> = new Map();
	for (let x = 0; x < MAP_WIDTH; x++) {
		for (let y = 0; y < MAP_HEIGHT; y++) {
			// mark all nodes unvisited
			unvisited.add(str({ x, y }));
			// set all distances to infinity
			tentativeDistances.set(str({ x, y }), Infinity);
		}
	}
	// set start distance to 0
	tentativeDistances.set(str(start), 0);

	let current = str(start);
	const end = str(endPos);

	while (current) {
		for (const neighborPos of graph.get(current)!) {
			const neighbor = str(neighborPos);
			// consider only unvisited neighbors
			if (!unvisited.has(neighbor)) continue;
			// calculate distance from start through current to neighbor
			const distance = tentativeDistances.get(current)! + 1;
			// if distance is less than current distance, update current distance
			if (distance < tentativeDistances.get(neighbor)!) {
				tentativeDistances.set(neighbor, distance);
			}
		}
		// mark current as visited
		unvisited.delete(current);

		// if end is visited, we're done
		if (!unvisited.has(end)) break;

		// find next node to visit
		let minDistance = Infinity;
		for (const node of unvisited) {
			const distance = tentativeDistances.get(node)!;
			if (distance < minDistance) {
				minDistance = distance;
				current = node;
			}
		}
		if (minDistance === Infinity) {
			return Infinity;
		}
	}

	return tentativeDistances.get(end)!;
}

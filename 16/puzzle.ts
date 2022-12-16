import { readFileSync } from 'node:fs';

console.time('Part 1');
const file: './test.txt' | './input.txt' = './test.txt';
const input = readFileSync(file, 'utf-8');

const lines = input.split('\n');

const valves = new Map<string, Valve>();
for (const line of lines) {
	const matches = line.matchAll(/^Valve (\w{2}) has flow rate=(-?\d*);[a-z ]* (.*?)$/gm);
	const [, name, rate, pathsString] = [...matches][0];
	valves.set(name, {
		rate: parseInt(rate),
		paths: pathsString.split(', ') as [string],
	});
}

const valvesWithFlow = [...valves].filter(([, valve]) => valve.rate > 0);

// console.log(valves);

// create a graph of the nodes and paths with Floyd-Warshall
const dist: number[][] = [];
for (const [name, valve] of valves) {
	dist[name] = [];
	for (const [name2] of valves) {
		if (name === name2) {
			dist[name][name2] = 0;
		} else if (valve.paths.includes(name2)) {
			dist[name][name2] = 1;
		} else {
			dist[name][name2] = Infinity;
		}
	}
}
for (const k of valves.keys()) {
	for (const i of valves.keys()) {
		for (const j of valves.keys()) {
			dist[i][j] = Math.min(dist[i][j], dist[i][k] + dist[k][j]);
		}
	}
}
// console.log(dist);

function search({ timeLeft = 30, currentValve = 'AA', v = valvesWithFlow }): number {
	let max = 0;
	for (const [name, valve] of v) {
		if (dist[currentValve][name] < timeLeft) {
			max = Math.max(
				max,
				valves.get(name)!.rate * (timeLeft - dist[currentValve][name] - 1) +
					search({
						timeLeft: timeLeft - dist[currentValve][name] - 1,
						currentValve: name,
						v: [...v].filter(([key]) => key !== name),
					}),
			);
		}
	}
	return max;
}

console.log('Part 1', search({ timeLeft: 30 }));
console.timeEnd('Part 1');

console.time('Part 2');
console.log('Part 2');

console.timeEnd('Part 2');

type Valve = { rate: number; paths: [string] };

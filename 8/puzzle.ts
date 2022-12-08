import { readFileSync } from 'node:fs';

const input = readFileSync('./input.txt', 'utf-8');

const lines = input.split('\n');

const rows = lines.map((line) => line.split('').map(Number));

// transpose
const columns = rows[0].map((_, colIndex) => rows.map((row) => row[colIndex]));

let visible = 0;

for (let i = 0; i < rows.length; i++) {
	for (let j = 0; j < rows[0].length; j++) {
		const tree = rows[i][j];
		const treesToLeft = rows[i].slice(0, j);
		const treesToRight = rows[i].slice(j + 1);
		const treesAbove = columns[j].slice(0, i);
		const treesBelow = columns[j].slice(i + 1);
		if (
			treesAbove.every((h) => tree > h) ||
			treesBelow.every((h) => tree > h) ||
			treesToLeft.every((h) => tree > h) ||
			treesToRight.every((h) => tree > h)
		) {
			visible++;
		}
	}
}

console.log(visible);

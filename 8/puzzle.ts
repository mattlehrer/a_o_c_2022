import { readFileSync } from 'node:fs';

const input = readFileSync('./input.txt', 'utf-8');

const lines = input.split('\n');

const rows = lines.map((line) => line.split('').map(Number));

// transpose
const columns = rows[0].map((_, colIndex) => rows.map((row) => row[colIndex]));

// Part 1
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

console.log('Part 1', visible);

// Part 2
let highestScenicScore = 0;
for (let y = 0; y < rows.length; y++) {
	for (let x = 0; x < rows[0].length; x++) {
		const tree = rows[y][x];
		const treesToLeft = rows[y].slice(0, x).reverse();
		const treesToRight = rows[y].slice(x + 1);
		const treesAbove = columns[x].slice(0, y).reverse();
		const treesBelow = columns[x].slice(y + 1);
		let scenicScore = 0;
		if (y in [0, rows.length - 1] || x in [0, rows[0].length - 1]) {
			scenicScore = 0;
		} else {
			const seeLeft = viewableTrees(tree, treesToLeft);
			const seeRight = viewableTrees(tree, treesToRight);
			const seeAbove = viewableTrees(tree, treesAbove);
			const seeBelow = viewableTrees(tree, treesBelow);
			scenicScore = seeLeft * seeRight * seeAbove * seeBelow;
		}
		if (scenicScore > highestScenicScore) {
			highestScenicScore = scenicScore;
		}
	}
}
console.log('Part 2', highestScenicScore);

function viewableTrees(treeHeight: number, inFront: number[]) {
	if (inFront.length === 0) return 0;
	let viewable = 1;
	let i = 0;
	while (i < inFront.length - 1 && inFront[i] < treeHeight) {
		viewable++;
		i++;
	}
	return viewable;
}

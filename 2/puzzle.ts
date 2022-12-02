import { readFileSync } from 'node:fs';

const pointsForThrow = {
	X: 1, // rock
	Y: 2, // paper
	Z: 3, // scissors
}

const pointsForOutcome = {
	lose: 0,
	draw: 3,
	win: 6,
}

type opponentThrow =
	| 'A' // rock
	| 'B' // paper
	| 'C'; // scissors

const outcome = (opponent: opponentThrow, player: keyof typeof pointsForThrow): keyof typeof pointsForOutcome => {
	switch (opponent) {
		case 'A': { // Rock
			if (player === 'X') return 'draw';
			if (player === 'Y') return 'win'; // paper beats rock
			if (player === 'Z') return 'lose'; // rock beats scissors
			break
		}
		case 'B': { // Paper
			if (player === 'Y') return 'draw';
			if (player === 'Z') return 'win'; // scissors beats paper
			if (player === 'X') return 'lose'; // paper beats rock
			break
		}
		case 'C': { // Scissors
			if (player === 'Z') return 'draw';
			if (player === 'X') return 'win'; // rock beats scissors
			if (player === 'Y') return 'lose'; // scissors beats paper
			break
		}
	}
	throw new Error('Invalid');
}

const input = readFileSync('./input.txt', 'utf-8');

// split by new line
const lines = input.split('\n');

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

type part2 = {
	X: 'lose',
	Y: 'draw',
	Z: 'win',
}

const playerShouldThrow = (opponent: opponentThrow, desiredOutcome: keyof part2): keyof typeof pointsForThrow => {
	switch (opponent) {
		case 'A': { // Rock
			if (desiredOutcome === 'X') return 'Z'; // throw scissors to lose
			if (desiredOutcome === 'Y') return 'X'; // throw rock to draw
			if (desiredOutcome === 'Z') return 'Y'; // throw paper to win
			break
		}
		case 'B': { // Paper
			if (desiredOutcome === 'X') return 'X'; // throw rock to lose
			if (desiredOutcome === 'Y') return 'Y'; // throw paper to draw
			if (desiredOutcome === 'Z') return 'Z'; // throw scissors to win
			break
		}
		case 'C': { // Scissors
			if (desiredOutcome === 'X') return 'Y'; // throw paper to lose
			if (desiredOutcome === 'Y') return 'Z'; // throw scissors to draw
			if (desiredOutcome === 'Z') return 'X'; // throw rock to win
			break
		}
	}
	throw new Error('Invalid');
}

const input = readFileSync('./input.txt', 'utf-8');

// split by new line
const lines = input.split('\n');

// const score = lines.map(line => {
// 	const [opponent, player] = line.split(' ');
// 	if (!opponent || !player) return 0;
// 	return pointsForThrow[player] + pointsForOutcome[outcome(opponent as opponentThrow, player as keyof typeof pointsForThrow)];
// }).reduce((a, b) => a + b, 0);

// part 2
const score = lines.map(line => {
	const [opponent, desiredOutcome] = line.split(' ');
	if (!opponent || !desiredOutcome) return 0;
	const player = playerShouldThrow(opponent as opponentThrow, desiredOutcome as keyof part2);
	return pointsForThrow[player] + pointsForOutcome[outcome(opponent as opponentThrow, player as keyof typeof pointsForThrow)];
}).reduce((a, b) => a + b, 0);

console.log(score);
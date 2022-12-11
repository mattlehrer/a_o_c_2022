import { readFileSync } from 'node:fs';

const input = readFileSync('./test.txt', 'utf-8');

const lines = input.split('\n');

function parseInput(input: string[]): Monkeys {
	let currentMonkey = 0;
	const monkeys: Monkeys = {};

	for (const pretrim of input) {
		const line = pretrim.trim();
		if (line === '') {
			continue;
		} else if (line.startsWith('Monkey ')) {
			currentMonkey = Number(line.slice(7, 8));
			monkeys[currentMonkey] = {
				items: [],
				operations: { type: '+', amount: 0 },
				test: 0,
				onTrue: -1,
				onFalse: -1,
				inspections: 0,
			};
		} else if (line.startsWith('Starting items: ')) {
			monkeys[currentMonkey].items = [
				...monkeys[currentMonkey].items,
				...line.slice(16).split(', ').map(Number),
			];
		} else if (line.startsWith('Operation: new = old + ')) {
			monkeys[currentMonkey].operations = {
				type: '+',
				amount: Number(line.slice(23)),
			};
		} else if (line.startsWith('Operation: new = old * ')) {
			if (line.slice(23) === 'old') {
				monkeys[currentMonkey].operations = {
					type: '**',
					amount: 2,
				};
			} else {
				monkeys[currentMonkey].operations = {
					type: '*',
					amount: Number(line.slice(23)),
				};
			}
		} else if (line.startsWith('Test: divisible by ')) {
			monkeys[currentMonkey].test = Number(line.slice(19));
		} else if (line.startsWith('If true: throw to monkey ')) {
			monkeys[currentMonkey].onTrue = Number(line.slice(25));
		} else if (line.startsWith('If false: throw to monkey ')) {
			monkeys[currentMonkey].onFalse = Number(line.slice(26));
		} else {
			throw new Error('Unknown line: ' + line);
		}
	}
	return monkeys;
}

function monkeyBusiness(monkeys: Monkeys, worryDrop: number = 3, rounds: number = 20): number {
	for (let round = 0; round < rounds; round++) {
		for (const monkey of Object.values(monkeys)) {
			while (monkey.items.length > 0) {
				const item = monkey.items.shift();
				if (!item) throw new Error('No item!');
				let worryLevel: number;
				if (monkey.operations.type === '+') {
					worryLevel = Math.floor((item + monkey.operations.amount) / worryDrop);
				} else if (monkey.operations.type === '*') {
					worryLevel = Math.floor((item * monkey.operations.amount) / worryDrop);
				} else {
					// the problem is here --- can exceed Number.MAX_SAFE_INTEGER
					worryLevel = Math.floor(item ** monkey.operations.amount / worryDrop);
				}
				if (worryLevel % monkey.test === 0) {
					monkeys[monkey.onTrue].items.push(worryLevel);
				} else {
					monkeys[monkey.onFalse].items.push(worryLevel);
				}
				monkey.inspections++;
			}
		}
	}
	console.log(
		Object.values(monkeys)
			.map((m) => m.inspections)
			.join(', '),
	);

	const sorted = Object.values(monkeys).sort((a, b) => b.inspections - a.inspections);
	return sorted.slice(0, 2).reduce((product, curr) => product * curr.inspections, 1);
}

console.log('Part 1:', monkeyBusiness(parseInput(lines), 3, 20));
console.log('Part 2:', monkeyBusiness(parseInput(lines), 1, 10000));

type Monkey = {
	items: number[];
	operations: { type: '+' | '*' | '**'; amount: number };
	test: number;
	onTrue: number;
	onFalse: number;
	inspections: number;
};

type Monkeys = Record<number, Monkey>;

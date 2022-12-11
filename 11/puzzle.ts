import { readFileSync } from 'node:fs';

const input = readFileSync('./input.txt', 'utf-8');

const lines = input.split('\n');

let currentMonkey = 0;
const monkeys: Record<
	number,
	{
		items: number[];
		operations: { type: '+' | '*' | '**'; amount: number };
		test: number;
		onTrue: number;
		onFalse: number;
		inspections: number;
	}
> = {};

const WORRY_DROP = 3;

for (const pretrim of lines) {
	const line = pretrim.trim();
	if (line === '') {
		continue;
	} else if (line.startsWith('Monkey ')) {
		currentMonkey = Number(line.slice(7, 8));
		monkeys[currentMonkey] = {
			items: [],
			operations: { type: '+', amount: 0 },
			test: 0,
			onTrue: 0,
			onFalse: 0,
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

for (let round = 1; round < 21; round++) {
	for (const monkey of Object.values(monkeys)) {
		while (monkey.items.length > 0) {
			const item = monkey.items.shift()!;
			let worryLevel: number;
			if (monkey.operations.type === '+') {
				worryLevel = Math.floor((item + monkey.operations.amount) / WORRY_DROP);
			} else if (monkey.operations.type === '*') {
				worryLevel = Math.floor((item * monkey.operations.amount) / WORRY_DROP);
			} else {
				worryLevel = Math.floor(item ** monkey.operations.amount / WORRY_DROP);
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

const sorted = Object.values(monkeys).sort((a, b) => b.inspections - a.inspections);
console.log(sorted.slice(0, 2).reduce((product, curr) => product * curr.inspections, 1));

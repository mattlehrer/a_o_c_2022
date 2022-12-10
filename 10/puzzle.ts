import { readFileSync } from 'node:fs';

const input = readFileSync('./input.txt', 'utf-8');

const lines = input.split('\n');

let cycle = 1;
let x = 1;
let strengthSum = 0;
const notableStrengths: { cycle: number; x: number }[] = [];
let crtOutput: string = '';
let crtDrawingPixel = 0;

for (const line of lines) {
	if (!line) continue;
	crtOutput += crtAligned(crtDrawingPixel, x);
	if ((cycle - 20) % 40 === 0) {
		notableStrengths.push({ cycle, x });
		strengthSum += cycle * x;
	}
	if (line === 'noop') {
		cycle++;
	} else {
		const [add, num] = line.split(' ');
		if (add !== 'addx') throw new Error('Invalid op: ' + add);
		cycle++;
		crtDrawingPixel++;
		crtOutput += crtAligned(crtDrawingPixel, x);

		if ((cycle - 20) % 40 === 0) {
			notableStrengths.push({ cycle, x });
			strengthSum += cycle * x;
		}
		cycle++;
		x += Number(num);
	}
	crtDrawingPixel++;
}
console.log('Part 1:', strengthSum);

console.log('Part 2:');
const crtRows: string[] = [].concat.apply(
	[],
	crtOutput.split('').map(function (_, i) {
		return i % 40 ? [] : crtOutput.slice(i, i + 40);
	}),
);
console.log(crtRows);

function crtAligned(pixel: number, x: number) {
	/**
	 * It seems like the X register controls the horizontal position of a sprite.
	 * Specifically, the sprite is 3 pixels wide, and the X register sets the
	 * horizontal position of the middle of that sprite.
	 *
	 * If the sprite is positioned such that one of its three pixels
	 * is the pixel currently being drawn, the screen produces a lit pixel (#);
	 * otherwise, the screen leaves the pixel dark (.).
	 */
	const sprite = [x - 1, x, x + 1];
	return sprite.includes(pixel % 40) ? '#' : '.';
}

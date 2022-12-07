import { readFileSync } from 'node:fs';

const input = readFileSync('./input.txt', 'utf-8');

const lines = input.split('\n');

// parse input
const root: Directory = { name: '/', parent: null, files: [], directories: {} };
let currentDirectory = root;
let currentlyListing = false;

for (const line of lines) {
	if (line.startsWith('$ cd ')) {
		// changes directory
		currentlyListing = false;
		const path = line.slice(5);
		if (path === '/') {
			currentDirectory = root;
		} else if (path === '..') {
			currentDirectory = currentDirectory.parent ? currentDirectory.parent : root;
		} else {
			if (!currentDirectory.directories.hasOwnProperty(path))
				throw new Error(`Invalid path: ${path} at ${line}`);
			currentDirectory = currentDirectory.directories[path];
		}
	} else if (line === '$ ls') {
		// lists directory contents
		currentlyListing = true;
	} else if (line.startsWith('dir ')) {
		// starts with dir, is a directory
		const name = line.slice(4);
		if (!currentDirectory.directories.hasOwnProperty(name)) {
			currentDirectory.directories[name] = {
				name,
				parent: currentDirectory,
				files: [],
				directories: {},
			};
		}
	} else if (line.match(/^\d+ .+$/)) {
		// starts with number, is a size & file
		const [size, name] = line.split(' ');
		currentDirectory.files.push({ name, size: Number(size) });
	} else if (line === '') {
		continue;
	} else {
		throw new Error('Invalid line: ' + line);
	}
}

console.log('Part 1:');
const sizes: { name: string; size: number }[] = [];
function part1(dir: Directory = root) {
	for (const [name, directory] of Object.entries(dir.directories)) {
		sizes.push({ name, size: calculateDirectorySize(directory) });
		part1(directory);
	}
}
part1();
sizes.sort((a, b) => a.size - b.size);
// console.log('All: ', JSON.stringify(sizes, null, 2));
console.log(
	'Under 100_000',
	sizes.filter((s) => s.size <= 100_000).reduce((a, b) => a + b.size, 0),
);

console.log('Part 2:');
const TOTAL_DISK_SIZE = 70_000_000;
const NEED_FREE = 30_000_000;

const currentUsed = calculateDirectorySize(root);
console.log('Current used: ', currentUsed);
const currentFree = TOTAL_DISK_SIZE - currentUsed;
console.log('Current free: ', currentFree);
const needToFree = NEED_FREE - currentFree;
console.log('Need to free: ', needToFree);

console.log(
	'Smallest directory larger than need to free: ',
	sizes.find((s) => s.size > needToFree),
);

function currentPath(directory: Directory | null): string {
	if (directory?.parent === root) return '/';
	if (!directory?.parent) return '/';
	return currentPath(directory.parent) + directory.parent.name + '/';
}

function calculateDirectorySize(directory: Directory): number {
	let size = 0;
	for (const file of directory.files) {
		size += file.size;
	}
	for (const subdirectory of Object.values(directory.directories)) {
		size += calculateDirectorySize(subdirectory);
	}
	return size;
}

type File = {
	name: string;
	size: number;
};

interface Directory {
	name: string;
	files: File[];
	directories: {
		[name: string]: Directory;
	};
	parent: Directory | null;
}

function isEmpty(obj: object) {
	return Object.keys(obj).length === 0;
}

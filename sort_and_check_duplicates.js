import fs from 'fs';

const filePath = './public/words.txt';
const text = fs.readFileSync(filePath, 'utf8');

const lines = text.split('\n').map(l => l.trim()).filter(Boolean);

// Sort and remove duplicates
const sortedUnique = Array.from(new Set(lines)).sort((a, b) => a.localeCompare(b));

// Find duplicates for reporting
const duplicates = lines.filter((v, i, arr) => arr.indexOf(v) !== i && arr.indexOf(v) === i);

console.log('Sorted and deduplicated list:');
console.log(sortedUnique.join('\n'));

if (duplicates.length > 0) {
	console.log('\nDuplicates found:');
	duplicates.forEach(d => console.log(d));
} else {
	console.log('\nNo duplicates found.');
}

// Write back to file
fs.writeFileSync(filePath, sortedUnique.join('\n'), 'utf8');
console.log(`\nFile updated: ${filePath}`);

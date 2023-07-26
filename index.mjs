import HTTP_CODES from './http-codes.json' assert {type: 'json'};

function random(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pickRandom(array) {
	return array[random(0, array.length - 1)];
}

function randChars(n) {
	const alphabet = 'abcdefghijklmnopqrstuvwxyz0123456789-_'.split('');
	let result = '';
	for (let i = 0; i < n; i++) {
		result += pickRandom(alphabet);
	}
	return result;
}

function randomPath() {
	const result = [];
	for (let i = 0; i < 3; i++) {
		let word = randChars(3);
		result.push(word);
		if (Math.random() < 0.5)
			break;
	}
	return result.join('/');
}

const validLine = /^\s*((?:\w+:)?\/\S*)\s*((?:(?:\S+=\S+)\s*)*)\s+((?:\w+:)?\/\S*)\s*(\d+)?(!)?\s*(Country=\S+)?\s*(Language=\S+)?/;
const plchldrRegex = /:\w+/g;

export default function parse() {
	const outputElem = document.querySelector('#output');
	const inputElem = document.querySelector('#input');
	const input = inputElem.innerText;

	outputElem.innerText = '';

	for (const line of input.split('\n')) {
		const lineParts = line.match(validLine);
		if (!lineParts) continue;

		let [_, from, query, to, code, forced, country, language] = lineParts;
		code = +code || 200;
		forced = !!forced;
		let queryString = query ? '?' + query.trim().replaceAll(' ', '&') : '';

		const plchldrList = (from + queryString).match(/(?<=:)\w+/g);
		const randPath = randomPath();
		let exampleFrom = (from + queryString).replace('*', randPath);
		let exampleTo = to.replace(':splat', randPath);
		for (const plchldr of plchldrList?.length ? plchldrList : []) {
			const word = randChars(4);
			exampleFrom = exampleFrom.replaceAll(':' + plchldr, word);
			exampleTo = exampleTo.replaceAll(':' + plchldr, word);
		}

		// Replace splat
		let finalFrom = from, finalTo = to, finalQuery;
		finalFrom = finalFrom.replace('*', '[...]');
		finalTo = finalTo.replace(':splat', '[...]');
		// Replace other placeholders
		finalFrom = finalFrom.replace(plchldrRegex, '[[$&:]]');
		finalTo = finalTo.replace(plchldrRegex, '[[$&:]]');
		finalQuery = queryString.replace(plchldrRegex, '[[$&:]]');

		const output = `<li>
			<b><code>${line}</code></b>
			<ul>
				<li><b>From:</b> <code>${from}${finalQuery}</code>
				<li><b>To:</b> <code>${to}</code>
				<li><b>Code:</b> ${code} ${HTTP_CODES[code]}
				${forced ? '<li>Forced' : ''}
				${country ? `<li>When ${country}` : ''}
				${language ? `<li>When ${language}` : ''}
				<li><b>Example:</b> ${exampleFrom} &rarr; ${exampleTo}
			</ul>
		</li>`;
		outputElem.innerHTML += output;
	}
}

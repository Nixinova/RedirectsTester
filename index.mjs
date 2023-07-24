import HTTP_CODES from './http-codes.json' assert {type: 'json'};

function random(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randWord() {
	const alphabet = 'abcdefghijklmnopqrstuvwxyz';
	let result = '';
	for (let i = 0; i < 3; i++) {
		result += alphabet.charAt(random(0, alphabet.length - 1));
	}
	return result;
}

const plchldrRegex = /:\w+/g;

export default function parse() {
	const outputElem = document.querySelector('#output');
	const inputElem = document.querySelector('#input');
	const input = inputElem.innerText;

	outputElem.innerText = '';

	for (const line of input.split('\n')) {
		const lineParts = line.match(/^\s*(\/\S+)\s*((?:(?:\S+=\S+)\s*)*)\s*(\/\S+)\s*(\d+)?(!)?/);
		if (!lineParts) continue;
		let [_, from, query, to, code, forced] = lineParts;
		code = +code || 200;
		forced = !!forced;
		let queryString = query ? '?' + query.trim().replaceAll(' ', '&') : '';

		const plchldrList = (from + queryString).match(/(?<=:)\w+/g);
		const randPath = [randWord(), randWord(), randWord()].join('/');
		let exampleFrom = (from + queryString).replace('*', randPath);
		let exampleTo = to.replace(':splat', randPath);
		for (const plchldr of plchldrList?.length ? plchldrList : []) {
			const word = randWord();
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
				<li>From: <code>${from}${finalQuery}</code>
				<li>To: <code>${to}</code>
				<li>Code: ${code} ${HTTP_CODES[code]}
				<li>Forced: ${forced ? 'yes' : 'no'}
				<li>Example: ${exampleFrom} &rarr; ${exampleTo}
			</ul>
		</li>`;
		outputElem.innerHTML += output;
	}
}

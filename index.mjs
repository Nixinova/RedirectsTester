import HTTP_CODES from './http-codes.json' assert {type: 'json'};

export default function parse() {
	const outputElem = document.querySelector('#output');
	const inputElem = document.querySelector('#input');
	const input = inputElem.innerText;

	outputElem.innerText = '';

	for (const line of input.split('\n')) {
		const lineParts = line.match(/^\s*(\/\S+)\s*(\S+=\S+)?\s*(\/\S+)\s*(\d+)?(!)?/);
		console.debug(lineParts);
		if (!lineParts) continue;
		let [_, from, query, to, code, forced] = lineParts;
		code = +code || 200;
		forced = !!forced;

		const output = `<li>
			<b><code>${line}</code></b>
			<ul>
				<li>From: <code>${from}${query ? '?' + query : ''}</code>
				<li>To: <code>${to}</code>
				<li>Code: ${code} ${HTTP_CODES[code]}
				<li>Forced? ${forced ? 'yes' : 'no'}
			</ul>
		</li>`;
		outputElem.innerHTML += output;
	}
}

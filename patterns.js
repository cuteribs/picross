import patterns from './patterns.json' with { type: 'json' };

window.loadPatterns = function(select) {
	for (var i = 0; i < patterns.length; i++) {
		const pattern = patterns[i];
		select.options.add(new Option(pattern.name, pattern.name));
	}
}

window.getPattern = function(patternName)
{
	const pattern = patterns.find(x => x.name == patternName);
	return pattern;
}

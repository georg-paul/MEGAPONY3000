test('GET Parameter is appended correctly to a given URL', function () {
	var fixture = new InitPlugins();
	equal(fixture.appendParamToUrl('http://player.vimeo.com/video/68657843?title=0&portrait=0&badge=0&color=ff0a50', 'wmode=transparent'), 'http://player.vimeo.com/video/68657843?title=0&portrait=0&badge=0&color=ff0a50&wmode=transparent');
	equal(fixture.appendParamToUrl('https://www.youtube.com/watch?v=578nd9swh7E', 'wmode=transparent'), 'https://www.youtube.com/watch?v=578nd9swh7E&wmode=transparent');
	equal(fixture.appendParamToUrl('//www.youtube.com/embed/kGKbl0IECK8', 'wmode=transparent'), '//www.youtube.com/embed/kGKbl0IECK8?wmode=transparent');
});
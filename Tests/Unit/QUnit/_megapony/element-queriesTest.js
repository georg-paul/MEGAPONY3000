test('CSS-normalizer returns correct rules', function () {
	var fixture = new CssSelectorNormalizer();
	equal(fixture.normalize('.megapony-max-width-400.megapony-rwd-table-container'), '.megapony-rwd-table-container.megapony-max-width-400');
	equal(fixture.normalize('DIV.csc-textpic.megapony-max-width-6401123 .csc-textpic-imagewrap'), 'DIV.csc-textpic.megapony-max-width-6401123 .csc-textpic-imagewrap');
	equal(fixture.normalize('DIV.megapony-max-width-6401123.csc-textpic .csc-textpic-imagewrap'), 'DIV.csc-textpic.megapony-max-width-6401123 .csc-textpic-imagewrap');
	equal(fixture.normalize('.l-facts ul.megapony-max-width-480 li:last-child'), '.l-facts ul.megapony-max-width-480 li:last-child');
	equal(fixture.normalize('.l-facts header.megapony-max-width-220 + ul'), '.l-facts header.megapony-max-width-220 + ul');
	equal(fixture.normalize('.megapony-rwd-table-container.megapony-max-width-400 .rwd-table'), '.megapony-rwd-table-container.megapony-max-width-400 .rwd-table');
	equal(fixture.normalize('.megapony-max-width-800#max-width-target'), '#max-width-target.megapony-max-width-800');
	equal(fixture.normalize('.carousel .megapony-max-width-1000#page'), '.carousel #page.megapony-max-width-1000');
	equal(fixture.normalize('.megapony-max-width-480#extended-header .megapony-delimiter .facts'), '#extended-header.megapony-max-width-480 .megapony-delimiter .facts');
	equal(fixture.normalize('.news-list :nth-child(1).megapony-object-column.megapony-max-width-410 + .megapony-object-column'), '.news-list .megapony-object-column.megapony-max-width-410:nth-child(1) + .megapony-object-column');
});

test('selectorContainsElementQuery() returns correct boolean', function () {
	var fixture = new ElementQueries();
	ok(fixture.selectorContainsElementQuery('.test-selector.megapony-max-width-768'));
	ok(fixture.selectorContainsElementQuery('.megapony-max-width-400.megapony-rwd-table-container'));
	ok(fixture.selectorContainsElementQuery('.l-facts ul.megapony-max-width-480 li:last-child'));
	ok(fixture.selectorContainsElementQuery('body.megapony-min-width-900'));
});


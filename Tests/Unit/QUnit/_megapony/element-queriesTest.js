test('selectorContainsElementQuery() returns correct boolean', function () {
	var fixture = new ElementQueries();
	ok(fixture.selectorContainsElementQuery('.test-selector.megapony-max-width-768'));
	ok(fixture.selectorContainsElementQuery('.megapony-max-width-400.megapony-rwd-table-container'));
	ok(fixture.selectorContainsElementQuery('.l-facts ul.megapony-max-width-480 li:last-child'));
	ok(fixture.selectorContainsElementQuery('body.megapony-min-width-900'));
});

test('getTargetSelector returns the correct target', function() {
	var fixture = new ElementQueries();
	equal(fixture.getTargetSelector('.megapony-rwd-table-container.megapony-max-width-400'), '.megapony-rwd-table-container');
	equal(fixture.getTargetSelector('DIV.csc-textpic.megapony-max-width-6401123 .csc-textpic-imagewrap'), 'DIV.csc-textpic');
	equal(fixture.getTargetSelector('.l-facts header.megapony-max-width-220 + ul'), '.l-facts header');
	equal(fixture.getTargetSelector('.news-list .megapony-object-column.megapony-max-width-410:nth-child(1) + .megapony-object-column'), '.news-list .megapony-object-column:nth-child(1)');
	equal(fixture.getTargetSelector('.megapony-rwd-table-container.megapony-max-width-400 .rwd-table'), '.megapony-rwd-table-container');
	equal(fixture.getTargetSelector('.megapony-max-width-480#extended-header .megapony-delimiter .facts'), '#extended-header');
});
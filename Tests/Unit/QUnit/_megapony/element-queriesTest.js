test('getTargetSelector returns the correct target', function() {
	var fixture = new ElementQueries();
	equal(fixture.getTargetSelector('.megapony-rwd-table-container.megapony-max-width-400'), '.megapony-rwd-table-container');
	equal(fixture.getTargetSelector('DIV.csc-textpic.megapony-max-width-6401123 .csc-textpic-imagewrap'), 'DIV.csc-textpic');
	equal(fixture.getTargetSelector('.l-facts header.megapony-max-width-220 + ul'), '.l-facts header');
	equal(fixture.getTargetSelector('.news-list .megapony-object-column.megapony-max-width-410:nth-child(1) + .megapony-object-column'), '.news-list .megapony-object-column:nth-child(1)');
	equal(fixture.getTargetSelector('.megapony-rwd-table-container.megapony-max-width-400 .rwd-table'), '.megapony-rwd-table-container');
	equal(fixture.getTargetSelector('.megapony-max-width-480#extended-header .megapony-delimiter .facts'), '#extended-header');
});

test('getLengthFromSelector returns the correct length', function () {
	var subject = new ElementQueries();
	equal(subject.getLengthFromSelector('.megapony-min-height-', '.news-list .megapony-object-column.megapony-max-height-410:nth-child(1) + .megapony-object-column'), false);
	equal(subject.getLengthFromSelector('.megapony-min-height-', '.news-list .megapony-object-column.megapony-min-height-410:nth-child(1) + .megapony-object-column'), 410);
	equal(subject.getLengthFromSelector('.megapony-max-height-', '.news-list .megapony-object-column.megapony-max-height-410:nth-child(1) + .megapony-object-column'), 410);
	equal(subject.getLengthFromSelector('.megapony-max-height-', '.news-list .megapony-object-column.megapony-min-height-410:nth-child(1) + .megapony-object-column'), false);
	equal(subject.getLengthFromSelector('.megapony-min-width-', '.news-list .megapony-object-column.megapony-max-width-410:nth-child(1) + .megapony-object-column'), false);
	equal(subject.getLengthFromSelector('.megapony-min-width-', '.news-list .megapony-object-column.megapony-min-width-410:nth-child(1) + .megapony-object-column'), 410);
	equal(subject.getLengthFromSelector('.megapony-max-width-', '.news-list .megapony-object-column.megapony-min-width-410:nth-child(1) + .megapony-object-column'), false);
	equal(subject.getLengthFromSelector('.megapony-max-width-', '.news-list .megapony-object-column.megapony-max-width-410:nth-child(1) + .megapony-object-column'), 410);
});
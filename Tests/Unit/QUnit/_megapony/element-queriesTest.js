test('getTargetSelector returns the correct target', function () {
	var fixture = new ElementQueries();
	equal(fixture.getTargetSelector('.megapony-rwd-table-container.megapony-max-width-400'), '.megapony-rwd-table-container');
	equal(fixture.getTargetSelector('DIV.csc-textpic.megapony-max-width-6401123 .csc-textpic-imagewrap'), 'DIV.csc-textpic');
	equal(fixture.getTargetSelector('.l-facts header.megapony-max-width-220 + ul'), '.l-facts header');
	equal(fixture.getTargetSelector('.news-list .megapony-object-column.megapony-max-width-410:nth-child(1) + .megapony-object-column'), '.news-list .megapony-object-column:nth-child(1)');
	equal(fixture.getTargetSelector('.megapony-rwd-table-container.megapony-max-width-400 .rwd-table'), '.megapony-rwd-table-container');
	equal(fixture.getTargetSelector('.megapony-max-width-480#extended-header .megapony-delimiter .facts'), '#extended-header');
	equal(fixture.getTargetSelector('.l-element-queries .demo-text.megapony-max-width-400.megapony-min-width-100'), '.l-element-queries .demo-text');
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

test('applyElementQueries applies max-width class', function () {
	var elements = [
		{
			offsetWidth : 100,
			classList : {
				add : function (cssClass) {
					equal(cssClass, 'megapony-max-width-200');
				}
			}
		}
	];

	var subject = new ElementQueries();
	subject.applyElementQueries(elements, {maxW: 200});
});

test('applyElementQueries applies min-width class', function () {
	var elements = [
		{
			offsetWidth : 300,
			classList : {
				add : function (cssClass) {
					equal(cssClass, 'megapony-min-width-200');
				}
			}
		}
	];

	var subject = new ElementQueries();
	subject.applyElementQueries(elements, {minW: 200});
});

test('applyElementQueries applies min-height class', function () {
	var elements = [
		{
			offsetHeight : 300,
			classList : {
				add : function (cssClass) {
					equal(cssClass, 'megapony-min-height-200');
				}
			}
		}
	];

	var subject = new ElementQueries();
	subject.applyElementQueries(elements, {minH: 200});
});

test('applyElementQueries applies max-height class', function () {
	var elements = [
		{
			offsetHeight : 100,
			classList : {
				add : function (cssClass) {
					equal(cssClass, 'megapony-max-height-200');
				}
			}
		}
	];

	var subject = new ElementQueries();
	subject.applyElementQueries(elements, {maxH: 200});
});

test('applyElementQueries applies max-width && min-width class', function () {
	var elements = [
		{
			offsetWidth : 100,
			classList : {
				add : function (cssClass) {
					ok(cssClass === 'megapony-max-width-200' || cssClass === 'megapony-min-width-50');
				}
			}
		}
	];

	var subject = new ElementQueries();
	subject.applyElementQueries(elements, {maxW: 200, minW: 50});
});

test('applyElementQueries applies max-height && min-height class', function () {
	var elements = [
		{
			offsetHeight : 100,
			classList : {
				add : function (cssClass) {
					ok(cssClass === 'megapony-max-height-200' || cssClass === 'megapony-min-height-50');
				}
			}
		}
	];

	var subject = new ElementQueries();
	subject.applyElementQueries(elements, {maxH: 200, minH: 50});
});

test('getMegaponyStyleSheets returns all stylesheets with media=megapony', function () {
	var stylesheets = [
			{
				title: 'megapony'
			},
			{
				title: ''
			},
			{
				title: 'megapony'
			}
		];

	var subject = new ElementQueries();
	equal(subject.getMegaponyStyleSheets(stylesheets).length, 2);
});
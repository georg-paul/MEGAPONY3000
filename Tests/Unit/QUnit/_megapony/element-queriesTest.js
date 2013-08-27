test('CSS-normalizer returns correct rules', function () {
	var fixture = new CssSelectorNormalizer();
	equal(fixture.normalize('.megapony-max-width-400.megapony-rwd-table-container'), '.megapony-rwd-table-container.megapony-max-width-400');
	equal(fixture.normalize('DIV.csc-textpic.megapony-max-width-6401123 .csc-textpic-imagewrap'), 'DIV.csc-textpic.megapony-max-width-6401123 .csc-textpic-imagewrap');
	equal(fixture.normalize('DIV.megapony-max-width-6401123.csc-textpic .csc-textpic-imagewrap'), 'DIV.csc-textpic.megapony-max-width-6401123 .csc-textpic-imagewrap');
	equal(fixture.normalize('.l-facts ul.megapony-max-width-480 li:last-child'), '.l-facts ul.megapony-max-width-480 li:last-child');
	equal(fixture.normalize('.l-facts header.megapony-max-width-220 + ul'), '.l-facts header.megapony-max-width-220 + ul');
	equal(fixture.normalize('.megapony-rwd-table-container.megapony-max-width-400 .rwd-table'), '.megapony-rwd-table-container.megapony-max-width-400 .rwd-table');
	equal(fixture.normalize('.megapony-max-width-800#max-width-target'), '#max-width-target.megapony-max-width-800');
});

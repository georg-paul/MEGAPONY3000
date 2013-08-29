/*jslint browser: true, nomen: false, devel: true*/
/*global $, jQuery, Modernizr */

/*
 Copyright (c) 2013 Georg Paul

 MIT License

 Permission is hereby granted, free of charge, to any person obtaining
 a copy of this software and associated documentation files (the
 "Software"), to deal in the Software without restriction, including
 without limitation the rights to use, copy, modify, merge, publish,
 distribute, sublicense, and/or sell copies of the Software, and to
 permit persons to whom the Software is furnished to do so, subject to
 the following conditions:

 The above copyright notice and this permission notice shall be
 included in all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

function ElementQueries() {
	"use strict";

	var self = this;

	self.maxWSelector = '.megapony-max-width-';
	self.minWSelector = '.megapony-min-width-';
	self.maxHSelector = '.megapony-max-height-';
	self.minHSelector = '.megapony-min-height-';


	this.init = function () {
		var selectorTextString = '',
			crossRules,
			cssNormalizer,
			rule = '';

		$.each(self.getMegaponyStyleSheets(), function () {
			crossRules = this.rules || this.cssRules;
			for (var x = 0; x < crossRules.length; x++) {
				cssNormalizer = new CssSelectorNormalizer();
				rule = cssNormalizer.normalize(crossRules[x].selectorText);
				selectorTextString += rule + ';';
			}
			self.checkSelectorsForElementQuery(selectorTextString);
		});
	};


	this.getMegaponyStyleSheets = function () {
		var megaponyStylesheets = [];
		$.each(document.styleSheets, function (i) {
			var stylesheet = this;
			if (stylesheet.title === 'megapony') {
				megaponyStylesheets.push(stylesheet);
			}
		});
		return megaponyStylesheets;
	};


	this.checkSelectorsForElementQuery = function (selectorTextString) {
		var elementsArray = selectorTextString.split(';'),
			selectorText = '';

		for (var i = 0; i < elementsArray.length; i++) {
			selectorText = (elementsArray[i]) !== undefined ? (elementsArray[i]) : '';

			if (self.selectorContainsElementQuery(selectorText)) {
				var values = {
						maxW: self.getMaxWidth(selectorText),
						minW: self.getMinWidth(selectorText),
						maxH: self.getMaxHeight(selectorText),
						minH: self.getMinHeight(selectorText)
					},
					targetSelector = selectorText.split(self.maxWSelector)[0].split(self.minWSelector)[0].split(self.maxHSelector)[0].split(self.minHSelector)[0];

				self.applyElementQueries($(targetSelector), values);
			}
		}
	};


	this.selectorContainsElementQuery = function (selectorText) {
		return !!(selectorText.indexOf(self.maxWSelector) !== -1 || selectorText.indexOf(self.minWSelector) !== -1 || selectorText.indexOf(self.maxHSelector) !== -1 || selectorText.indexOf(self.minHSelector) !== -1);
	};


	this.getMaxWidth = function (selectorText) {
		var indexOfText = selectorText.indexOf(self.maxWSelector),
			maxWidth = parseInt(selectorText.slice(indexOfText + self.maxWSelector.length, indexOfText + self.maxWSelector.length + 4), 10);

		return (maxWidth > 0) ? maxWidth : false;
	};


	this.getMinWidth = function (selectorText) {
		var indexOfText = selectorText.indexOf(self.minWSelector),
			minWidth = parseInt(selectorText.slice(indexOfText + self.minWSelector.length, indexOfText + self.minWSelector.length + 4), 10);

		return (minWidth > 0) ? minWidth : false;

	};


	this.getMaxHeight = function (selectorText) {
		var indexOfText = selectorText.indexOf(self.maxHSelector),
			maxHeight = parseInt(selectorText.slice(indexOfText + self.maxHSelector.length, indexOfText + self.maxHSelector.length + 4), 10);

		return (maxHeight > 0) ? maxHeight : false;
	};


	this.getMinHeight = function (selectorText) {
		var indexOfText = selectorText.indexOf(self.maxHSelector),
			maxHeight = parseInt(selectorText.slice(indexOfText + self.maxHSelector.length, indexOfText + self.maxHSelector.length + 4), 10);

		return (maxHeight > 0) ? maxHeight : false;
	};


	this.applyElementQueries = function ($elements, values) {
		var $el, elWidth, elHeight;

		$elements.each(function () {
			$el = $(this);
			elWidth = $el.width();
			elHeight = $el.height();

			// max width
			if ((values.maxW > 0 && !values.minW) && (elWidth < values.maxW)) {
				$el.addClass(self.maxWSelector.split('.')[1] + values.maxW);
			}
			// min width
			if ((values.minW > 0 && !values.maxW) && (elWidth >= values.minW)) {
				$el.addClass(self.minWSelector.split('.')[1] + values.minW);
			}
			// max and min width
			if ((values.maxW > 0 && values.minW > 0) && (elWidth < values.maxW && elWidth >= values.minW)) {
				$el.addClass(self.maxWSelector.split('.')[1] + values.maxW);
				$el.addClass(self.minWSelector.split('.')[1] + values.minW);
			}
			// max height
			if ((values.maxH > 0 && !values.minH) && (elHeight < values.maxH)) {
				$el.addClass(self.maxHSelector.split('.')[1] + values.maxH);
			}
			// min height
			if ((values.minH > 0 && !values.maxH) && (elHeight > values.minH)) {
				$el.addClass(self.minHSelector.split('.')[1] + values.minH);
			}
			// max and min height
			if ((values.maxH > 0 && values.minH > 0) && (elHeight < values.maxH && elHeight > values.minH)) {
				$el.addClass(self.maxHSelector.split('.')[1] + values.maxH);
				$el.addClass(self.minHSelector.split('.')[1] + values.minH);
			}
		});
	};


	this.hideLoadingView = function () {
		$('html').removeClass('megapony-loading');
	};
}

(function () {
	"use strict";

	$(document).ready(function () {
		var elQ = new ElementQueries(),
			mpObjects = new MegaponyObjects();

		elQ.init();
		mpObjects.init();
		elQ.hideLoadingView();
	});

}());
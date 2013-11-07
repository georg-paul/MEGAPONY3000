/*jslint browser: true, nomen: false, devel: true*/

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

	var megaponySelectorRegExp = new RegExp(/\.(megapony)\-(max|min)\-(width|height)\-(\d*)/);

	self.maxWSelector = '.megapony-max-width-';
	self.minWSelector = '.megapony-min-width-';
	self.maxHSelector = '.megapony-max-height-';
	self.minHSelector = '.megapony-min-height-';


	this.init = function () {
		self.parseStylesheets();
	};

	this.parseStylesheets = function () {
		var selectorTextString = '',
			megaponyStylesheets = self.getMegaponyStyleSheets(),
			crossRules,
			crossRulesLength,
			rule = '';

		megaponyStylesheets.forEach(function (stylesheet) {
			crossRules = stylesheet.rules || stylesheet.cssRules;
			crossRulesLength = crossRules.length;

			for (var x = 0; x < crossRulesLength; x++) {
				rule = crossRules[x].selectorText;
				selectorTextString += rule + ';';
			}
			self.checkSelectorsForElementQuery(selectorTextString);
		});
	};

	this.getMegaponyStyleSheets = function () {
		var megaponyStylesheets = [],
			stylesheets = document.styleSheets,
			stylesheetsLength = stylesheets.length;

		for (var i = 0; i < stylesheetsLength; i++) {
			if (stylesheets[i].title === 'megapony') {
				megaponyStylesheets.push(stylesheets[i]);
			}
		}
		return megaponyStylesheets;
	};

	this.checkSelectorsForElementQuery = function (selectorTextString) {
		var elementsArray = selectorTextString.split(';'),
			selectorText = '';

		for (var i = 0; i < elementsArray.length; i++) {
			selectorText = (elementsArray[i] !== undefined) ? (elementsArray[i]) : '';

			if (megaponySelectorRegExp.test(selectorText)) {
				var values = {
						maxW: self.getLengthFromSelector(self.maxWSelector, selectorText),
						minW: self.getLengthFromSelector(self.minWSelector, selectorText),
						maxH: self.getLengthFromSelector(self.maxHSelector, selectorText),
						minH: self.getLengthFromSelector(self.minHSelector, selectorText)
					},
					targetSelectorArray = selectorText.split(','),
					targetSelectorArrayLength = targetSelectorArray.length,
					storedTargetSelector = '';

				if (targetSelectorArrayLength > 1) {
					// multiple expressions (.foo .bar, .foo2 .bar 2, .lorem-ipsum)
					for (var x = 0; x < targetSelectorArrayLength; x++) {
						if (storedTargetSelector !== self.getTargetSelector(targetSelectorArray[x])) {
							if (self.getTargetSelector(targetSelectorArray[x]) !== '') {
								self.applyElementQueries(document.querySelectorAll(self.getTargetSelector(targetSelectorArray[x])), values);
							}
						}
						storedTargetSelector = self.getTargetSelector(targetSelectorArray[x]);
					}
				} else {
					// single expression (.foo .bar)
					if (self.getTargetSelector(targetSelectorArray[0]) !== '') {
						self.applyElementQueries(document.querySelectorAll(self.getTargetSelector(targetSelectorArray[0])), values);
					}
				}
			}
		}
	};

	this.getTargetSelector = function (selectorText) {
		var selectorPosition = selectorText.match(megaponySelectorRegExp);

		selectorText = selectorText.replace(megaponySelectorRegExp, '');

		if (selectorText.indexOf(" ", selectorPosition.index) != -1) {
			return selectorText.substring(0, selectorText.indexOf(" ", selectorPosition.index));
		} else {
			return selectorText;
		}
	};

	this.getLengthFromSelector = function (selector, selectorText) {
		var indexOfText = selectorText.indexOf(selector),
			maxWidth = parseInt(selectorText.slice(indexOfText + selector.length, indexOfText + selector.length + 4), 10);

		return (maxWidth > 0) ? maxWidth : false;
	};

	this.applyElementQueries = function (elements, values) {
		var elementWidth,
			elementHeight,
			elementsLength = elements.length;

		if (elementsLength === 0) {
			return;
		}

		for (var i = 0; i < elementsLength; i++) {
			elementWidth = elements[i].offsetWidth;
			elementHeight = elements[i].offsetHeight;

			// max width
			if ((values.maxW > 0) && (elementWidth < values.maxW)) {
				elements[i].classList.add(self.maxWSelector.split('.')[1] + values.maxW);
			}
			// min width
			if ((values.minW > 0) && (elementWidth >= values.minW)) {
				elements[i].classList.add(self.minWSelector.split('.')[1] + values.minW);
			}
			// max height
			if ((values.maxH > 0) && (elementHeight < values.maxH)) {
				elements[i].classList.add(self.maxHSelector.split('.')[1] + values.maxH);
			}
			// min height
			if ((values.minH > 0) && (elementHeight > values.minH)) {
				elements[i].classList.add(self.minHSelector.split('.')[1] + values.minH);
			}
		}
	};

	this.hideLoadingView = function () {
		document.querySelector('html').classList.remove('megapony-loading');
	};
}
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

function CssSelectorNormalizer() {
	"use strict";

	this.normalize = function (rule) {
		if (rule === undefined) {
			return rule;
		}

		var megaponySelectorRegExp = new RegExp(/(megapony)\-(max|min)\-(width|height)\-(\d*)/);
		rule = rule.replace(/^\s+|\s+$/g, '');

		if (megaponySelectorRegExp.test(rule)) {
			var rules = rule.split(' '),
				ruleArray = [];
			for (var i = 0; i < rules.length; i++) {
				if (megaponySelectorRegExp.test(rules[i])) {
					var rulesToNormalize = rules[i].split('.'),
						append = '',
						parts = [],
						currentRule;
					for (var x = 0; x < rulesToNormalize.length; x++) {
						currentRule = rulesToNormalize[x];
						if (megaponySelectorRegExp.test(currentRule)) {
							append += currentRule;
						} else {
							parts.push(currentRule);
						}
					}

					if (append.length > 0) {
						parts.push(append);
					}

					ruleArray[i] = parts.join('.');
				} else {
					ruleArray[i] = rules[i];
				}
			}
			rule = ruleArray.join(' ');
		}
		return rule;
	}
}

function ElementQueries() {
	var self = this;

	this.init = function () {
		var megaponyStylesheets = self.getMegaponyStyleSheets(),
			selectorTextString = '',
			crossRules,
			iterator = 1;

		$.each(megaponyStylesheets, function () {
			crossRules = this.rules || this.cssRules;
			for (var x = 0; x < crossRules.length; x++) {
				var cssNormalizer = new CssSelectorNormalizer();
				var rule = cssNormalizer.normalize(crossRules[x].selectorText);
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
			selectorText = '',
			maxWStr = '.megapony-max-width-',
			minWStr = '.megapony-min-width-',
			maxHStr = '.megapony-max-height-',
			minHStr = '.megapony-min-height-';

		for (var i = 0; i < elementsArray.length; i++) {
			selectorText = (elementsArray[i]) !== undefined ? (elementsArray[i]) : '';

			if (selectorText.indexOf(maxWStr) !== -1 || selectorText.indexOf(minWStr) !== -1 || selectorText.indexOf(maxHStr) !== -1 || selectorText.indexOf(minHStr) !== -1) {
				var maxWidthStartPos = selectorText.indexOf(maxWStr) + maxWStr.length,
					minWidthStartPos = selectorText.indexOf(minWStr) + minWStr.length,
					maxWidthEndPos = selectorText.indexOf(maxWStr) + maxWStr.length + 4,
					minWidthEndPos = selectorText.indexOf(minWStr) + minWStr.length + 4,

					maxHeightStartPos = selectorText.indexOf(maxHStr) + maxHStr.length,
					minHeightStartPos = selectorText.indexOf(minHStr) + minHStr.length,
					maxHeightEndPos = selectorText.indexOf(maxHStr) + maxHStr.length + 4,
					minHeightEndPos = selectorText.indexOf(minHStr) + minHStr.length + 4,

					maxWidth = parseInt(selectorText.slice(maxWidthStartPos, maxWidthEndPos), 10),
					minWidth = parseInt(selectorText.slice(minWidthStartPos, minWidthEndPos), 10),
					maxHeight = parseInt(selectorText.slice(maxHeightStartPos, maxHeightEndPos), 10),
					minHeight = parseInt(selectorText.slice(minHeightStartPos, minHeightEndPos), 10),

					values = {
						maxW: (maxWidth > 0) ? maxWidth : false,
						minW: (minWidth > 0) ? minWidth : false,
						maxH: (maxHeight > 0) ? maxHeight : false,
						minH: (minHeight > 0) ? minHeight : false
					},

					targetSelector = selectorText.split(maxWStr)[0].split(minWStr)[0].split(maxHStr)[0].split(minHStr)[0];

				self.applyElementQueries($(targetSelector), values);
			}
		}
	};

	this.applyElementQueries = function ($elements, values) {
		var $element = null;

		$elements.each(function () {
			$element = $(this);

			// max width
			if (values.maxW > 0 && !values.minW) {
				if ($element.width() < values.maxW) {
					$element.addClass('megapony-max-width-' + values.maxW);
				}
			}
			// min width
			if (values.minW > 0 && !values.maxW) {
				if ($element.width() > values.minW) {
					$element.addClass('megapony-min-width-' + values.minW);
				}
			}
			// max and min width
			if (values.maxW > 0 && values.minW > 0) {
				if ($element.width() < values.maxW && $element.width() > values.minW) {
					$element.addClass('megapony-max-width-' + values.maxW);
					$element.addClass('megapony-min-width-' + values.minW);
				}
			}
			// max height
			if (values.maxH > 0 && !values.minH) {
				if ($element.height() < values.maxH) {
					$element.addClass('megapony-max-height-' + values.maxH);
				}
			}
			// min height
			if (values.minH > 0 && !values.maxH) {
				if ($element.width() > values.minH) {
					$element.addClass('megapony-min-height-' + values.minH);
				}
			}
			// max and min height
			if (values.maxH > 0 && values.minH > 0) {
				if ($element.width() < values.maxH && $element.width() > values.minH) {
					$element.addClass('megapony-max-height-' + values.maxH);
					$element.addClass('megapony-min-height-' + values.minH);
				}
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
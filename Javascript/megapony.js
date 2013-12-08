/*jslint browser: true, nomen: false, devel: true*/
/*global $ */

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

function MegaponyObjects() {
	"use strict";

	var self = this;

	this.init = function () {
		self.checkForCollision();
	};

	this.checkForCollision = function () {
		$('[class*="megapony-object"]').each(function () {
			var $megaponyObj = $(this),
				classNames = $megaponyObj.attr('class').split(/\s+/),
				objType = '',
				i = 0;

			for (i = 0; i < classNames.length; i += 1) {
				objType = classNames[i].split('megapony-object-')[1];
				if (objType !== undefined) {
					if (objType === 'halign' || objType === 'valign-middle') {
						self.halign($megaponyObj);
					} else if (objType === 'media') {
						self.media($megaponyObj);
					} else if (objType === 'hnav') {
						self.hnav($megaponyObj);
					} else if (objType === 'vnav') {
						self.vnav($megaponyObj);
					} else if (objType.indexOf('columns-') !== -1) {
						self.columns($megaponyObj);
					}
				}
			}
		});
	};

	this.halign = function ($megaponyObj) {
		var totalChildrenWidth = 0,
			availableWidth = $megaponyObj.width() - parseInt($megaponyObj.css('padding-left'), 10) - parseInt($megaponyObj.css('padding-right'), 10),
			halignChild;

		if ($megaponyObj.hasClass('full-width')) {
			return;
		}

		$megaponyObj.children().each(function () {
			halignChild = $(this);
			totalChildrenWidth += halignChild.width();
			totalChildrenWidth += parseInt(halignChild.css('margin-left'), 10);
			totalChildrenWidth += parseInt(halignChild.css('margin-right'), 10);
		});

		if (totalChildrenWidth > availableWidth) {
			$megaponyObj.addClass('no-side-by-side');
			$megaponyObj.closest('.megapony-object-halign-container').addClass('children-no-side-by-side');
		} else if (totalChildrenWidth + 50 > availableWidth) {
			$megaponyObj.addClass('nearly-no-side-by-side side-by-side');
			$megaponyObj.closest('.megapony-object-halign-container').addClass('children-nearly-no-side-by-side');
		} else {
			$megaponyObj.addClass('side-by-side');
		}
	};

	this.media = function ($megaponyObj) {
		var $media = ($megaponyObj.find('.img').length) ? $megaponyObj.find('.img') : $megaponyObj.find('.video'),
			mediaImage = new Image(),
			imageSrc = ($media.find('img').length) ? $media.find('img').attr('src') : $media.attr('src'),
			mediaObjectIsHidden = false,
			$bd = $megaponyObj.children('.bd'),
			mediaTextMinWidth = ($bd.css('min-width') !== undefined) ? parseInt($bd.css('min-width'), 10) : 0;

		if ($media.hasClass('img')) {
			mediaImage.onload = function () {
				mediaObjectIsHidden = ($megaponyObj.width() <= 0);
				if (!mediaObjectIsHidden && ($megaponyObj.width() < this.width + parseInt($media.css('margin-left'), 10) + parseInt($media.css('margin-right'), 10) + mediaTextMinWidth)) {
					$megaponyObj.addClass('no-side-by-side');
				}
				$media.css('max-width', this.width);
			};
			mediaImage.src =  imageSrc;
		} else {
			if ($megaponyObj.width() < $media.width() + parseInt($media.css('margin-left'), 10) + parseInt($media.css('margin-right'), 10) + mediaTextMinWidth) {
				$megaponyObj.addClass('no-side-by-side');
			}
		}
	};

	this.hnav = function ($megaponyObj) {
		var $rootUL = $megaponyObj.find('> ul'),
			totalWidth = 0,
			clickEventType = (document.ontouchstart !== null) ? 'click' : 'touchstart',
			$listItem;

		$rootUL.find('> li').each(function () {
			$listItem = $(this);
			totalWidth += $listItem.width() + parseInt($listItem.css('margin-left'), 10) + parseInt($listItem.css('margin-right'), 10);
		});

		// rounding bug?!
		if (totalWidth > $rootUL.width() - parseInt($rootUL.css('padding-left'), 10) - parseInt($rootUL.css('padding-right'), 10) + 3) {
			$megaponyObj.addClass('breakpoint-small');
			$megaponyObj.closest('.megapony-object-hnav-container').addClass('hnav-breakpoint-small');
		}

		if (!$megaponyObj.hasClass('no-dropdown')) {
			$megaponyObj.addClass('dropdown');
		}

		$megaponyObj.find('.toggle').bind(clickEventType, function () {
			$rootUL.toggle();
			$(this).toggleClass('open');
		});
	};

	this.vnav = function ($megaponyObj) {
		$megaponyObj.find('.toggle').bind('click', function () {
			$megaponyObj.children('ul').toggle();
		});
	};

	this.columns = function ($megaponyObj) {
		if (self.areColumnsStacked($megaponyObj)) {
			$megaponyObj.find('[data-move-down]').each(function () {
				var $elementToMove = $(this),
					columnIndex = $elementToMove.closest('.megapony-object-column').index() + 1,
					targetColumn = columnIndex + parseInt($elementToMove.attr('data-move-down'), 10);

				$elementToMove.appendTo($megaponyObj.children(':nth-child(' + targetColumn + ')'));
			});
			$megaponyObj.find('[data-move-up]').each(function () {
				var $elementToMove = $(this),
					columnIndex = $elementToMove.closest('.megapony-object-column').index() + 1,
					targetColumn = columnIndex - parseInt($elementToMove.attr('data-move-up'), 10);

				$elementToMove.appendTo($megaponyObj.children(':nth-child(' + targetColumn + ')'));
			});
		}
	};

	this.areColumnsStacked = function ($megaponyObj) {
		return ($megaponyObj.width() === $megaponyObj.children('.megapony-object-column').first().width());
	};
}



function ElementQueries() {
	"use strict";

	var self = this,
		megaponySelectorRegExp = new RegExp(/\.(megapony)\-(max|min)\-(width|height)\-(\d*)/g),
		maxWSelector = 'megapony-max-width-',
		minWSelector = 'megapony-min-width-',
		maxHSelector = 'megapony-max-height-',
		minHSelector = 'megapony-min-height-';

	this.init = function () {
		self.parseStylesheets();
	};

	this.parseStylesheets = function () {
		var selectorTextString = '',
			crossRules,
			crossRulesLength,
			rule = '';

		self.getMegaponyStyleSheets(document.styleSheets).forEach(function (stylesheet) {
			crossRules = stylesheet.rules || stylesheet.cssRules;
			crossRulesLength = crossRules.length;

			for (var x = 0; x < crossRulesLength; x++) {
				rule = crossRules[x].selectorText;
				selectorTextString += rule + ';';
			}
			self.checkSelectorsForElementQuery(selectorTextString);
		});
	};

	this.getMegaponyStyleSheets = function (stylesheets) {
		var megaponyStylesheets = [],
			stylesheetsLength = stylesheets.length;

		for (var i = 0; i < stylesheetsLength; i++) {
			if (stylesheets[i].title === 'megapony') {
				megaponyStylesheets.push(stylesheets[i]);
			}
		}
		return megaponyStylesheets;
	};

	this.checkSelectorsForElementQuery = function (selectorTextString) {
		var elements = selectorTextString.split(';'),
			elementsLength = elements.length,
			selectorText = '';

		for (var i = 0; i < elementsLength; i++) {
			selectorText = (elements[i] !== undefined) ? (elements[i]) : '';
			if (selectorText.match(megaponySelectorRegExp) !== null) {
				self.selectorContainsElementQueries(selectorText);
			}
		}
	};

	this.selectorContainsElementQueries = function (selectorText) {
		var targets = selectorText.split(','),
			targetsLength = targets.length,
			storedTargetSelector = '';

		for (var x = 0; x < targetsLength; x++) {
			if (storedTargetSelector !== self.getTargetSelector(targets[x])) {
				self.applyElementQueries(document.querySelectorAll(self.getTargetSelector(targets[x])), self.getWidthAndHeightFromSelector(selectorText));
			}
			storedTargetSelector = self.getTargetSelector(targets[x]);
		}
	};

	this.getWidthAndHeightFromSelector = function (selectorText) {
		return {
			maxW: self.getLengthFromSelector(maxWSelector, selectorText),
			minW: self.getLengthFromSelector(minWSelector, selectorText),
			maxH: self.getLengthFromSelector(maxHSelector, selectorText),
			minH: self.getLengthFromSelector(minHSelector, selectorText)
		};
	};

	this.getTargetSelector = function (selectorText) {
		var selectorPosition = selectorText.search(megaponySelectorRegExp);

		selectorText = selectorText.replace(megaponySelectorRegExp, '');

		if (selectorText.indexOf(' ', selectorPosition) !== -1) {
			return selectorText.substring(0, selectorText.indexOf(' ', selectorPosition));
		} else {
			return selectorText;
		}
	};

	this.getLengthFromSelector = function (selector, selectorText) {
		var indexOfText = selectorText.indexOf(selector),
			value = parseInt(selectorText.slice(indexOfText + selector.length, indexOfText + selector.length + 4), 10);

		return (value > 0) ? value : false;
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

			if ((values.maxW > 0 && !values.minW) && (elementWidth < values.maxW)) {
				elements[i].classList.add(maxWSelector + values.maxW); // max width
			}
			if ((values.minW > 0 && !values.maxW) && (elementWidth >= values.minW)) {
				elements[i].classList.add(minWSelector + values.minW); // min width
			}
			if ((values.maxW > 0 && values.minW > 0) && (elementWidth < values.maxW && elementWidth >= values.minW)) {
				elements[i].classList.add(maxWSelector + values.maxW); // max and min width used in combination
				elements[i].classList.add(minWSelector + values.minW);
			}
			if ((values.maxH > 0 && !values.minH) && (elementHeight < values.maxH)) {
				elements[i].classList.add(maxHSelector + values.maxH); // max height
			}
			if ((values.minH > 0 && !values.maxH) && (elementHeight > values.minH)) {
				elements[i].classList.add(minHSelector + values.minH); // min height
			}
			if ((values.maxH > 0 && values.minH > 0) && (elementHeight < values.maxH && elementHeight > values.minH)) {
				elements[i].classList.add(maxHSelector + values.maxH);// max and min height used in combination
				elements[i].classList.add(minHSelector + values.minH);
			}
		}
	};
}


(function () {
	"use strict";

	$(document).ready(function ($) {
		var elQ = new ElementQueries(),
			mpObjects = new MegaponyObjects();

		elQ.init();
		mpObjects.init();
		document.querySelector('html').classList.remove('megapony-loading'); // Hide loading animation
	});

}());
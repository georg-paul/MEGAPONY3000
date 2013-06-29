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

(function () {
	"use strict";

	$(document).ready(function () {

		var megaponyObjects = (function () {

			var init = function () {
					initMegaponyObjects();
				},
				initMegaponyObjects = function () {
					$('[class*="megapony-object"]').each(function () {
						var $megaponyObj = $(this),
							classNames = $megaponyObj.attr('class').split(/\s+/),
							objType = '';

						for (var i = 0; i < classNames.length; i++) {
							objType = classNames[i].split('megapony-object-')[1];
							if (objType === 'halign' || objType === 'valign-middle') {
								halign($megaponyObj);
							} else if (objType === 'media') {
								media($megaponyObj);
							} else if (objType === 'hnav' && !$megaponyObj.hasClass('no-dropdown')) {
								hnav($megaponyObj);
							} else if (objType === 'vnav') {
								vnav($megaponyObj);
							}
						}
					});
				},

				halign = function ($megaponyObj) {
					var leftWidth = 0,
						centerWidth = 0,
						rightWidth = 0,
						totalWidth = 0,
						pageHasVerticalScrollbar = document.body.scrollHeight > document.body.clientHeight,
						scrollBarWidth = pageHasVerticalScrollbar ? 20 : 0; // dirty, default value of 20 px, exact calculation needed -> http://davidwalsh.name/detect-scrollbar-width?

					$megaponyObj.find('> .left').each(function () { leftWidth += $(this).outerWidth(true); });
					$megaponyObj.find('> .center').each(function () { centerWidth += $(this).outerWidth(true); });
					$megaponyObj.find('> .right').each(function () { rightWidth += $(this).outerWidth(true); });

					totalWidth = leftWidth + centerWidth + rightWidth;

					if (totalWidth > $megaponyObj.width() - scrollBarWidth) {
						$megaponyObj.addClass('no-side-by-side');
						$megaponyObj.closest('.megapony-object-halign-container').addClass('children-no-side-by-side');
					} else if (totalWidth + window.megapony3000.halignSafetyMargin > $megaponyObj.width()) {
						$megaponyObj.addClass('nearly-no-side-by-side');
						$megaponyObj.closest('.megapony-object-halign-container').addClass('children-nearly-no-side-by-side');
					}
				},

				media = function ($megaponyObj) {
					var $img = $megaponyObj.find('.img'),
						$content = $megaponyObj.find('.bd');

					if ($img.height() * 1.8 < $content.height()) {
						$content.addClass('in-text');
					}
				},

				hnav = function ($megaponyObj) {
					var $rootUL = $megaponyObj.find('> ul'),
						totalWidth = 0,
						clickEventType = (document.ontouchstart !== null) ? 'click' : 'touchstart';

					$rootUL.find('> li').each(function () {
						totalWidth += $(this).outerWidth(true);
					});

					// rounding bug?!
					if (totalWidth > $rootUL.width() + 3) {
						$megaponyObj.addClass('breakpoint-small');
					}

					$megaponyObj.find('.toggle').bind(clickEventType, function () {
						$rootUL.toggle();
						$(this).toggleClass('open');
					});
				},

				vnav = function ($megaponyObj) {
					var $rootUl = $megaponyObj.find('> ul'),
						$active = $rootUl.find('> li.active');

					if (!$active.length) {
						$rootUl.addClass('no-active-item');
						$rootUl.find('> li').show();
					}

					$active.find('a').bind('click', function (e) {
						if ($active.is(':visible') && $active.css('position') === 'absolute') {
							e.preventDefault();
							$active.siblings().toggle();
							$(this).toggleClass('open');
						}
					});
				};

			return { init: init };
		}());



		var elementQueries = (function () {

			var init = function () {
					var megaponyStylesheets = getMegaponyStyleSheets(),
						megaponyStylesheetCount = getMegaponyStyleSheetCount(megaponyStylesheets),
						selectorTextString = '',
						crossRules,
						iterator = 1;

					$.each(megaponyStylesheets, function () {
						crossRules = this.rules || this.cssRules;
						for (var x = 0; x < crossRules.length; x++) {
							selectorTextString += crossRules[x].selectorText + ';';
						}
						
						if (isSelectorTextSupportedCorrectly(selectorTextString)) {
							checkSelectorsForElementQuery(selectorTextString);
							if (megaponyStylesheetCount === iterator) {
								megaponyObjects.init();
								hideLoadingView();
							}
						} else {
							if (megaponyStylesheetCount === iterator) {
								ajaxParseFallback(this.href, true);
							} else {
								ajaxParseFallback(this.href, false);
							}
						}
						iterator++;
					});
				},

				getMegaponyStyleSheets = function () {
					var megaponyStylesheets = new Object();
					$.each(document.styleSheets, function (i) {
						var stylesheet = this;
						if (stylesheet.title === 'megapony') {
							megaponyStylesheets[i] = stylesheet;
						}
					});
					return megaponyStylesheets;
				},

				getMegaponyStyleSheetCount = function (megaponyStylesheets) {
					var count = 0,
						i;

					for (i in megaponyStylesheets) {
						if (megaponyStylesheets.hasOwnProperty(i)) {
							count++;
						}
					}
					return count;
				},

				ajaxParseFallback = function (cssPath, isLast) {
					$.ajax({
						url: cssPath,
						dataType: 'text',
						success: function (response) {
							var parser = new CSSParser(),
								sheet = parser.parse(response, false, true),
								parsedDom = '',
								selectorText = '';

							if (sheet) {
								sheet.resolveVariables('screen');
								for (var i = 0; i < sheet.cssRules.length; i++) {
									selectorText = (sheet.cssRules[i].mSelectorText) !== undefined ? (sheet.cssRules[i].mSelectorText) : '';
									parsedDom += selectorText + ';';
								}
								checkSelectorsForElementQuery(parsedDom);
							}
							if (isLast) {
								megaponyObjects.init();
								hideLoadingView();
							}
						}
					});
				},

				checkSelectorsForElementQuery = function (selectorTextString) {
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

							applyElementQueries($(targetSelector), values);
						}
					}
				},

				applyElementQueries = function ($elements, values) {
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
				},

				hideLoadingView = function () {
					$('html').removeClass('megapony-loading');
				},

				isSelectorTextSupportedCorrectly = function (parsedDom) {
					return parsedDom.split('.megapony-max-width-123')[0].indexOf('.is-selectorText-supported-correctly') !== -1;
				};

			return { init: init };
		}());

		elementQueries.init();

	});
}());
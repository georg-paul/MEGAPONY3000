/*jslint browser: true, nomen: false, devel: true*/
/*global $, jQuery, Modernizr */

(function () {
	"use strict";

	$(document).ready(function () {
		var avoidLayoutBreak = (function () {

			var init = function () {
					checkForCollision();
					$(window).bind('orientationchange', function () {
						checkForCollision();
					});
				},
				checkForCollision = function () {
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
							} else if (objType === 'hnav') {
								hnav($megaponyObj);
							}
						}
					});
				},

				halign = function ($megaponyObj) {
					var $left = $megaponyObj.find('> .left'),
						$center = $megaponyObj.find('> .center'),
						$right = $megaponyObj.find('> .right'),
						leftWidth = 0,
						centerWidth = 0,
						rightWidth = 0,
						totalWidth = 0,
						safetyMargin = window.megapony3000.safetyMargin;

					if ($left.length || $right.length) {
						$left.each(function () {
							leftWidth += $(this).outerWidth(true);
						});
						$center.each(function () {
							centerWidth += $(this).outerWidth(true);
						});
						$right.each(function () {
							rightWidth += $(this).outerWidth(true);
						});

						totalWidth = leftWidth + centerWidth + rightWidth;

						if (totalWidth > $megaponyObj.width()) {
							$megaponyObj.addClass('no-side-by-side');
							$megaponyObj.closest('.megapony-object-halign-container').addClass('children-no-side-by-side');
						} else if (totalWidth + safetyMargin > $megaponyObj.width()) {
							$megaponyObj.addClass('nearly-no-side-by-side');
							$megaponyObj.closest('.megapony-object-halign-container').addClass('children-nearly-no-side-by-side');
						}
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
						totalWidth = 0;

					$rootUL.find('> li').each(function () {
						totalWidth += $(this).outerWidth(true);
					});

					// rounding bug?!
					if (totalWidth > $rootUL.width() + 3) {
						$megaponyObj.addClass('breakpoint-small');
						$megaponyObj.find('.toggle').bind('click', function () {
							$rootUL.slideToggle();
						});
					}
				};

			return { init: init };
		}());



		var elementQueries = (function () {

			var init = function () {
					$.ajax({
						url: window.megapony3000.cssPath,
						dataType: 'text',
						success: function (response) {
							var parser = new CSSParser(),
								sheet = parser.parse(response, false, true),
								medium = 'screen';

							if (sheet) {
								sheet.resolveVariables(medium);
								checkElementBreakpoints(sheet.cssRules);
								$(window).bind('orientationchange', function () {
									checkElementBreakpoints(sheet.cssRules);
								});
							}

							avoidLayoutBreak.init();
						}
					});
				},

				checkElementBreakpoints = function (elementsObject) {
					for (var i = 0; i < elementsObject.length; i++) {
						var selectorText = (elementsObject[i].mSelectorText) !== undefined ? (elementsObject[i].mSelectorText) : '';

						if (selectorText.indexOf('.megapony-max-width-') !== -1 || selectorText.indexOf('.megapony-min-width-') !== -1) {
							var targetSelector = elementsObject[i].selectorText().split('.megapony-max')[0].split('.megapony-min')[0],
								storedSelector,
								maxWidthStr = '.megapony-max-width-',
								minWidthStr = '.megapony-min-width-',
								maxWidthStartPos = selectorText.indexOf(maxWidthStr) + maxWidthStr.length,
								minWidthStartPos = selectorText.indexOf(minWidthStr) + minWidthStr.length,
								maxWidthEndPos = selectorText.indexOf(maxWidthStr) + maxWidthStr.length + 4,
								minWidthEndPos = selectorText.indexOf(minWidthStr) + minWidthStr.length + 4,
								maxWidth = parseInt(selectorText.slice(maxWidthStartPos, maxWidthEndPos), 10),
								minWidth = parseInt(selectorText.slice(minWidthStartPos, minWidthEndPos), 10),
								values = {
									maxW: (maxWidth > 0) ? maxWidth : false,
									minW: (minWidth > 0) ? minWidth : false
								};

							//if (targetSelector !== storedSelector) {
								storedSelector = targetSelector;
								applyElementQueries($(targetSelector), values);
							//}
						}
					}
				},

				applyElementQueries = function ($element, values) {

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
				};

			return { init: init };
		}());

		elementQueries.init();

	});
}());
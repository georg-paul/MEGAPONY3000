/*jslint browser: true, nomen: false, devel: true*/
/*global $, jQuery, Modernizr */

(function () {
    "use strict";

    $(document).ready(function () {
		var avoidLayoutBreak = (function () {

			var init = function () {
					checkForCollision();
					$(window).bind('resize', checkForCollision);
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
						rightWidth = 0;

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

						if (leftWidth + centerWidth + rightWidth > $megaponyObj.width()) {
							$megaponyObj.addClass('no-side-by-side');
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
					if (totalWidth > $rootUL.width() + 5) {
						$megaponyObj.addClass('breakpoint-small');
					}

				};

			return { init: init };
		}());
		
        var elementQueries = (function () {

            var init = function () {
                    $.ajax({
                        url: 'css/master.css',
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
						var selectorText = elementsObject[i].selectorText(),
							$element = null,
							maxWidth = 0,
							minWidth = 0,
							maxWidthStr,
							minWidthStr,
							maxWidthStartPos,
							minWidthStartPos,
							maxWidthEndPos,
							minWidthEndPos;

						if (selectorText.indexOf('.megapony-max-width-') !== -1 || selectorText.indexOf('.megapony-min-width-') !== -1) {
							//console.log(selectorText);

							if (selectorText.indexOf('.megapony-max-width-') !== -1 && selectorText.indexOf('.megapony-min-width-') === -1) { // only max-width
								$element = $(elementsObject[i - 1].selectorText());
								maxWidthStr = '.megapony-max-width-';
								maxWidthStartPos = selectorText.indexOf(maxWidthStr) + maxWidthStr.length;
								maxWidthEndPos = selectorText.indexOf(maxWidthStr) + maxWidthStr.length + 4;
								maxWidth = parseInt(selectorText.slice(maxWidthStartPos, maxWidthEndPos), 10);

								//console.log(maxWidth);

								if (maxWidthReached($element, maxWidth)) {
									$element.addClass('megapony-max-width-' + maxWidth);
								}
							} else if (selectorText.indexOf('.megapony-min-width-') !== -1 && selectorText.indexOf('.megapony-max-width-') === -1) { // only min-width
								$element = $(elementsObject[i - 1].selectorText());
								minWidthStr = '.megapony-min-width-';
								minWidthStartPos = selectorText.indexOf(minWidthStr) + minWidthStr.length;
								minWidthEndPos = selectorText.indexOf(minWidthStr) + minWidthStr.length + 4;
								maxWidth = parseInt(selectorText.slice(maxWidthStartPos, maxWidthEndPos), 10);
								minWidth = parseInt(selectorText.slice(minWidthStartPos, minWidthEndPos), 10);

								//console.log(minWidth);

								if (minWidthReached($element, minWidth)) {
									$element.addClass('megapony-min-width-' + minWidth);
								}

							} else { // min-width AND max-width
								var temp = elementsObject[i].selectorText().split('.megapony-max')[0];
								temp = temp.split('.megapony-min')[0];
								$element = $(temp);
								maxWidthStr = '.megapony-max-width-';
								maxWidthStartPos = selectorText.indexOf(maxWidthStr) + maxWidthStr.length;
								maxWidthEndPos = selectorText.indexOf(maxWidthStr) + maxWidthStr.length + 4;
								minWidthStr = '.megapony-min-width-';
								minWidthStartPos = selectorText.indexOf(minWidthStr) + minWidthStr.length;
								minWidthEndPos = selectorText.indexOf(minWidthStr) + minWidthStr.length + 4;
								maxWidth = parseInt(selectorText.slice(maxWidthStartPos, maxWidthEndPos), 10);
								minWidth = parseInt(selectorText.slice(minWidthStartPos, minWidthEndPos), 10);

								//console.log($element, maxWidth, minWidth);

								if (maxAndMinWidthReached($element, maxWidth, minWidth)) {
									$element.addClass('megapony-max-width-' + maxWidth);
									$element.addClass('megapony-min-width-' + minWidth);
								}
							}
						}
					}
				},

				maxWidthReached = function ($element, value) {
					if ($element.width() < value) {
						return true;
					}
				},

				minWidthReached = function ($element, value) {
					//console.log($element.width(), value);
					if ($element.width() > value) {
						return true;
					}
				},

				maxAndMinWidthReached = function ($element, maxWidthValue, minWidthValue) {
					//console.log($element.width(), maxWidthValue, minWidthValue);
					if ($element.width() < maxWidthValue && $element.width() > minWidthValue) {
						return true;
					}
				};

                return { init: init };
        }());

        elementQueries.init();

    });
}());
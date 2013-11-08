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
			availableWidth = $megaponyObj.width();

		if ($megaponyObj.hasClass('full-width')) {
			return;
		}

		$megaponyObj.find('> .left, > .center, > .right').each(function () {
			totalChildrenWidth += $(this).outerWidth(true);
		});

		if (totalChildrenWidth > availableWidth) {
			$megaponyObj.addClass('no-side-by-side');
			$megaponyObj.closest('.megapony-object-halign-container').addClass('children-no-side-by-side');
		} else if (totalChildrenWidth + window.megapony3000.halignSafetyMargin > availableWidth) {
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
			mediaObjectIsHidden = false;

		if ($media.hasClass('img')) {
			mediaImage.onload = function () {
				mediaObjectIsHidden = ($megaponyObj.width() <= 0);
				if (!mediaObjectIsHidden && ($megaponyObj.width() < this.width + window.megapony3000.mediaMargin + window.megapony3000.mediaTextMinWidth)) {
					$megaponyObj.addClass('no-side-by-side');
				}
				$media.css('max-width', this.width);
			};
			mediaImage.src =  imageSrc;
		} else {
			if ($megaponyObj.width() < $media.outerWidth(true) + window.megapony3000.mediaTextMinWidth) {
				$megaponyObj.addClass('no-side-by-side');
			}
		}
	};

	this.hnav = function ($megaponyObj) {
		var $rootUL = $megaponyObj.find('> ul'),
			totalWidth = 0,
			clickEventType = (document.ontouchstart !== null) ? 'click' : 'touchstart';

		$rootUL.find('> li').each(function () {
			totalWidth += $(this).outerWidth(true);
		});

		// rounding bug?!
		if (totalWidth > $rootUL.width() + 3) {
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

	this.columns = function ($megaponyObj) {
		if (self.areColumnsStacked($megaponyObj)) {
			$megaponyObj.find('[data-move-down], [data-move-up]').each(function () {
				var $elementToMove = $(this),
					columnIndex = $elementToMove.closest('.megapony-object-column').index() + 1,
					targetColumn = ($elementToMove.attr('data-move-down') !== undefined) ? columnIndex + parseInt($elementToMove.attr('data-move-down'), 10) : columnIndex - parseInt($elementToMove.attr('data-move-up'), 10);

				$elementToMove.appendTo($megaponyObj.find('> :nth-child(' + targetColumn + ')'));
			});
		}
	};

	this.areColumnsStacked = function ($megaponyObj) {
		return ($megaponyObj.width() === $megaponyObj.find('> .megapony-object-column:first').width());
	};
}
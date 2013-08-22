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

function InitPlugins() {
	"use strict";

	var self = this;

	this.init = function () {
		if (megapony3000.enableResponsiveTables) {
			self.initResponsiveTables();
		}
		if (megapony3000.enableLightbox) {
			self.initLightbox();
		}
		if (megapony3000.enableResponsiveVideos) {
			self.initFitVids();
		}
	};

	this.initResponsiveTables = function () {
		$('.megapony-rwd-table-container table').stacktable();
	};

	this.initLightbox = function () {
		$('.lightbox-image').magnificPopup({
			type: 'image',
			gallery: {
				enabled: false,
				tCounter: '<span class="mfp-counter">%curr%/%total%</span>',
				tNext: 'next',
				tPrev: 'previous'
			},
			image: {
				titleSrc: function (item) {
					var $img = $(item.el),
						myTitle = $img.closest('.csc-textpic-image').find('.csc-textpic-caption').text();

					return myTitle;
				}
			},
			tClose: 'close'
		});
	};

	this.initFitVids = function () {
		var $videoContainers = $(),
			$videos = $('.megapony-video'),
			$iframe;

		$videos.each(function () {
			$videoContainers.push($(this));
		});

		$videoContainers.each(function () {
			$iframe = $(this).find('iframe');

			// add wmode paramter to iframe src
			$iframe.attr('src', self.appendParamToUrl($iframe.attr('src'), 'wmode=transparent'));

			// init plugin
			$(this).fitVids();
		});
	};

	this.appendParamToUrl = function (url, param) {
		return (url.indexOf('?') > 0) ? url + '&' + param : url + '?' + param;
	};
}

(function () {
	"use strict";

	$(document).ready(function () {
		var initPlugins = new InitPlugins();
		initPlugins.init();
	});

}());
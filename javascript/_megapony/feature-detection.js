/*jslint browser: true, nomen: false, devel: true*/

(function () {
	"use strict";

	var featureDetection = (function () {

		var init = function () {
			document.getElementsByTagName('html')[0].className =
			document.getElementsByTagName('html')[0].className.replace(/(?:^|\s)javascript-is-disabled(?!\S)/g, 'javascript-is-enabled');
		};

		return { init: init };
	}());

	featureDetection.init();

}());
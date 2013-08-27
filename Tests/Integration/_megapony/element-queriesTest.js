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

function IntegrationTests() {
	"use strict";

	var self = this,
		testsOK = true,
		resultClass = '';

	this.init = function () {
		self.maxWidthTests();
		self.minWidthTests();
	};

	this.maxWidthTests = function () {
		var $target = $('#max-width-target'),
			$targetContainer = $('#test-max-width .bd'),
			elQ = null;

		// test 1
		$targetContainer.css('width', 790);
		elQ = new ElementQueries();
		elQ.init();
		testsOK = ($target.css('color') === 'rgb(255, 0, 0)' && testsOK) ? testsOK : false;
		console.log('Integration Test 1: ' + self.returnResultClass(testsOK));

		// test 2
		$targetContainer.css('width', 810);
		$target.removeClass('megapony-max-width-800');
		elQ = new ElementQueries();
		elQ.init();
		testsOK = ($target.css('color') === 'rgb(0, 0, 0)' && testsOK) ? testsOK : false;
		resultClass = (testsOK) ? 'success' : 'failure';
		console.log('Integration Test 2: ' + self.returnResultClass(testsOK));

		// Display success or failure (green or red)
		$('#test-max-width .test-results').addClass(self.returnResultClass(testsOK));
	};

	this.minWidthTests = function () {
		var $target = $('#min-width-target'),
			$targetContainer = $('#test-min-width .bd'),
			elQ = null;

		// test 3
		$target.removeClass('megapony-min-width-800');
		$targetContainer.css('width', 800);
		elQ = new ElementQueries();
		elQ.init();
		testsOK = ($target.css('color') === 'rgb(255, 0, 0)' && testsOK) ? testsOK : false;
		console.log('Integration Test 3: ' + self.returnResultClass(testsOK));

		// test 4
		$target.removeClass('megapony-min-width-800');
		$targetContainer.css('width', 400);
		elQ = new ElementQueries();
		elQ.init();
		testsOK = ($target.css('color') === 'rgb(0, 0, 0)' && testsOK) ? testsOK : false;
		resultClass = (testsOK) ? 'success' : 'failure';
		console.log('Integration Test 4: ' + self.returnResultClass(testsOK));

		// Display success or failure (green or red)
		$('#test-min-width .test-results').addClass(self.returnResultClass(testsOK));
	};

	this.returnResultClass = function (testResultBoolean) {
		return (testResultBoolean) ? 'success' : 'failure';
	};
}

(function () {
	"use strict";

	$(document).ready(function () {
		var integrationTests = new IntegrationTests();
		integrationTests.init();
	});

}());
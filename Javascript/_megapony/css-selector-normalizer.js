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

function CssSelectorNormalizer() {
	"use strict";

	var self = this;

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
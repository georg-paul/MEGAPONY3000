ROADMAP
============

MEGAPONY Release 0.5.0
-------------------------
* Bugfixes (this->context)
* Grid Solution (1)
* Refactoring/Cleanup (blocks new features)
* Enhanced CSS Object hnav ("classic" or "dropdown")
* New mixins (reset-columns, toggle-column)
* Double Tap To Go Feature


MEGAPONY Release 0.6.0
-------------------------
* /* */ comments breaks CSS parser


MEGAPONY Release 1.0.0
-------------------------
* New CSS Objects (valign, vnav)
* Avoid FOUC due to CSS parser (loading animation till completion)
* Switch position classes (to get more flexible in order of elements) (.switch-position-with-xxx?)
* Enhanced Framework Design
* New element queries (min-height & max-height)
* Bugfixes


MEGAPONY Release 1.5.0
-------------------------
* UI Components (forms, buttons,...)
* Integration Tests


MEGAPONY Release 1.8.0
-------------------------
* Use Framework for an example site


(1)
============
* .megapony-object-columns-2-8-4, megapony-object-columns-3-3-6-3
* Every columns can be collapsed/expanded with mixin toggle-columns (:before and :after is used for generating Headline and toggle icon)
* An Additional class "equal-height" makes the height of the columns - guess what? - equal
* By setting a max-width (in pixel) for a column, the column should not be fluid
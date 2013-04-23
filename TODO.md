ROADMAP
============

### MEGAPONY Release 0.5.0 (early alpha) ###
* <del>Avoid FOUC due to CSS parser (loading animation till completion)</del>
* <del>New element queries (min-height & max-height)</del>
* <del>Bugfix (this context -> $element for each)</del>
* Grid Solution 1)
* <del>/* */ comments might break CSS parser</del>
* Refactoring/Cleanup
* http://drublic.de/blog/rem-fallback-sass-less/


### MEGAPONY Release 0.6.0 ###
* Enhanced CSS Object hnav ("classic" or "dropdown")
* New mixins (reset-columns, toggle-column)

### MEGAPONY Release 1.0.0 (beta) ###
* New CSS Objects (valign, vnav)
* Double Tap To Go Feature
* Switch position classes (to get more flexible in order of elements) (.switch-position-with-xxx?)
* Enhanced Framework Design

### MEGAPONY Release 1.5.0 ###
* UI Components (forms, buttons,...)
* Integration Tests


### MEGAPONY Release 1.8.0 (stable) ###
* Add example site with implemented framework



#### 1) ####
* .megapony-object-columns-2-8-4, megapony-object-columns-3-3-6-3
* Every columns can be collapsed/expanded with mixin toggle-columns (:before and :after is used for generating Headline and toggle icon)
* An Additional class "equal-height" makes the height of the columns equal
* By setting a max-width (in pixel) for a column, the column should be fixed, not fluid

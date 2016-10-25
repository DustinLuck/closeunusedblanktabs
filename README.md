Close Unused Blank Tabs
=======================
Every time a new tab is created, all blank tabs will be closed (except the active tab)

Version history
---------------
###0.0.6 (2016-10-25)
* Code optimization
* Switched trigger to tab creation event due to some new tabs not being caught

###0.0.5 (2016-10-24)
* Updated code to use WebExtensions

###0.0.4 (2016-01-06)
* Fixed bug where opening a blank tab in a background window could close tabs in a foreground window
* Minor code optimization

###0.0.3 (2015-12-18)
* Added `about:home` to list of blank tab addresses
* Added test to ensure that only tabs that have completed loading get closed
* Removed extraneous files
* Removed debug lines

###0.0.2 (2015-12-18)
* Initial Release
Close Unused Blank Tabs
=======================
Each time you open a new tab, this extension will close any blank tab you opened and forgot about (except the active one). Don't let those unused blank tabs sit around doing nothing.

I built this extension because I start my browser with a blank tab and launching a bookmark set to open in a new tab would always leave that initial blank tab to clean up. You may find it useful in other cases too!

Version history
---------------
### 0.1.2 (2026-11-23)
* Replaced full tab scans with tracking of blank tabs, checking only tracked tabs when a new tab opens
* Added options to customize blank tab URLs

### 0.0.7 (2016-11-16)
* Suppressed closing new background tabs due to change in the way FF50 handles tab events

### 0.0.6 (2016-10-25)
* Code optimization
* Switched trigger to tab creation event due to some new tabs not being caught

### 0.0.5 (2016-10-24)
* Updated code to use WebExtensions

### 0.0.4 (2016-01-06)
* Fixed bug where opening a blank tab in a background window could close tabs in a foreground window
* Minor code optimization

### 0.0.3 (2015-12-18)
* Added `about:home` to list of blank tab addresses
* Added test to ensure that only tabs that have completed loading get closed
* Removed extraneous files
* Removed debug lines

### 0.0.2 (2015-12-18)
* Initial Release
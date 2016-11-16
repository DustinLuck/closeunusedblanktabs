/*
Close Unused Blank Tabs - A Firefox extension to close blank tabs that are not used

Copyright (c) 2016 Dustin Luck

This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with this program. If not, see http://www.gnu.org/licenses/.

Contact the author at http://www.dustinluck.com/contact
*/

const stateComplete = "complete"
const blankTabUrls = ['about:blank', 'about:home', 'about:newtab', 'about:privatebrowsing'];

function handleCreated(sourceTab)
{
    chrome.tabs.query({windowId: sourceTab.windowId}, function(tabs)
    {
        for (var tab of tabs) {
            if (! tab.active
                && tab.id !== sourceTab.id
                && tab.status === stateComplete
                && blankTabUrls.includes(tab.url))
            {
                chrome.tabs.remove(tab.id);
            }
        }
    });
}

chrome.tabs.onCreated.addListener(handleCreated);
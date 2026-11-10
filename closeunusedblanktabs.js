/*
Close Unused Blank Tabs - A Firefox extension to close blank tabs that are not used

Copyright (c) 2016 Dustin Luck

This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with this program. If not, see http://www.gnu.org/licenses/.

Contact the author at http://www.dustinluck.com/contact
*/

const stateComplete = "complete";

const blankTabUrls = new Set([
    "about:blank",
    "about:home",
    "about:newtab",
    "about:privatebrowsing"
]);

const blankTabs = new Map();

function isBlankTab(tab)
{
    return blankTabUrls.has(tab.url);
}

function trackTab(tab)
{
    if (isBlankTab(tab))
    {
        blankTabs.set(tab.id, tab.windowId);
    }
    else
    {
        blankTabs.delete(tab.id);
    }
}

function handleTabCreated(sourceTab)
{
    trackTab(sourceTab);

    for (const [tabId, windowId] of blankTabs)
    {
        if (tabId === sourceTab.id || windowId !== sourceTab.windowId)
        {
            continue;
        }

        chrome.tabs.get(tabId, function(tab)
        {
            if (chrome.runtime.lastError)
            {
                blankTabs.delete(tabId);
                return;
            }

            if (!isBlankTab(tab))
            {
                blankTabs.delete(tab.id);
                return;
            }
            if (!tab.active &&
                tab.status === stateComplete)
            {
                chrome.tabs.remove(tab.id);
            }
        });
    }
}

function handleTabUpdated(tabId, changeInfo, tab)
{
    if (changeInfo.url !== undefined)
    {
        trackTab(tab);
    }
}

function handleTabRemoved(tabId)
{
    blankTabs.delete(tabId);
}

chrome.tabs.onCreated.addListener(handleTabCreated);
chrome.tabs.onUpdated.addListener(handleTabUpdated);
chrome.tabs.onRemoved.addListener(handleTabRemoved);

chrome.tabs.query({}, (tabs) =>
{
    for (const tab of tabs) {
        trackTab(tab);
    }
});

/*
Close Unused Blank Tabs - A Firefox extension to close blank tabs that are not used

Copyright (c) 2016 - 2026 Dustin Luck

This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with this program. If not, see http://www.gnu.org/licenses/.

Report issues via github: https://github.com/DustinLuck/closeunusedblanktabs/issues
*/

const stateComplete = "complete";

const DEFAULT_BLANK_URLS = [
    "about:blank",
    "about:home",
    "about:newtab",
    "about:privatebrowsing",
    "chrome://browser/content/blanktab.html"
];

let blankTabUrls = new Set(DEFAULT_BLANK_URLS);
const blankTabs = new Map();

function init()
{
    chrome.storage.sync.get({ "blankTabUrls": DEFAULT_BLANK_URLS }, (data) =>
    {
        blankTabUrls = new Set(data.blankTabUrls);
        blankTabs.clear();

        chrome.tabs.query({}, (tabs) =>
        {
            for (const tab of tabs)
            {
                trackTab(tab);
            }
        });
    });
}

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

function handleExtensionInstalled(details)
{
    if (details.reason !== "install")
    {
        return;
    }

    chrome.storage.sync.get("blankTabUrls", (data) =>
    {
        if (chrome.runtime.lastError)
        {
            console.error(`Unable to load blank tab URLs: ${chrome.runtime.lastError.message}`);
            return;
        }
        if (Object.prototype.hasOwnProperty.call(data, "blankTabUrls"))
        {
            return;
        }

        chrome.storage.sync.set({ blankTabUrls: DEFAULT_BLANK_URLS }, () =>
        {
            if (chrome.runtime.lastError)
            {
                console.error(`Unable to initialize blank tab URLs: ${chrome.runtime.lastError.message}`);
            }
        });
    });
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

function handleStorageChanged(changes)
{
    if (changes.blankTabUrls)
    {
        init();
    }
}

function handleRestoreBlankTabUrls(sendResponse)
{
    chrome.storage.sync.set({ blankTabUrls: DEFAULT_BLANK_URLS }, () =>
    {
        if (chrome.runtime.lastError)
        {
            sendResponse({ error: chrome.runtime.lastError.message });
            return;
        }

        sendResponse({ blankTabUrls: DEFAULT_BLANK_URLS });
    });

    return true;
}

function handleMessage(message, sender, sendResponse)
{
    switch (message?.action)
    {
        case "restoreBlankTabUrls":
            return handleRestoreBlankTabUrls(sendResponse);
    }
}

chrome.runtime.onMessage.addListener(handleMessage);
chrome.tabs.onCreated.addListener(handleTabCreated);
chrome.tabs.onUpdated.addListener(handleTabUpdated);
chrome.tabs.onRemoved.addListener(handleTabRemoved);
chrome.storage.sync.onChanged.addListener(handleStorageChanged);
chrome.runtime.onInstalled.addListener(handleExtensionInstalled);
init();
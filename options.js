const textarea = document.getElementById("urls");
const statusElement = document.getElementById("status");
let statusTimeout;

function showStatus(message, isError = false, clearAfterMs = 0)
{
    clearTimeout(statusTimeout);
    statusTimeout = undefined;
    statusElement.textContent = message;
    statusElement.style.color = isError ? "red" : "green";

    if (clearAfterMs > 0)
    {
        statusTimeout = setTimeout(() =>
        {
            statusElement.textContent = "";
            statusTimeout = undefined;
        }, clearAfterMs);
    }
}

function setUrlTextarea(urls)
{
    textarea.value = urls.join("\n");
}

function handleUrlsLoaded(data)
{
    if (chrome.runtime.lastError)
    {
        showStatus(`Unable to load URLs: ${chrome.runtime.lastError.message}`, true);
        return;
    }
    if (!data || !Array.isArray(data.blankTabUrls))
    {
        showStatus("Unable to load saved URLs.", true);
        return;
    }

    setUrlTextarea(data.blankTabUrls);
}

function handleSave()
{
    const urls = textarea.value
        .split("\n")
        .map(line => line.trim())
        .filter(Boolean);

    setUrlTextarea(urls);
    chrome.storage.sync.set({ blankTabUrls: urls }, handleUrlsSaved);
}

function handleUrlsSaved()
{
    if (chrome.runtime.lastError)
    {
        showStatus(`Unable to save: ${chrome.runtime.lastError.message}`, true);
        return;
    }

    showStatus("Saved!", false, 1500);
}

function handleRestoreDefaults()
{
    chrome.runtime.sendMessage({ action: "restoreBlankTabUrls" }, handleDefaultsRestored);
}

function handleDefaultsRestored(response)
{
    if (chrome.runtime.lastError)
    {
        showStatus(`Unable to restore defaults: ${chrome.runtime.lastError.message}`, true);
        return;
    }
    if (!response || response.error || !Array.isArray(response.blankTabUrls))
    {
        showStatus(response?.error || "Unable to restore defaults.", true);
        return;
    }

    setUrlTextarea(response.blankTabUrls);
    showStatus("Defaults restored.", false, 1500);
}

document.getElementById("save").addEventListener("click", handleSave);
document.getElementById("restore").addEventListener("click", handleRestoreDefaults);
chrome.storage.sync.get({ blankTabUrls: [] }, handleUrlsLoaded);

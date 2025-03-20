const executeScript = (tabId, url) => {
	const isNotPrDiffPage = !(url.includes("/pull-requests/") && url.includes("diff"))
	if (isNotPrDiffPage) {
		return
	}
	chrome.scripting.executeScript({
		target: { tabId: tabId },
		files: ["bb-dc-pr-helper.js"],
	})
	chrome.scripting.insertCSS({
		target: { tabId: tabId },
		files: ["styles.css"],
	})
}

const onUpdated = (tabId, changeInfo) => {
	const isNotHashChange = !(changeInfo.url && changeInfo.url.includes("diff#"))
	if (isNotHashChange) {
		return
	}
	executeScript(tabId, changeInfo.url)
}

const onCompleted = (details) => {
	executeScript(details.tabId, details.url)
}

const filter = { url: [{ hostEquals: "git.vegvesen.no" }] }

if (typeof browser == "undefined") {
	// Chrome does not support the browser namespace yet.
	globalThis.browser = chrome;
}

browser.runtime.onInstalled.addListener(() => {
	browser.tabs.onUpdated.addListener(onUpdated)
	browser.webNavigation.onCompleted.addListener(onCompleted, filter)
});

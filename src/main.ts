/**
 * Runs as a service worker in the background
 * and is responsible for opening a tab to the actual app.
 */

type Tab = chrome.tabs.Tab;
type Tabs = Tab[];

function getExtensionUrl(): string {
  return chrome.runtime.getURL("index.html");
}

function findExtensionTabOrNull(tabs: Tabs): Tab | null {
  return tabs.find((x) => x.url === getExtensionUrl()) ?? null;
}

function getAllTabs(): Promise<Tabs> {
  return new Promise((res) => chrome.tabs.query({}, res));
}

async function createOrFocusExtensionTab(): Promise<void> {
  const tabs = await getAllTabs();
  const existingTab = findExtensionTabOrNull(tabs);

  existingTab
    ? chrome.tabs.highlight({ tabs: existingTab.index })
    : chrome.tabs.create({ url: getExtensionUrl() });
}

chrome.action.onClicked.addListener(createOrFocusExtensionTab);

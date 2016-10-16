const extUrl = `chrome-extension://${location.host}/dist/index.html`;

const findExtTabOrNull = allTabs => allTabs.find(x => x.url === extUrl);

const getAllTabs = () => new Promise(resolve => chrome.tabs.query({}, resolve));

const logError = err => console.error('Error setting up extension tab', err);

const openOrFocusTab = () => {
    getAllTabs()
        .then(findExtTabOrNull)
        .then(tab => {
            if(!tab) {
                return chrome.tabs.create({ url: extUrl });
            }

            chrome.tabs.update(tab.id, { selected: true });
        }).catch(logError);
};

chrome.browserAction.onClicked.addListener(openOrFocusTab);

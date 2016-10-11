const elErrorMessage = document.querySelector('.error-message');
const elErrorMessageText = document.querySelector('.error-message-text');
const elErrorMessageClose = document.querySelector('.error-message-close');
const elBookmarks = document.querySelector('.bookmarks');
const elJsonPasteWrapper = document.querySelector('.json-paste-wrapper');
const jsonTextArea = document.querySelector('.json-textarea');
const submitJson = document.querySelector('.submit-json');

const createLink = ({ id, title, children }) => {
    const isDir = children && children.length >= 0;
    const cssClass = isDir ? "is-dir" : "is-link"
    return `<a class="${cssClass}" data-id="${id}">${title}</a>`;
}

const createBackButtonOrEmpty = ({ parentId }) => {
    return parentId ? [`<button class="back-button" data-id="${parentId}">&lt; Back</button>`] : [];
}

const render = items => {
    const root = items[0];
    elBookmarks.dataset.currentId = root.id;
    elBookmarks.innerHTML = []
        .concat(createBackButtonOrEmpty(root))
        .concat(root.children.map(createLink))
        .join('<br/>');
};

const showError = msg => {
    elErrorMessageText.innerHTML = msg;
    elErrorMessage.classList.add('is-shown');
};

const insertLink = (parentId, { title, url }) => {
    return new Promise(resolve => chrome.bookmarks.create({ parentId, title, url }, resolve));
};

const insertLinks = (parentId, links) => {
    if(!links || links.length === 0) {
        return Promise.resolve(null);
    }

    const head = links[0];
    const tail = links.slice(1);

    // create the current link, and then recurse its children, and then recurse the tail
    return insertLink(parentId, head)
        .then(({ id }) => insertLinks(id, head.children))
        .then(() => insertLinks(parentId, tail));
};

const parseJsonPromise = json => {
    return new Promise((resolve, reject) => {
        try {
            resolve(JSON.parse(json));
        } catch (err) {
            reject(`Uh oh, something couldn't parse in your JSON:<br/>${err}`);
        }
    });
};

const insertLinksFromJson = json => {
    const currentParent = elBookmarks.dataset.currentId;
    return parseJsonPromise(json)
        .then(data => insertLinks(currentParent, data))
        .then(() => chrome.bookmarks.getSubTree(currentParent, render))
        .catch(err => showError(err));
};

submitJson.addEventListener('click', function() {
    if(!jsonTextArea.value) {
        return;
    }

    insertLinksFromJson(jsonTextArea.value);
})

elBookmarks.addEventListener('click', evt => {
    const id = evt.target.dataset.id;
    if(!id) {
        return;
    }

    elJsonPasteWrapper.classList.toggle('is-shown', id > 0);
    chrome.bookmarks.getSubTree(id, render);
});

elErrorMessageClose.addEventListener('click', evt => {
    elErrorMessage.classList.remove('is-shown');
});

chrome.bookmarks.getTree(render);

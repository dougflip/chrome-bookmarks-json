const elBookmarks = document.querySelector('.bookmarks');
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

const insertLinksFromJson = json => {
    const data = JSON.parse(json);
    const currentParent = elBookmarks.dataset.currentId;
    insertLinks(currentParent, data)
        .then(() => chrome.bookmarks.getSubTree(currentParent, render));
};

submitJson.addEventListener('click', function() {
    if(!jsonTextArea.value) {
        return;
    }

    insertLinksFromJson(jsonTextArea.value);
})

elBookmarks.addEventListener('click', evt => {
    const id = evt.target.dataset.id;
    chrome.bookmarks.getSubTree(id, render);
});

chrome.bookmarks.getTree(render);

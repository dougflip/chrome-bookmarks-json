var node = document.getElementById('main');
var app = Elm.Main.embed(node);

const getRootBookmarks = () => {
    return new Promise(resolve => chrome.bookmarks.getTree(resolve))
        .then(xs => xs[0].children);
}

const getBookmarksFor = id => {
    return new Promise(resolve => chrome.bookmarks.getSubTree(id, resolve))
        .then(xs => xs[0].children);
}

const mapBookmark = x => {
    return Object.assign({}, x, { isFolder: !!x.children });
};

getRootBookmarks()
    .then(xs => xs.map(mapBookmark))
    .then(app.ports.bookmarks.send);

app.ports.getBookmarks.subscribe(id => {
    getBookmarksFor(id)
        .then(xs => xs.map(mapBookmark))
        .then(app.ports.bookmarks.send);
});

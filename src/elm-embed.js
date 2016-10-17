var node = document.getElementById('main');
var app = Elm.Main.embed(node);

const getRootBookmarks = () => {
    return new Promise((resolve, reject) => {
        chrome.bookmarks.getTree(resolve);
    }).then(xs => xs[0].children);
}

const mapBookmark = x => {
    return Object.assign({}, x, { isFolder: !!x.children });
};

getRootBookmarks()
    .then(xs => xs.map(mapBookmark))
    .then(app.ports.bookmarks.send);

// app.ports.check.subscribe(word => {
//     getRootBookmarks()
//         .then(xs => xs.map(x => x.title))
//         .then(app.ports.suggestions.send);
// });

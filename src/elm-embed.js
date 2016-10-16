var node = document.getElementById('main');
var app = Elm.Main.embed(node);

const getRootBookmarks = () => {
    return new Promise((resolve, reject) => {
        chrome.bookmarks.getTree(resolve);
    }).then(xs => xs[0].children);
}

getRootBookmarks()
    .then(xs => xs.map(x => x.title))
    .then(app.ports.suggestions.send);

app.ports.check.subscribe(word => {
    getRootBookmarks()
        .then(xs => xs.map(x => x.title))
        .then(app.ports.suggestions.send);
});

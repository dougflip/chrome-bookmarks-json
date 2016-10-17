var node = document.getElementById('main');
var app = Elm.Main.embed(node);

const convertToBookmarkRecord = node => {
  return {
    parentId: node.parentId || null,
    currentRootId: node.id,
    bookmarks: node.children.map(mapBookmark)
  };
};

const mapBookmark = x => {
  return Object.assign({}, x, {
    isFolder: !!x.children
  });
};

const getBookmarksFor = id => {
  return new Promise(resolve => chrome.bookmarks.getSubTree(id, resolve))
    .then(xs => xs[0])
    .then(convertToBookmarkRecord);
}

getBookmarksFor("0")
  .then(app.ports.bookmarks.send);

app.ports.getBookmarks.subscribe(id => {
  getBookmarksFor(id)
    .then(app.ports.bookmarks.send);
});

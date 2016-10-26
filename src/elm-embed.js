import chromeBookmarks from './chrome-bookmarks-api';

var node = document.getElementById('main');
var app = Elm.Main.embed(node);

const reportErrorToElm = app => err => app.ports.reportJSError.send(err);

chromeBookmarks.getBookmarksFor("0")
  .then(app.ports.bookmarks.send)
  .catch(reportErrorToElm(app));

app.ports.getBookmarks.subscribe(id => {
  chromeBookmarks.getBookmarksFor(id)
    .then(app.ports.bookmarks.send)
    .catch(reportErrorToElm(app));
});

app.ports.insertBookmarks.subscribe(({ parentId, json }) => {
  chromeBookmarks.insertBookmarksFromJson(parentId, json)
    .catch(err => app.ports.reportJSError.send(err));
});

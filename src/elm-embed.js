import chromeBookmarks from './chrome-bookmarks-api';

var node = document.getElementById('main');
var app = Elm.Main.embed(node);

chromeBookmarks.getBookmarksFor("0")
  .then(app.ports.bookmarks.send);

app.ports.getBookmarks.subscribe(id => {
  chromeBookmarks.getBookmarksFor(id)
    .then(app.ports.bookmarks.send);
});

import chromeBookmarks from './chrome-bookmarks-api';

const node = document.getElementById('main');
const app = Elm.Main.embed(node);

const sendErrorToElm = app => err => app.ports.reportJSError.send(err);

const sendBookmarksToElm = id => {
  return chromeBookmarks.getBookmarksFor(id)
    .then(app.ports.bookmarks.send)
    .catch(sendErrorToElm(app));
};

const createAndSendBookmarksToElm = ({ parentId, json }) => {
  chromeBookmarks.insertBookmarksFromJson(parentId, json)
    .then(() => sendBookmarksToElm(parentId))
    .catch(sendErrorToElm(app));
};

app.ports.getBookmarks.subscribe(sendBookmarksToElm);

app.ports.insertBookmarks.subscribe(createAndSendBookmarksToElm);

sendBookmarksToElm("0");

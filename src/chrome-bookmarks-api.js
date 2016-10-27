/**
* Functions for retrieving and inserting bookmarks in Chrome.
* This does 2 high level things:
*   1. Provides a minimal (and specific) API of the functions actually used
*   2. Exposes the API as promises for easier consumption
*/
const convertToBookmarkIO = node => {
  return {
    parentId: node.parentId || null,
    currentRootId: node.id,
    children: node.children.map(mapBookmark)
  };
};

const mapBookmark = x => {
  return Object.assign({}, x, { isFolder: !!x.children });
};

const getBookmarksFor = id => {
  return new Promise(resolve => chrome.bookmarks.getSubTree(id, resolve))
    .then(xs => xs[0])
    .then(convertToBookmarkIO)
    .catch(err => Promise.reject(err || "Sorry! Something went wrong retrieving bookmarks from Chrome"));
}

const insertBookmark = (parentId, { title, url }) => {
  return new Promise(resolve => chrome.bookmarks.create({ parentId, title, url }, resolve));
};

const insertBookmarks = (parentId, links) => {
  if(!links || links.length === 0) {
    return Promise.resolve(null);
  }

  const head = links[0];
  const tail = links.slice(1);

  // create the current link, and then recurse its children, and then recurse the tail
  return insertBookmark(parentId, head)
    .then(({ id }) => insertBookmarks(id, head.children))
    .then(() => insertBookmarks(parentId, tail));
};

const insertBookmarksFromJson = (parentId, json) => {
  return Promise.resolve(json)
    .then(JSON.parse)
    .then(data => insertBookmarks(parentId, data))
    .catch(err => Promise.reject(err || "Sorry! Something went wrong trying to create your bookmarks"));
};

export default {
  getBookmarksFor,
  insertBookmarksFromJson
};

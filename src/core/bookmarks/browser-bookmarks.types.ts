/**
 * Describes the shape of a bookmark that is saved to the browser.
 * This applies to both "links" and "folders".
 */
export type BookmarkNode = chrome.bookmarks.BookmarkTreeNode;

/**
 * Signature for creating a bookmark with the browser.
 */
export type CreateBookmarkFn = typeof chrome.bookmarks.create;

/**
 * Signature for getting a bookmark with its full sub tree from the browser.
 */
export type GetBookmarkSubTreeFn = typeof chrome.bookmarks.getSubTree;

import { env } from "~/env";
import { allBookmarks } from "./bookmarks-mock";
import {
  CreateBookmarkFn,
  GetBookmarkSubTreeFn,
} from "./browser-bookmarks.types";

/**
 * The signature of the default export of this module.
 * These represent the functions that come from the browser when running
 * in an environment as an extension.
 * The purpose is to "swap" implementations based on the build env.
 * This means dev/test are given mock implementations while production is provided a real implementation.
 *
 * Bookmarks seems to be a pretty standard API,
 * but if it turns out they are not - then this could also be a strategy
 * where we could build for other browsers as well.
 *
 * I'm sure that Vite could handle this for us as well.
 * I may look into that in the future.
 */
type BrowserBookmarksApi = {
  create: CreateBookmarkFn;
  getSubTree: GetBookmarkSubTreeFn;
};

const devBookmarksApi = (): BrowserBookmarksApi => ({
  create: () => Promise.resolve({ id: "2", title: "Created Title" }),
  getSubTree: () => Promise.resolve([allBookmarks[0]]),
});

const prodBookmarksApi = (): BrowserBookmarksApi => ({
  create: chrome.bookmarks.create,
  getSubTree: chrome.bookmarks.getSubTree,
});

// create and export the version that matches the environment.
export default env.nodeEnv === "production"
  ? prodBookmarksApi()
  : devBookmarksApi();

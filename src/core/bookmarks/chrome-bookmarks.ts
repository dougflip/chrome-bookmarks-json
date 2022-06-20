import bookmarksApi from "./browser-bookmarks";
import {
  BookmarkNode,
  CreateBookmarkFn,
  GetBookmarkSubTreeFn,
} from "./browser-bookmarks.types";

/**
 * Shape of a user defined (external to Chrome) bookmark link.
 * Different from a "folder" in that this shape contains a url,
 * but does NOT contain children.
 * In practice, this is the expected shape you will find in a JSON
 * file describing a link. At some point in the future this will most likely
 * be defined by `zod` instead of via TS directly.
 */
export type BookmarkLinkDto = { title: string; url: string };

/**
 * Shape of a user defined (external to Chrome) bookmark folder.
 * Different from a "link" in that this shape contains children,
 * but does NOT contain a url.
 * In practice, this is the expected shape you will find in a JSON
 * file describing a folder. At some point in the future this will most likely
 * be defined by `zod` instead of via TS directly.
 */
export type BookmarkFolderDto = {
  title: string;
  children: BookmarkDto[];
  url?: undefined;
};

/**
 * A union type describing a single top level entry in a user defined JSON file
 * for bookmarks. Note that the overall shape is a recursive tree structure
 * modeled closely (but simplified) after Chrome's representation.
 * In practice, a user file will be an array of this shape.
 */
export type BookmarkDto = BookmarkFolderDto | BookmarkLinkDto;

/**
 * The result of attempting to create a collection of BookmarkDto.
 * Provides a list of created nodes as well as a list of errors
 * as the process will continue through other parts of the bookmark
 * tree even when errors are encountered.
 */
export type CreateBookmarkResult = {
  created: BookmarkNode[];
  errors: string[];
};

/**
 * The result of creating a bookmark with Chrome.
 * Either a success with a Node or a failure with an error message.
 */
type CreateResult = CreateNodeSuccess | CreateNodeError;
type CreateNodeSuccess = BookmarkNode & { success: true };
type CreateNodeError = { success: false; message: string };

function isCreateNodeSuccess(x: CreateResult): x is CreateNodeSuccess {
  return x.success;
}

function isCreateNodeError(x: CreateResult): x is CreateNodeError {
  return !x.success;
}

async function createBookmark(
  parentId: string,
  bm: BookmarkDto,
  createFn: CreateBookmarkFn,
  result: CreateResult[] = []
): Promise<CreateResult[]> {
  let newNode: BookmarkNode;
  try {
    newNode = await createFn({ parentId, title: bm.title, url: bm.url });
  } catch (err: unknown) {
    // failing to create a node is an exit path to recursion
    return [
      ...result,
      { success: false, message: `Error creating "${bm.title}": ${err}` },
    ];
  }

  // at this point we have created a new node
  // return if this was a leaf or recurse if there are children
  if (!("children" in bm)) {
    return [...result, { success: true, ...newNode }];
  }

  const childrenResults = await Promise.all(
    bm.children.map((x) => createBookmark(newNode.id, x, createFn))
  );

  return [{ success: true, ...newNode }, ...childrenResults.flat()];
}

/**
 * Shape used to create a full array of bookmarks.
 * This is the main public interface for creating bookmarks.
 */
type InsertBookmarksDtoArgs = {
  parentId: string;
  bookmarks: BookmarkDto[];
  createFn?: CreateBookmarkFn;
};

/**
 * Creates an array of BookmarkDto as Chrome Bookmarks under the requested parent.
 * This function tries to create as much as possible and collects a list of
 * success and errors.
 */
export async function insertBookmarksDto({
  parentId,
  bookmarks,
  createFn = bookmarksApi.create,
}: InsertBookmarksDtoArgs): Promise<CreateBookmarkResult> {
  const results = (
    await Promise.all(
      bookmarks.map((x) => createBookmark(parentId, x, createFn))
    )
  ).flat();

  return {
    created: results.filter(isCreateNodeSuccess),
    errors: results.filter(isCreateNodeError).map((x) => x.message),
  };
}

/**
 * Gets a single node by ID.
 * This node will be deeply populated with all of its children.
 */
export async function getBookmarkById(
  id: string,
  getBookmarkByIdFn: GetBookmarkSubTreeFn = bookmarksApi.getSubTree
): Promise<BookmarkNode> {
  const [item] = await getBookmarkByIdFn(id);
  return item;
}

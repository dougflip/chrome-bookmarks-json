import { Alert, Container } from "@mantine/core";
import {
  BookmarkDto,
  getBookmarkById,
  insertBookmarksDto,
} from "~/core/bookmarks";
import React, { useState } from "react";

import { JsonFileResult } from "~/components/file-upload";
import { RemoteData } from "~/components/remote-data";
import { useInputState } from "@mantine/hooks";
import { useQuery } from "react-query";
import { BookmarkExplorer } from "./bookmark-explorer/bookmark-explorer";

export function Home(): JSX.Element {
  const [id, setId] = useInputState("0");
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");
  const bookmarks = useQuery(["bookmarks", id], () => getBookmarkById(id));

  async function handleJsonFile(result: JsonFileResult): Promise<void> {
    if (result.kind === "empty") {
      return;
    }
    if (result.kind === "error") {
      return setErr(`Yikes! ${result.message}: ${result.error}`);
    }

    // TODO: Once we get Zod in the mix this cast won't be necessary
    const bookmarks = result.contents as unknown as BookmarkDto[];
    try {
      const results = await insertBookmarksDto({ parentId: id, bookmarks });
      setMsg(
        `Success: ${results.created
          .map((x) => x.id)
          .join(", ")} and errors: ${results.errors.join(", ")}`
      );
    } catch (e: unknown) {
      setErr(`Whoops! Error while trying to create bookmarks: ${e}`);
    }
  }

  return (
    <>
      {msg && <Alert>{msg}</Alert>}
      {err && <Alert color={"red"}>{err}</Alert>}
      <RemoteData
        {...bookmarks}
        renderLoading={() => <div>Loading...</div>}
        renderError={() => <div>Error...</div>}
        render={({ title, children, parentId }) => (
          <Container size="md">
            <BookmarkExplorer
              title={title}
              bookmarkItems={children || []}
              onParentClicked={() => setId(parentId)}
              onBookmarkClicked={setId}
              onJsonFile={handleJsonFile}
            />
          </Container>
        )}
      />
    </>
  );
}

import { Button, Group, Paper } from "@mantine/core";
import React from "react";
import { JsonFileResult, JsonFileUpload } from "~/components/file-upload";
import { BookmarkItem, BookmarkItemDataProps } from "../bookmark-item";

type BookmarkExplorerProps = {
  title: string;
  bookmarkItems: BookmarkItemDataProps[];
  onParentClicked: () => void;
  onBookmarkClicked: (id: string) => void;
  onJsonFile: (file: JsonFileResult) => void;
};

/**
 * Renders a BookmarkItem with the proper icon based on the url prop's presence.
 */
export function BookmarkExplorer({
  title,
  bookmarkItems,
  onParentClicked,
  onBookmarkClicked,
  onJsonFile,
}: BookmarkExplorerProps): JSX.Element {
  return (
    <>
      {title && (
        <div>
          <Button size="xs" variant="subtle" onClick={onParentClicked}>
            {title}
          </Button>
        </div>
      )}
      <Group position="right" mb="lg">
        <JsonFileUpload onJsonFile={onJsonFile} />
      </Group>
      <Paper shadow="md" radius="lg">
        {bookmarkItems?.map((x) => (
          <BookmarkItem key={x.id} onClick={onBookmarkClicked} {...x} />
        ))}
      </Paper>
    </>
  );
}

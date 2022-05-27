import { Button } from "@mantine/core";
import React from "react";
import { Folder, World } from "tabler-icons-react";

export type BookmarkItemDataProps = {
  id: string;
  title: string;
  url?: string | undefined;
};

export type BookmarkItemProps = BookmarkItemDataProps & {
  onClick?: (id: string) => void;
};

/**
 * Renders a BookmarkItem with the proper icon based on the url prop's presence.
 */
export function BookmarkItem({
  id,
  title,
  url,
  onClick = () => {
    return;
  },
}: BookmarkItemProps): JSX.Element {
  return (
    <Button
      leftIcon={url ? <World /> : <Folder />}
      fullWidth
      onClick={() => onClick(id)}
      variant="subtle"
      styles={() => ({
        inner: {
          justifyContent: "flex-start",
        },
      })}
    >
      {title}
    </Button>
  );
}

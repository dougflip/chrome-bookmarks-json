import { describe, it } from "vitest";
import { fileUploadTestId, makeJsonFile } from "~/test-utils";
import { renderApp, screen, waitFor } from "~/test-utils";

import UserEvent from "@testing-library/user-event";

function setup() {
  renderApp("/");

  return {
    user: UserEvent.setup(),
    getFirstBookmark: () => screen.getByText(/bookmarks bar/i),
    getUploadJsonBtn: () => screen.getByText(/import json/i),
    getFileUpload: () => screen.getByTestId(fileUploadTestId),
  };
}

describe("<Home />", () => {
  it("renders a list of bookmarks to the screen", async () => {
    const { getFirstBookmark } = setup();
    await waitFor(() => expect(getFirstBookmark()).toBeInTheDocument());
  });

  it("imports JSON", async () => {
    const file = makeJsonFile([
      {
        title: "bookmark",
        url: "http://www.example.com",
      },
    ]);
    const { user, getFileUpload, getUploadJsonBtn } = setup();
    await waitFor(() => expect(getUploadJsonBtn()).toBeInTheDocument());
    await user.upload(getFileUpload(), file);
    expect(screen.getByText(/success/i)).toBeInTheDocument();
  });
});

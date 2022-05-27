import { describe, it, vi } from "vitest";
import { makeFile, screen } from "~/test-utils";

import { ButtonFileUpload, fileUploadTestId } from "./button-file-upload";
import React from "react";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

type RenderFn = () => JSX.Element;

function setup(renderFn: RenderFn) {
  const user = userEvent.setup();
  render(renderFn());

  return {
    user,
    getFileUpload: () => screen.getByTestId(fileUploadTestId),
  };
}

describe("<ButtonFileUpload />", async () => {
  it("renders a button which triggers a file upload", async () => {
    const file = makeFile("hello");
    const handleFile = vi.fn();
    const { user, getFileUpload } = setup(() => (
      <ButtonFileUpload onFile={handleFile}>upload</ButtonFileUpload>
    ));
    await user.upload(getFileUpload(), file);
    expect(handleFile).toHaveBeenCalledWith("hello");
  });
});

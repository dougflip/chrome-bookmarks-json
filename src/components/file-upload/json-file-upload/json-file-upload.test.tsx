import { describe, it, vi } from "vitest";
import { fileUploadTestId, makeFile, makeJsonFile, screen } from "~/test-utils";

import { JsonFileUpload } from "./json-file-upload";
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

describe("<JsonFileUpload />", async () => {
  it("provides JSON when the file contents can be parsed as JSON", async () => {
    const file = makeJsonFile({ greeting: "hello" });
    const handleFile = vi.fn();
    const { user, getFileUpload } = setup(() => (
      <JsonFileUpload onJsonFile={handleFile} />
    ));
    await user.upload(getFileUpload(), file);
    expect(handleFile).toHaveBeenCalledWith(
      expect.objectContaining({
        kind: "success",
        contents: { greeting: "hello" },
      })
    );
  });

  it("signifies an empty file", async () => {
    const file = makeFile("", { fileName: "empty.json" });
    const handleFile = vi.fn();
    const { user, getFileUpload } = setup(() => (
      <JsonFileUpload onJsonFile={handleFile} />
    ));
    await user.upload(getFileUpload(), file);
    expect(handleFile).toHaveBeenCalledWith(
      expect.objectContaining({
        kind: "empty",
      })
    );
  });

  it("signifies an error when the contents cannot be parsed as JSON", async () => {
    const file = makeFile("this is not valid JSON", {
      fileName: "hello.json",
    });
    const handleFile = vi.fn();
    const { user, getFileUpload } = setup(() => (
      <JsonFileUpload onJsonFile={handleFile} />
    ));
    await user.upload(getFileUpload(), file);
    expect(handleFile).toHaveBeenCalledWith(
      expect.objectContaining({
        kind: "error",
        message: expect.any(String),
        error: expect.any(Object),
      })
    );
  });
});

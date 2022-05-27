import React from "react";

import { ButtonFileUpload } from "../button-file-upload/button-file-upload";

type EmptyFile = { kind: "empty" };
type ErrorFile = { kind: "error"; message: string; error: unknown };
type SuccessFile = { kind: "success"; contents: JSON };

export type JsonFileResult = EmptyFile | ErrorFile | SuccessFile;

export type JsonFileUploadProps = {
  onJsonFile: (file: JsonFileResult) => void;
};

/**
 * Wrapper over `ButtonFileUpload` to treat the file contents as JSON.
 * The happy path will result in the contents being returned as JSON.
 * You will likely forward those results to a validator.
 * Special cases for empty files and failed JSON parsing.
 */
export function JsonFileUpload({
  onJsonFile,
}: JsonFileUploadProps): JSX.Element {
  function handleFile(contents: string | null): void {
    if (!contents) {
      return onJsonFile({ kind: "empty" });
    }

    try {
      const json = JSON.parse(contents);
      return onJsonFile({ kind: "success", contents: json });
    } catch (error: unknown) {
      return onJsonFile({
        kind: "error",
        message: "Failed to parse file contents as JSON",
        error,
      });
    }
  }

  return (
    <ButtonFileUpload onFile={handleFile} accept=".json">
      Import JSON
    </ButtonFileUpload>
  );
}

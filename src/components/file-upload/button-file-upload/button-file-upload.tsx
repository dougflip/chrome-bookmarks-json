import React, { useRef } from "react";

import { Button } from "@mantine/core";
import PromiseFileReader from "promise-file-reader";
import { StrictReactNode } from "~/core/react-types";

export const fileUploadTestId = "button-file-upload-input";

export type ButtonFileUploadProps = {
  children: StrictReactNode;
  accept?: string | undefined;
  onFile: (contents: string | null) => void;
};

/**
 * Provides a UI with a button which triggers a file upload.
 * This can be used on its own, but is also pretty low level and
 * can be used as a building block for more specific uploads.
 */
export function ButtonFileUpload({
  onFile,
  accept,
  children,
}: ButtonFileUploadProps): JSX.Element {
  const ref = useRef<HTMLInputElement>(null);

  async function handleFileChange(
    e: React.ChangeEvent<HTMLInputElement>
  ): Promise<void> {
    const rawFile = e.target.files?.[0];
    if (!rawFile) {
      onFile(null);
      return;
    }
    const contents = await PromiseFileReader.readAsText(rawFile);
    onFile(contents);
  }

  return (
    <>
      <input
        data-testid={fileUploadTestId}
        style={{ display: "none" }}
        ref={ref}
        type="file"
        onChange={handleFileChange}
        accept={accept}
      />
      <Button onClick={() => ref.current?.click()}>{children}</Button>
    </>
  );
}

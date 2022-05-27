export { fileUploadTestId } from "~/components/file-upload/button-file-upload";

type MakeFileOpts = {
  fileName?: string;
  type?: string;
};

export function makeFile(
  contents: string,
  { fileName = "test-file.txt", type = "text" }: MakeFileOpts = {}
): File {
  return new File([contents], fileName, { type });
}

type JsonFileContent = Record<string, unknown> | Record<string, unknown>[];

export function makeJsonFile(
  contents: JsonFileContent,
  { fileName = "test-json-file.json" }: Pick<MakeFileOpts, "fileName"> = {}
): File {
  return makeFile(JSON.stringify(contents), {
    fileName,
    type: "text",
  });
}

import loadable from "@loadable/component";

// export { default as DocumentTypeForm } from "./DocumentType/index.form";

export const DocumentTypeForm = loadable(() =>
  import("./DocumentType/index.form")
);

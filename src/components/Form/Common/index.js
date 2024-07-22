import loadable from "@loadable/component";

export const VerificationFormCommon = loadable(() =>
  import("./VerificationForm/index.form")
);

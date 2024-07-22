import loadable from "@loadable/component";

// export { default as UserAccountForm } from "./UserAccountForm/index.form";
// export { default as VerificationForm } from "./UserEmailPhoneForm/VerificationForm/index.form";
// export { default as ChangeEmailForm } from "./UserEmailPhoneForm/ChangeEmailForm/index.form";
// export { default as AddEmailForm } from "./UserEmailPhoneForm/AddEmailForm/index.form";

export const UserAccountForm = loadable(() =>
  import("./UserAccountForm/index.form")
);
export const VerificationForm = loadable(() =>
  import("./UserEmailPhoneForm/VerificationForm/index.form")
);
export const ChangeEmailForm = loadable(() =>
  import("./UserEmailPhoneForm/ChangeEmailForm/index.form")
);
export const AddEmailForm = loadable(() =>
  import("./UserEmailPhoneForm/AddEmailForm/index.form")
);
export const UserBusinessForm = loadable(() =>
  import("./UserBusinessForm/index.form")
);
export const AddStateForm = loadable(() => import("./AddStateForm/index.form"));

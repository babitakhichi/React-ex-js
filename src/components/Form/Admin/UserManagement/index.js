import loadable from "@loadable/component";

// export { default as NotificationForm } from "./NotificationForm/index.form";

export const NotificationForm = loadable(() =>
  import("./NotificationForm/index.form")
);

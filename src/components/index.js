import loadable from "@loadable/component";

export * from "./Antd";
// export * from "./Button";
export * from "./UiElement";
export * from "./Form";
export { default as Sidebar } from "./Sidebar/index";

// export { default as Footer } from "./Footer/index";
// export { default as AdminHeader } from "./AdminHeader/index";
// export { default as AdminFooter } from "./AdminFooter/index";
// export { default as FullPageLoader } from "./fullPageLoader/index.loader";

// export const Sidebar = loadable(() => import("./Sidebar/index"));
export const AdminHeader = loadable(() => import("./AdminHeader/index"));
export const AdminFooter = loadable(() => import("./AdminFooter/index"));
export const FullPageLoader = loadable(() =>
  import("./fullPageLoader/index.loader")
);

export * from "./Common";
export * from "./Formatter/index";
export * from "./Filter";

import loadable from "@loadable/component";

export * from "./Button";
export * from "./MetaTags";
// export { default as Header } from "./Header/index";
// export { default as Footer } from "./Footer/index";
// export { default as ImageElement } from "./ImageElement/index";
// export { default as AccordionComponent } from "./Accordion/index";
// export { default as PageHeading } from "./PageHeading/index";
// export { default as ModalComponent } from "./Modal/index";
// export { default as GlobalLoader } from "./GlobalLoader/index";
// export { default as DashboardCardComponent } from "./DashboardCardComponent/index";
// export { default as Breadcrumb } from "./Breadcrumb/index";
// export { default as SweetAlert } from "./SweetAlert/index";
// export { default as DataTable } from "./Table/index";
// export { default as Pagination } from "./Pagination/index";
// export { default as AuthLogo } from "./AuthLogo/index";
// export { default as AcountSidebar } from "./AcountSidebar/index";
// export { default as TextEditor } from "./TextEditor/index";
// export { default as Tabs } from "./Tabs/index";
// export { default as Charts } from "./Chart/index";
// export { default as RippleEffect } from "./RippleEffect/index";

export const Header = loadable(() => import("./Header/index"));
export const Footer = loadable(() => import("./Footer/index"));
export const ImageElement = loadable(() => import("./ImageElement/index"));
export const AccordionComponent = loadable(() => import("./Accordion/index"));
export const PageHeading = loadable(() => import("./PageHeading/index"));
export const ModalComponent = loadable(() => import("./Modal/index"));
export const GlobalLoader = loadable(() => import("./GlobalLoader/index"));
export const DashboardCardComponent = loadable(() =>
  import("./DashboardCardComponent/index")
);
export const Breadcrumb = loadable(() => import("./Breadcrumb/index"));
export const SweetAlert = loadable(() => import("./SweetAlert/index"));
export const DataTable = loadable(() => import("./Table/index"));
export const Pagination = loadable(() => import("./Pagination/index"));
export const AuthLogo = loadable(() => import("./AuthLogo/index"));
export const AcountSidebar = loadable(() => import("./AcountSidebar/index"));
export const TextEditor = loadable(() => import("./TextEditor/index"));
export const Tabs = loadable(() => import("./Tabs/index"));
export const Charts = loadable(() => import("./Chart/index"));
export const RippleEffect = loadable(() => import("./RippleEffect/index"));
export const MultipleInput = loadable(() => import("./MultipleInput/index"));
export const VerticalTabs = loadable(() => import("./VerticalTabs/index"));
export const AudioRecorder = loadable(() => import("./AudioRecorder/index"));

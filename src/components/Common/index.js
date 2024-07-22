import loadable from "@loadable/component";

// export { default as ListingHeader } from "./ListingHeader/index";
// export { default as PageHeader } from "./PageHeader/index";

export const ListingHeader = loadable(() => import("./ListingHeader/index"));
export const PageHeader = loadable(() => import("./PageHeader/index"));
export const PaymentMode = loadable(() => import("./PaymentMode/index"));

import loadable from "@loadable/component";

// export { default as ManageUserFilter } from "./ManageUserFilter/index.filter";
// export { default as PendingQueriesFilter } from "./ContactUs/PendingQueriesFilter/index.filter";
// export { default as RepliedQueriesFilter } from "./ContactUs/RepliedQueriesFilter/index.filter";
// export { default as DocumentTypeFilter } from "./DocumentTypeFilter/index.filter";
// export { default as TransactionHistoryFilter } from "./TransactionHistoryFilter/index.filter";
// export { default as SubscriptionPlanFilter } from "./SubscriptionPlanFilter/index.filter";
// export { default as DiscountRequestsFilter } from "./DiscountRequestsFilter/index.filter";

export const ManageUserFilter = loadable(() =>
  import("./ManageUserFilter/index.filter")
);
export const PendingQueriesFilter = loadable(() =>
  import("./ContactUs/PendingQueriesFilter/index.filter")
);
export const RepliedQueriesFilter = loadable(() =>
  import("./ContactUs/RepliedQueriesFilter/index.filter")
);
export const DocumentTypeFilter = loadable(() =>
  import("./DocumentTypeFilter/index.filter")
);
export const TransactionHistoryFilter = loadable(() =>
  import("./TransactionHistoryFilter/index.filter")
);
export const SubscriptionPlanFilter = loadable(() =>
  import("./SubscriptionPlanFilter/index.filter")
);
export const DiscountRequestsFilter = loadable(() =>
  import("./DiscountRequestsFilter/index.filter")
);
export const ManageTeamMembersFilter = loadable(() =>
  import("./ManageTeamMembersFilter/index.filter")
);
export const ManageClientsPartnersFilter = loadable(() =>
  import("./ManageClientsPartnersFilter/index.filter")
);
export const CouponsFilter = loadable(() =>
  import("./CouponsFilter/index.filter")
);
export const ReferralsFilter = loadable(() =>
  import("./ReferralsFilter/index.filter")
);
export const ConsumptionFilter = loadable(()=>
  import("./ConsumptionFilter/index.filter")
);

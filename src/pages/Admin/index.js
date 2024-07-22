import React from "react";

export const AdminLogin = React.lazy(() => import("./Login/index.page"));
export const ForgotPassword = React.lazy(() =>
  import("./ForgotPassword/index.page")
);
export const OtpVerification = React.lazy(() =>
  import("./OtpVerification/index.page")
);
export const NotificationAll = React.lazy(() =>
  import("./NotificationAll/index.page")
);
export const ResetPassword = React.lazy(() =>
  import("./ResetPassword/index.page")
);
export const Dashboard = React.lazy(() => import("./Dashboard/index.page"));
export const AdminProfile = React.lazy(() =>
  import("./Account/AdminProfile/index.page")
);
export const AdminChangePassword = React.lazy(() =>
  import("./Account/ChangePassword/index.page")
);
export const DiscountRequests = React.lazy(() =>
  import("./DiscountRequests/index.page")
);
export const ManageCustomers = React.lazy(() =>
  import("./Users/ManageCustomers/CustomerListing/index.page")
);
export const CustomerDetails = React.lazy(() =>
  import("./Users/ManageCustomers/CustomerDetails/index.page")
);
export const EndUserAgreement = React.lazy(() =>
  import("./ManageCms/EndUserAgreement/index.page")
);
export const PrivacyPolicy = React.lazy(() =>
  import("./ManageCms/PrivacyPolicy/index.page")
);
export const FAQs = React.lazy(() => import("./ManageCms/FAQs/index.page"));
export const ManageSubscription = React.lazy(() =>
  import("./ManageSubscription/index.page")
);
export const PendingQueries = React.lazy(() =>
  import("./ContactUs/PendingQueries/index.page")
);
export const RepliedQueries = React.lazy(() =>
  import("./ContactUs/RepliedQueries/index.page")
);
export const DocumentType = React.lazy(() =>
  import("./Master/DocumentType/index.page")
);
export const ContactUsReason = React.lazy(() =>
  import("./Master/ContactUsReason/index.page")
);
export const JitsiFeatures = React.lazy(() =>
  import("./Master/JitsiFeatures/index.page")
);
export const TransactionHistory = React.lazy(() =>
  import("./TransactionHistory/index.page")
);
export const CookiesPolicy = React.lazy(() =>
  import("./ManageCms/CookiesPolicy/index.page")
);
export const NewsletterSubscribers = React.lazy(() =>
  import("./NewsletterSubscribers/index.page")
);

export const AdminCms = React.lazy(() => import("./ManageCms/index.page"));
export const ManageClientsPartners = React.lazy(() =>
  import("./ManageClientsPartners/index.page")
);
export const ManageTeamMembers = React.lazy(() =>
  import("./ManageTeamMembers/index.page")
);
export const ManageTaxes = React.lazy(() => import("./ManageTaxes/index.page"));
export const Promotions = React.lazy(() =>
  import("./PromotionsAndReferrals/Promotions/index.page")
);
export const Referrals = React.lazy(() =>
  import("./PromotionsAndReferrals/Referrals/index.page")
);
export const CouponsHistory = React.lazy(() =>
  import("./CouponsHistory/index.page")
);
export const Headquarter = React.lazy(() =>
  import("./Master/Headquarter/index.page")
);

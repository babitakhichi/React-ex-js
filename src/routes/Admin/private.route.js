import DashboardRoutes from "./Dashboard/index.route";
import AccountRoutes from "./Account/index.route";
import DiscountRequestsRoutes from "./DiscountRequests/index.route";
import UserRoutes from "./User/index.route";
import ManageCmsRoutes from "./ManageCms/index.route";
import ManageSubscriptionRoutes from "./ManageSubscription/index.route";
import ContactUsRoutes from "./ContactUs/index.route";
import MasterRoutes from "./Master/index.route";
import TransactionHistoryRoutes from "./TransactionHistory/index.route";
import NewsletterSubscribersRoutes from "./NewsletterSubscribers/index.route";
import Notifications from "./Notification/index.route";

import ManageClientsPartnersRoutes from "./ManageClientsPartners/index.route";
import ManageTeamMembersRoutes from "./ManageTeamMembers/index.route";
import ManageTaxesRoutes from "./ManageTaxes/index.route";
import CouponsAndReferralsRoutes from "./CouponsAndReferrals/index.route";

export default function route(t) {
  return [
    ...DashboardRoutes(t),
    ...AccountRoutes(t),
    ...UserRoutes(t),
    ...MasterRoutes(t),
    ...ManageSubscriptionRoutes(t),
    ...CouponsAndReferralsRoutes(t),
    ...DiscountRequestsRoutes(t),
    ...TransactionHistoryRoutes(t),
    ...NewsletterSubscribersRoutes(t),
    ...ManageClientsPartnersRoutes(t),
    ...ManageTeamMembersRoutes(t),
    ...ManageTaxesRoutes(t),
    ...ContactUsRoutes(t),
    ...ManageCmsRoutes(t),
    ...Notifications(t),
  ];
}

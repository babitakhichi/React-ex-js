import auth from "./Auth";
import dashboard from "./Dashboard";
import discountRequests from "./DiscountRequests";
import user from "./User";
import manageCms from "./ManageCms/index";
import manageSubscription from "./ManageSubscription/index";
import contactUs from "./ContactUs/index";
import master from "./Master/index";
import transactionHistory from "./TransactionHistory/index";
import newsletterSubscribers from "./NewsletterSubscribers/index";
import notifications from "./Notification/index";
import manageClientsPartners from "./ManageClientsPartners/index";
import manageTeamMembers from "./ManageTeamMembers/index";
import manageTaxes from "./ManageTaxes/index";
import couponsAndReferrals from "./CouponsAndReferrals/index";

const AccessControl = {
  ...auth,
  ...dashboard,
  ...discountRequests,
  ...user,
  ...manageCms,
  ...notifications,
  ...manageSubscription,
  ...contactUs,
  ...master,
  ...transactionHistory,
  ...newsletterSubscribers,
  ...manageClientsPartners,
  ...manageTeamMembers,
  ...manageTaxes,
  ...couponsAndReferrals,
};

export default AccessControl;

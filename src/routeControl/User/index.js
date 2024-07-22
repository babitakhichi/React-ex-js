import auth from "./Auth";
import userProfile from "./UserProfile";
import userDashboard from "./UserDashboard";
import videoConferencing from "./VideoConferencing";
import purchasePlan from "./PurchasePlan";
import planSubscription from "./PlanSubscription";
import paymentMethod from "./PaymentMethod";
import userContactUs from "./UserContactUs";
import translation from "./Translation";
import manageCms from "./ManageCms";
import paymentSuccess from "./PaymentSuccess";
import paymentSummary from "./PaymentSummary";
import notification from "./Notifications";
import ourTeam from "./OurTeam";
import partners from "./Partners";
import videoDisplay from "./VideoDisplay";
import referFriend from "./ReferFriend";
import referralRewards from "./ReferralRewards";
import aboutUs from "./AboutUs";

const AccessControl = {
  ...auth,
  ...userProfile,
  ...userDashboard,
  ...videoConferencing,
  ...purchasePlan,
  ...planSubscription,
  ...paymentSuccess,
  ...paymentMethod,
  ...userContactUs,
  ...translation,
  ...manageCms,
  ...paymentSummary,
  ...notification,
  ...partners,
  ...ourTeam,
  ...videoDisplay,
  ...referFriend,
  ...referralRewards,
  ...aboutUs,
};

export default AccessControl;

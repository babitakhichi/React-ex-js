import React from "react";

export const Home = React.lazy(() => import("./Home/index.page"));
export const Login = React.lazy(() => import("./Login/index.page"));
export const Signup = React.lazy(() => import("./Signup/index.page"));
export const UserAccount = React.lazy(() => import("./UserAccount/index.page"));
export const UserDashboard = React.lazy(() =>
  import("./UserDashboard/index.page")
);
export const PaymentSuccess = React.lazy(() =>
  import("./PaymentSuccess/index.page")
);
export const VideoConferencing = React.lazy(() =>
  import("./VideoConferencing/index.page")
);
export const PurchasePlan = React.lazy(() =>
  import("./PurchasePlan/index.page")
);
export const PlanSubscription = React.lazy(() =>
  import("./PlanSubscription/index.page")
);
export const PaymentMethod = React.lazy(() =>
  import("./PaymentMethod/index.page")
);
export const UserContactUs = React.lazy(() =>
  import("./UserContactUs/index.page")
);
export const Translation = React.lazy(() => import("./Translation/index.page"));
export const SavedPayment = React.lazy(() =>
  import("./PaymentMethod/SavedPaymentOffer/index")
);
export const CreditCard = React.lazy(() =>
  import("./PaymentMethod/CreditCard/index")
);
// export const UserPrivacyPolicy = React.lazy(() =>
//   import("./ManageCms/PrivacyPolicy/index.page")
// );
// export const UserEndUserAgreement = React.lazy(() =>
//   import("./ManageCms/EndUserAgreement/index.page")
// );
// export const UserFaq = React.lazy(() => import("./ManageCms/FAQs/index.page"));
// export const UserPrivacyPolicy = React.lazy(() =>
//   import("./ManageCms/PrivacyPolicy/index.page")
// );
// export const UserEndUserAgreement = React.lazy(() =>
//   import("./ManageCms/EndUserAgreement/index.page")
// );
// export const UserFaq = React.lazy(() => import("./ManageCms/FAQs/index.page"));
// export const UserCookiePolicy = React.lazy(() =>
//   import("./ManageCms/CookiesPolicy/index.page")
// );

export const UserCms = React.lazy(() => import("./ManageCms/index.page"));
export const JitsiMeet = React.lazy(() => import("./JitsiMeet/index.page"));
export const PaymentSummary = React.lazy(() =>
  import("./PaymentSummary/index.page")
);
export const JitsiInvitee = React.lazy(() => import("./Invitee/index.page"));
export const Notifications = React.lazy(() =>
  import("./Notifications/index.page")
);
export const OurTeam = React.lazy(() => import("./OurTeam/index.page"));
export const Partners = React.lazy(() => import("./Partners/index.page"));
export const VideoDisplay = React.lazy(() => import("./VideoDisplay/index"));
export const ReferFriend = React.lazy(() => import("./ReferFriend/index.page"));
export const ReferralRewards = React.lazy(() =>
  import("./ReferralRewards/index.page")
);
export const UnRegisterJitsiMeet = React.lazy(() =>
  import("./UnRegisterJitsiMeet/index.page")
);
export const UnRegisterInvitee = React.lazy(() =>
  import("./UnRegisterInvitee/index.page")
);
export const AboutUs = React.lazy(() => import("./AboutUs/index.page"));

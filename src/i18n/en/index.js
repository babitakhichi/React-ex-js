import { appLanguage as aboutUs } from "./AboutUs/index.i18n";
import { appLanguage as accessibility } from "./Accessibility/index.i18n";
import { appLanguage as adminHeader } from "./Admin/AdminHeader/index.i18n";
import { appLanguage as changePassword } from "./ChangePassword/index.i18n";
import { appLanguage as common } from "./Common/index.i18n";
import { appLanguage as dashboard } from "./Dashboard/index.i18n";
import { appLanguage as forgetPassword } from "./ForgotPassword/index.i18n";
import { appLanguage as landingPage } from "./LandingPage/index.i18n";
import { appLanguage as adminLogin } from "./Login/index.i18n";
import { appLanguage as manageSubscription } from "./ManageSubscription/index.i18n";
import { appLanguage as profile } from "./Profile/index.i18n";
import { appLanguage as resetPassword } from "./ResetPassword/index.i18n";
import { appLanguage as notification } from "./Notification/index.i18n";
import { appLanguage as ourTeam } from "./OurTeam/index.i18n";
import { appLanguage as partners } from "./Partners/index.i18n";
import { appLanguage as promoCode } from "./PromoCode/index.i18n";
import {
  userFooter,
  userLogin,
  userProfile,
  userSignUp,
  userContactUs,
  userPayment,
  userHome,
  userPurchasePlan,
  planAndSubscription,
  videoConferencing,
  userPasswordProtected,
  referFriend,
  referralRewards,
  coupanCode,
  header,
} from "./User";
import { appLanguage as verification } from "./Verification/index.i18n";
import {
  adminUpdateProfile,
  AdminUpdateSocialLink,
  master,
  pendingQueries,
  userManagement,
  discountRequest,
  transactionHistory,
  newsletterSubscribers,
  faqs,
  manageCmsList,
  privacyPolicy,
  termsAndCondition,
  cookiesPolicy,
  manageClientsPartners,
  manageTeamMembers,
  manageTaxes,
  referralAdmin,
} from "./Admin";

export default function lang() {
  return {
    text: {
      adminLogin: adminLogin.text,
      adminVerification: verification.text,
      common: common.text,
      userHome: userHome.text,
      userProfile: userProfile.text,
      userPurchasePlan: userPurchasePlan.text,
      dashboard: dashboard.text,
      userContactUs: userContactUs.text,
      cookiesPolicy: cookiesPolicy.text,
      userFooter: userFooter.text,
      discountRequest: discountRequest.text,
      videoConferencing: videoConferencing.text,
      planAndSubscription: planAndSubscription.text,
      landingPage: landingPage.text,
      aboutUs: aboutUs.text,
      newsletterSubscribers: newsletterSubscribers.text,
      userSignUp: userSignUp.text,
      AdminUpdateSocialLink: AdminUpdateSocialLink.text,
      accessibility: accessibility.text,
      userLogin: userLogin.text,
      profile: profile.text,
      master: master.text,
      changePassword: changePassword.text,
      manageCms: manageCmsList.text,
      adminResetPassword: resetPassword.text,
      adminForgetPassword: forgetPassword.text,
      termsAndCondition: termsAndCondition.text,
      manageSubscription: manageSubscription.text,
      privacyPolicy: privacyPolicy.text,
      faqs: faqs.text,
      adminHeader: adminHeader.text,
      notification: notification.text,
      adminUpdateProfile: adminUpdateProfile.text,
      pendingQueries: pendingQueries.text,
      userManagement: userManagement.text,
      userPayment: userPayment.text,
      transactionHistory: transactionHistory.text,
      ourTeam: ourTeam.text,
      partners: partners.text,
      manageClientsPartners: manageClientsPartners.text,
      manageTeamMembers: manageTeamMembers.text,
      userPasswordProtected: userPasswordProtected.text,
      manageTaxes: manageTaxes.text,
      promoCode: promoCode.text,
      referFriend: referFriend.text,
      referralRewards: referralRewards.text,
      referralAdmin: referralAdmin.text,
      coupanCode: coupanCode.text,
      header: header.text,
    },
    validation: {
      adminLogin: adminLogin.validation,
      adminVerification: verification.validation,
      userLogin: userLogin.validation,
      userProfile: userProfile.validation,
      planAndSubscription: planAndSubscription.validation,
      userContactUs: userContactUs.validation,
      manageTeamMembers: manageTeamMembers.validation,
      AdminUpdateSocialLink: AdminUpdateSocialLink.validation,
      landingPage: landingPage.validation,
      profile: profile.validation,
      cookiesPolicy: cookiesPolicy.validation,
      newsletterSubscribers: newsletterSubscribers.validation,
      userSignUp: userSignUp.validation,
      videoConferencing: videoConferencing.validation,
      discountRequest: discountRequest.validation,
      changePassword: changePassword.validation,
      master: master.validation,
      manageSubscription: manageSubscription.validation,
      manageCms: manageCmsList.validation,
      adminResetPassword: resetPassword.validation,
      adminUpdateProfile: adminUpdateProfile.validation,
      adminForgetPassword: forgetPassword.validation,
      faqs: faqs.validation,
      pendingQueries: pendingQueries.validation,
      userManagement: userManagement.validation,
      privacyPolicy: privacyPolicy.validation,
      termsAndCondition: termsAndCondition.validation,
      userPayment: userPayment.validation,
      transactionHistory: transactionHistory.validation,
      common: common.validation,
      manageClientsPartners: manageClientsPartners.validation,
      referralAdmin: referralAdmin.validation,
      promoCode: promoCode.validation,
    },
  };
}

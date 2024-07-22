import loadable from "@loadable/component";

// export { default as AdminLoginForm } from "./Login/index.form";
// export { default as AddEditReasonForm } from "./AddEditReasonForm/index.form";
// export { default as AdminChangePasswordForm } from "./ChangePasswordForm/index.form";
// export { default as AdminUpdateSocialLink } from "./UpdateSocialLink/index.form";
// export { default as AdminForgotPasswordForm } from "./ForgotPassword/index.form";
// export { default as EditFAQSForm } from "./EditFAQSForm/index.form";
// export { default as SendReplyform } from "./SendReplyForm/index.form";
// export { default as AdminOtpVerificationForm } from "./OtpVerification/index.form";
// export { default as AdminResetPasswordForm } from "./ResetPassword/index.form";
// export { default as AdminUpdateProfileForm } from "./UpdateProfile/index.form";
// export { default as AddEditPlanForm } from "./AddEditPlanForm/index.form";
// export { default as DateFilterForm } from "./DateFilterForm/index.form";
export * from "./ManageCms";
export * from "./Master";
export * from "./UserManagement";

export const AdminLoginForm = loadable(() => import("./Login/index.form"));
export const AddEditReasonForm = loadable(() =>
  import("./AddEditReasonForm/index.form")
);
export const AdminChangePasswordForm = loadable(() =>
  import("./ChangePasswordForm/index.form")
);
export const AdminUpdateSocialLink = loadable(() =>
  import("./UpdateSocialLink/index.form")
);
export const AdminForgotPasswordForm = loadable(() =>
  import("./ForgotPassword/index.form")
);
export const EditFAQSForm = loadable(() => import("./EditFAQSForm/index.form"));
export const SendReplyform = loadable(() =>
  import("./SendReplyForm/index.form")
);
export const AdminOtpVerificationForm = loadable(() =>
  import("./OtpVerification/index.form")
);
export const AdminResetPasswordForm = loadable(() =>
  import("./ResetPassword/index.form")
);
export const ReasonRejectForm = loadable(() =>
  import("./DiscountRequestForms/ReasonRejectForm/index.form")
);
export const DiscountAmountForm = loadable(() =>
  import("./DiscountRequestForms/DiscountAmountForm/index.form")
);
export const AdminUpdateProfileForm = loadable(() =>
  import("./UpdateProfile/index.form")
);
export const AddEditPlanForm = loadable(() =>
  import("./AddEditPlanForm/index.form")
);
export const DateFilterForm = loadable(() =>
  import("./DateFilterForm/index.form")
);
export const SendNewsletterForm = loadable(() =>
  import("./SendNewsletterForm/index.form")
);
export const AddEditTeamMemberForm = loadable(() =>
  import("./AddEditTeamMemberForm/index.form")
);
export const AddEditClientPartnerForm = loadable(() =>
  import("./AddEditClientPartnerForm/index.form")
);
export const ManageTaxesForm = loadable(() =>
  import("./ManageTaxesForm/index.form")
);
export const PromoCodeForm = loadable(() =>
  import("./PromoCodeForm/index.form")
);
export const UpdateReferralsForm = loadable(() =>
  import("./UpdateReferrals/index.form")
);
export const HeadquarterForm = loadable(() =>
  import("./HeadquarterForm/index.form")
);

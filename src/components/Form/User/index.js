import loadable from "@loadable/component";

// export { default as UserLoginForm } from "./UserLogin/index.form";
// export { default as SignUpStep3Form } from "./SignUpForm/Step3Form/index.form";
// export { default as SignUpStep1Form } from "./SignUpForm/Step1Form/index.form";
// export { default as SignUpStep2Form } from "./SignUpForm/Step2Form/index.form";

// export { default as UserContactUsForm } from "./UserContactUs/index.form";
// export { default as UserAccountForm } from "./UserAccount/index.form"; N/A
export * from "./UserAccount/index.form";
// export { default as UserVerificationForm } from "./UserVerificationForm/index.form";
// export { default as UserSubscribeForm } from "./SubscribeForm/index.form";

export const UserLoginForm = loadable(() => import("./UserLogin/index.form"));
export const SignUpStep3Form = loadable(() =>
  import("./SignUpForm/Step3Form/index.form")
);
export const SignUpStep1Form = loadable(() =>
  import("./SignUpForm/Step1Form/index.form")
);
export const SignUpStep2Form = loadable(() =>
  import("./SignUpForm/Step2Form/index.form")
);
export const UserContactUsForm = loadable(() =>
  import("./UserContactUs/index.form")
);
export const UserVerificationForm = loadable(() =>
  import("./UserVerificationForm/index.form")
);
export const UserSubscribeForm = loadable(() =>
  import("./SubscribeForm/index.form")
);

export const AffirmativeAction = loadable(() =>
  import("./AffirmativeForm/index.form")
);

export const InternetBankingForm = loadable(() =>
  import("./InternetBankingForm/index.form")
);
export const UPIForm = loadable(() => import("./UPIForm/index.form"));
export const SaveOptionForm = loadable(() => import("./SavedOptionForm/index"));

export const CreditCardForm = loadable(() =>
  import("./CreditCardForm/index.form")
);
export const PlanMeetingForm = loadable(() =>
  import("./PlanMeetingForm/index.form")
);
export const PaymentModeFrom = loadable(() =>
  import("./PaymentData/index.form")
);
export const PaymentFrom = loadable(() => import("./PaymentForm/index.form"));
export const StartMeetingsForm = loadable(() =>
  import("./StartMeetingsForm/index.form")
);
export const ShareForm = loadable(() => import("./ShareForm/index.form"));
export const AssignUserForm = loadable(() =>
  import("./AssignUserForm/index.form")
);

export const RecordingForm = loadable(() =>
  import("./RecordingForm/index.form")
);
export const PasswordProtectedForm = loadable(() =>
  import("./PasswordProtectedForm/index.form")
);
export const CoupanCodeForm = loadable(() =>
  import("./CoupanCodeForm/index.form")
);

import loadable from "@loadable/component";

// export { default as PrivacyPolicyForm } from "./PrivacyPolicy/index.form";
// export { default as TermsAndConditionsForm } from "./TermsAndConditions/index.form";

export const PrivacyPolicyForm = loadable(() =>
  import("./PrivacyPolicy/index.form")
);
export const CookiesPolicyForm = loadable(() =>
  import("./CookiesPolicy/index.form")
);
export const TermsAndConditionsForm = loadable(() =>
  import("./TermsAndConditions/index.form")
);

import i18next from "i18next";
import * as yup from "yup";

export default function validation() {
  return yup.object().shape({
    // username: yup
    //   .string()
    //   .required(i18next.t("validation.adminUpdateProfile.displayName"))
    //   .matches(/^[^\s].+[^\s]$/g, i18next.t("validation.common.noSpace")),

    full_name: yup
      .string()
      .required(i18next.t("validation.adminUpdateProfile.fullName"))
      .max(20, i18next.t("validation.adminUpdateProfile.maxFullname"))
      .matches(
        /^[aA-zZ\s]+$/,
        i18next.t("validation.adminUpdateProfile.validFullName")
      )
      .matches(/^[^\s].+[^\s]$/g, i18next.t("validation.common.noSpace")),

    // email: yup
    //   .string()
    //   .required(i18next.t("validation.adminLogin.email"))
    //   .email(i18next.t("validation.adminLogin.validEmail")),
  });
}

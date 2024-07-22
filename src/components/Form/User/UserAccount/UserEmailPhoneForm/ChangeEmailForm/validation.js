import i18next from "i18next";
import * as yup from "yup";

export function Emailvalidation() {
  return yup.object().shape({
    email: yup
      .string()
      .required(i18next.t("validation.adminLogin.email"))
      .email(i18next.t("validation.adminLogin.validEmail")),
  });
}
export function Phonevalidation() {
  return yup.object().shape({
    phone_number: yup
      .string()
      .min(6, i18next.t("validation.adminLogin.minPhone"))
      .max(16, i18next.t("validation.adminLogin.minPhone"))
      .required(i18next.t("validation.adminLogin.phone")),
  });
}

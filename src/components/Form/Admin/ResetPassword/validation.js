import i18next from "i18next";
import * as yup from "yup";

export default function validation() {
  return yup.object().shape({
    newPassword: yup
      .string()
      // .min(6, i18next.t("validation.login.validPassword"))
      // .max(15, i18next.t("validation.login.validPassword"))
      .required(i18next.t("validation.adminResetPassword.newPassword")),
    confirmPassword: yup
      .string()
      .required(i18next.t("validation.adminResetPassword.confirmPassword"))
      .oneOf(
        [yup.ref("newPassword"), null],
        `${i18next.t("validation.adminResetPassword.confirmPasswordField")}`
      ),
  });
}

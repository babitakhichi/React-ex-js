import i18next from "i18next";
import * as yup from "yup";

export default function validation() {
  return yup.object().shape({
    oldPassword: yup
      .string()
      // .min(6, i18next.t("validation.login.validPassword"))
      // .max(15, i18next.t("validation.login.validPassword"))
      .required(i18next.t("validation.changePassword.currentPassword")),
    newPassword: yup
      .string()
      // .min(6, i18next.t("validation.login.validPassword"))
      // .max(15, i18next.t("validation.login.validPassword"))
      .required(i18next.t("validation.adminResetPassword.newPassword"))
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,15}$/,
        i18next.t("validation.adminResetPassword.passwordField")
      ),
    confirmPassword: yup
      .string()
      .required(i18next.t("validation.adminResetPassword.confirmPassword"))
      .oneOf(
        [yup.ref("newPassword"), null],
        `${i18next.t("validation.adminResetPassword.confirmPasswordField")}`
      ),
  });
}

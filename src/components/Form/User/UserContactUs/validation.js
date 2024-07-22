import i18next from "i18next";
import * as yup from "yup";

export default function validation(token) {
  return yup.object().shape({
    email: yup
      .string()
      .required(i18next.t("validation.userSignUp.email"))
      .email(i18next.t("validation.adminLogin.validEmail")),

    first_name: !token
      ? yup
          .string()
          .min(3, i18next.t("validation.userProfile.firstNameMin"))
          .max(15, i18next.t("validation.userProfile.firstNameMax"))
          .required(i18next.t("validation.userProfile.firstName"))
          .matches(
            /^[aA-zZ\s]+$/,
            i18next.t("validation.profile.validFirstName")
          )
      : null,
    last_name: !token
      ? yup
          .string()
          .min(3, i18next.t("validation.userProfile.lastNameMin"))
          .max(15, i18next.t("validation.userProfile.lastNameMax"))
          .required(i18next.t("validation.userProfile.lastName"))
          .matches(
            /^[aA-zZ\s]+$/,
            i18next.t("validation.userProfile.validLastName")
          )
      : null,
    phone_number: !token
      ? yup
          .string()
          .min(6, i18next.t("validation.adminLogin.minPhone"))
          .max(16, i18next.t("validation.adminLogin.minPhone"))
          .required(i18next.t("validation.userSignUp.phoneNumber"))
      : null,
    description: yup
      .string()
      .required(i18next.t("validation.manageCms.description"))
      .max(1000, i18next.t("validation.userSignUp.description"))
      .trim(),
    conatct_type_id: yup
      .string()
      .required(i18next.t("validation.userContactUs.help")),
    country_id: !token
      ? yup.string().required(i18next.t("validation.userSignUp.country"))
      : null,
  });
}

import i18next from "i18next";
import * as yup from "yup";

export default function validation(emailData, phoneNumber) {
  return yup.object().shape({
    email: emailData
      ? yup.string().email(i18next.t("validation.adminLogin.validEmail"))
      : null,
    first_name: yup
      .string()
      .min(3, i18next.t("validation.userProfile.firstNameMin"))
      .max(15, i18next.t("validation.userProfile.firstNameMax"))
      .required(i18next.t("validation.userProfile.firstName"))
      .matches(/^[aA-zZ]+$/, i18next.t("validation.profile.validFirstName")),
    last_name: yup
      .string()
      .min(3, i18next.t("validation.userProfile.lastNameMin"))
      .max(15, i18next.t("validation.userProfile.lastNameMax"))
      .required(i18next.t("validation.userProfile.lastName"))
      .matches(/^[a-zA-Z]+( [a-zA-Z]+)*$/, i18next.t("validation.userProfile.validLastName")),
    // phone_number: yup
    //   .number()
    //   .min(10, i18next.t("validation.profile.shortPhone"))
    //   .required(i18next.t("validation.profile.phoneNumber")),
    // company_name: yup
    //   .string()
    //   .required(i18next.t("validation.userProfile.companyName")),
    dob: yup.string().required(i18next.t("validation.userProfile.dob")),
    country_code:
      phoneNumber?.country_code && phoneNumber?.phone_number
        ? null
        : phoneNumber?.phone_number
        ? yup.string().required(i18next.t("validation.adminLogin.countryCode"))
        : null,
    phone_number: phoneNumber?.country_code
      ? yup
          .string()
          .min(6, i18next.t("validation.adminLogin.minPhone"))
          .max(16, i18next.t("validation.adminLogin.minPhone"))
          .required(i18next.t("validation.adminLogin.phoneNumberReq"))
      : null,
  });
}

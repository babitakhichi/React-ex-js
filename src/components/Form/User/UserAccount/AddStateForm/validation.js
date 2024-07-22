import i18next from "i18next";
import * as yup from "yup";

export function validation() {
  return yup.object().shape({
    state_id: yup.string().required(i18next.t("validation.userProfile.state")),
    country_id: yup
      .string()
      .required(i18next.t("validation.userSignUp.country")),
    first_name: yup
      .string()
      .min(3, i18next.t("validation.userProfile.firstNameMin"))
      .max(15, i18next.t("validation.userProfile.firstNameMax"))
      .required(i18next.t("validation.userProfile.firstName"))
      .matches(
        /^[aA-zZ]+$/,
        i18next.t("validation.userProfile.validFirstName")
      ),
    last_name: yup
      .string()
      .min(3, i18next.t("validation.userProfile.lastNameMin"))
      .max(15, i18next.t("validation.userProfile.lastNameMax"))
      .required(i18next.t("validation.userProfile.lastName"))
      .matches(
        /^[a-zA-Z]+( [a-zA-Z]+)*$/,
        i18next.t("validation.userProfile.validLastName")
      ),
    language: yup
      .string()
      .required(i18next.t("validation.userProfile.language")),
    gender_id: yup
      .string()
      .required(i18next.t("validation.userProfile.gender")),
    profile_address: yup
      .string()
      .required(i18next.t("validation.userProfile.address"))
      .required(i18next.t("validation.userProfile.address")),
    zip_code: yup
      .string()
      .matches(
        /^[a-zA-Z\d]{5,}$/,
        i18next.t("validation.userProfile.invalidPostal")
      )
      .required(i18next.t("validation.userProfile.postal_code")),
    city_id: yup.string().required(i18next.t("validation.userProfile.city")),
  });
}

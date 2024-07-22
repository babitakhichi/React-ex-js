import i18next from "i18next";
import * as yup from "yup";

export default function validation() {
  return yup.object().shape({
    country_id: yup
      .string()
      .required(i18next.t("validation.userSignUp.country")),
    state_id:yup
      .string()
      .required(i18next.t("validation.userProfile.state")),
    city_id:yup
    .string()
    .required(i18next.t("validation.userProfile.city")),
  });
}

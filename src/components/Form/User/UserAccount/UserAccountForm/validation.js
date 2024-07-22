import i18next from "i18next";
import * as yup from "yup";

export default function validation(profileData, value) {
  return yup.object().shape({
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
    state_id: yup.string().required(i18next.t("validation.userProfile.state")),
    profile_address:yup.string().required(i18next.t("validation.userProfile.address"))
        .required(i18next.t("validation.userProfile.address")),
    zip_code: yup.string().matches(/^[a-zA-Z\d]{5,}$/,i18next.t("validation.userProfile.invalidPostal"))
        .required(i18next.t("validation.userProfile.postal_code")),
    organization_name: profileData?.UserBusinessAccount
      ? yup
          .string()
          .min(3, i18next.t("validation.userProfile.minOrganization"))
          .required(i18next.t("validation.userProfile.organization_name"))
      : null,
    city_id:yup.string().required(i18next.t("validation.userProfile.city")),
    address: profileData?.UserBusinessAccount
      ? yup.string().required(i18next.t("validation.userProfile.address"))
      : null,
    city: profileData?.UserBusinessAccount
      ? yup.string().required(i18next.t("validation.userProfile.city"))
      : null,
    postal_code: profileData?.UserBusinessAccount
      ? yup.string().matches(/^[a-zA-Z\d]{5,}$/,i18next.t("validation.userProfile.invalidPostal")).required(i18next.t("validation.userProfile.postal_code"))
      : null,
    state: profileData?.UserBusinessAccount
      ? yup.string().required(i18next.t("validation.userProfile.state"))
      : null,
    business_country_id: profileData?.UserBusinessAccount
      ? yup.string().required(i18next.t("validation.userSignUp.country"))
      : null,
    pan_number: profileData?.UserBusinessAccount && !value?.isGST
      ? yup
          .string()
          .matches(/^[a-zA-Z0-9]*$/, i18next.t("validation.userProfile.invalidPan"))
          .required(i18next.t("validation.userProfile.panNumber"))
          .min(10, i18next.t("validation.userProfile.minMaxPan"))
          .max(10, i18next.t("validation.userProfile.minMaxPan"))
      : null,
    gst_number:
      profileData?.UserBusinessAccount && !value?.isGST
        ? yup.string()
          .min(15,i18next.t("validation.userProfile.minMaxGst"))
          .max(15,i18next.t("validation.userProfile.minMaxGst"))
          .required(i18next.t("validation.userProfile.gst_number"))
        : null,
  });
}

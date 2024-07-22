import i18next from "i18next";
import * as yup from "yup";

export default function validation(value) {
  return yup.object().shape({
    organization_name: yup
      .string()
      .min(3, i18next.t("validation.userProfile.minOrganization"))
      .required(i18next.t("validation.userProfile.organization_name")),
    address: yup.string().required(i18next.t("validation.userProfile.address")),
    city: yup.string().required(i18next.t("validation.userProfile.city")),
    postal_code: yup
      .string()
      .matches(/^[a-zA-Z\d]{5,}$/,i18next.t("validation.userProfile.invalidPostal"))
      .required(i18next.t("validation.userProfile.postal_code")),
    state: yup.string().required(i18next.t("validation.userProfile.state")),
    business_country_id: yup
      .string()
      .required(i18next.t("validation.userSignUp.country")),
    pan_number: 
      !value?.isGST
      ? yup.string()
      .matches(/^[a-zA-Z0-9]*$/, i18next.t("validation.userProfile.invalidPan"))
      .min(10, i18next.t("validation.userProfile.minMaxPan"))
      .max(10, i18next.t("validation.userProfile.minMaxPan"))
      .required(i18next.t("validation.userProfile.panNumber"))
      : null,
    gst_number: !value?.isGST
      ? yup.string()
        .min(15,i18next.t("validation.userProfile.minMaxGst"))
        .max(15,i18next.t("validation.userProfile.minMaxGst"))
        .required(i18next.t("validation.userProfile.gst_number"))
      : null,
  });
}

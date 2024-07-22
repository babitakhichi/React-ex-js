import i18next from "i18next";
import * as yup from "yup";

export default function validation() {
  const URL =
    /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;
  return yup.object().shape({
    facebook: yup
      .string()
      .required(i18next.t("validation.AdminUpdateSocialLink.facebook"))
      .matches(URL, i18next.t("validation.AdminUpdateSocialLink.validLink"))
      .trim(),
    twitter: yup
      .string()
      .required(i18next.t("validation.AdminUpdateSocialLink.twitter"))
      .matches(URL, i18next.t("validation.AdminUpdateSocialLink.validLink"))
      .trim(),
    instagram: yup
      .string()
      .required(i18next.t("validation.AdminUpdateSocialLink.instagram"))
      .matches(URL, i18next.t("validation.AdminUpdateSocialLink.validLink"))
      .trim(),
    linkedin: yup
      .string()
      .required(i18next.t("validation.AdminUpdateSocialLink.linkedin"))
      .matches(URL, i18next.t("validation.AdminUpdateSocialLink.validLink"))
      .trim(),
  });
}

import i18next from "i18next";
import * as yup from "yup";

export default function validation() {
  return yup.object().shape({
    subject: yup
      .string()
      .required(i18next.t("validation.userManagement.subjectValid"))
      .matches(/^[^\s].+[^\s]$/g, i18next.t("validation.common.noSpace")),
    message: yup
      .string()
      .required(i18next.t("validation.userManagement.messageValid"))
      .matches(/^[^\s].+[^\s]$/g, i18next.t("validation.common.noSpace")),
  });
}

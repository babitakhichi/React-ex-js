import i18next from "i18next";
import * as yup from "yup";

export default function validation() {
  return yup.object().shape({
    contact_reason: yup
      .string()
      .required(i18next.t("validation.master.reason"))
      .min(3, i18next.t("validation.master.reasonGreater"))
      .max(50, i18next.t("validation.master.reasonTypeLess"))
      .matches(
        /^[aA-zZ\s]+$/,
        i18next.t("validation.master.alphabetsValidation")
      )
      .matches(/^[^\s].+[^\s]$/g, i18next.t("validation.common.noSpace")),
  });
}

import i18next from "i18next";
import * as yup from "yup";

export default function validation() {
  return yup.object().shape({
    document_type: yup
      .string()
      .required(i18next.t("validation.master.documentTypeRequired"))
      .min(3, i18next.t("validation.master.documentTypeGreater"))
      .max(50, i18next.t("validation.master.documentTypeLess"))
      .matches(/^[^\s].+[^\s]$/g, i18next.t("validation.common.noSpace")),
  });
}

import i18next from "i18next";
import * as yup from "yup";

export default function validation() {
  return yup.object().shape({
    title: yup
      .string()
      .required(i18next.t("validation.newsletterSubscribers.title")),
    description: yup
      .string()
      .required(i18next.t("validation.manageCms.description")),
  });
}

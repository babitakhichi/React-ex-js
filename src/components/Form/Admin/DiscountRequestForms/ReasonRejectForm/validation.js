import i18next from "i18next";
import * as yup from "yup";

export default function validation() {
  return yup.object().shape({
    reason: yup
      .string()
      .required(i18next.t("validation.discountRequest.reason")),
  });
}

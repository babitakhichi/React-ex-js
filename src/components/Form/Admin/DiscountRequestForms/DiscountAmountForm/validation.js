import i18next from "i18next";
import * as yup from "yup";

export default function validation() {
  return yup.object().shape({
    refund_amount: yup
      .number()
      .positive(i18next.t("validation.discountRequest.validAmount"))
      .integer(i18next.t("validation.discountRequest.validAmount"))
      .required(i18next.t("validation.discountRequest.discountAmount")),
  });
}

import i18next from "i18next";
import * as yup from "yup";

const expiryDate = /^(0[1-9]|1[0-2])\/?([0-9]{4}|[0-9]{2})$/;

export function validation() {
  return yup.object().shape({
    card_holder_name: yup
      .string()
      .required(i18next.t("validation.userPayment.cardHolder"))
      .matches(/^[aA-zZ\s]+$/, i18next.t("validation.userPayment.validName")),
    card_number: yup
      .string()
      .required(i18next.t("validation.userPayment.cardNumber"))
      .min(14, i18next.t("validation.userPayment.maxCardNo"))
      .max(16, i18next.t("validation.userPayment.maxCardNo")),
    expireDate: yup
      .string()
      .required(i18next.t("validation.userPayment.expireDate"))
      .matches(expiryDate, i18next.t("validation.userPayment.validExpire")),
    card_cvv: yup
      .string()
      .required(i18next.t("validation.userPayment.cvv"))
      .min(3, i18next.t("validation.userPayment.maxCvv"))
      .max(4, i18next.t("validation.userPayment.maxCvv")),
    description: yup
      .string()
      .required(i18next.t("validation.userPayment.description")),
    document_type: yup
      .string()
      .required(i18next.t("validation.userPayment.documentType")),
  });
}

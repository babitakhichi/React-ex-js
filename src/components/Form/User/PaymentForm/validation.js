import i18next from "i18next";
import * as yup from "yup";

export default function validation(values, planDetails) {
  return yup.object().shape({
    payment_type: yup
      .string()
      .required(i18next.t("validation.userPayment.paymentType")),
    description:
      values?.affirmative === "1"
        ? yup.string().required(i18next.t("validation.userPayment.description"))
        : null,
    image:
      values?.affirmative === "1"
        ? yup
            .string()
            .required(i18next.t("validation.userPayment.documentUpload"))
        : null,
    document_type:
      values?.affirmative === "1"
        ? yup
            .string()
            .required(i18next.t("validation.userPayment.documentType"))
        : null,
    category:
      values?.affirmative === "1"
        ? yup.string().required(i18next.t("validation.userPayment.category"))
        : null,
    refund_type:
      values?.affirmative === "1"
        ? yup.string().required(i18next.t("validation.userPayment.refundType"))
        : null,
    no_licenses:
      planDetails?.is_corporate === "1"
        ? yup
            .number()
            .integer(i18next.t("validation.userPayment.invalidLicenses"))
            .min(1, i18next.t("validation.userPayment.minLicenses"))
            .required(i18next.t("validation.userPayment.noLicenses"))
        : null,
  });
}

import i18next from "i18next";
import * as yup from "yup";

export default function validation() {
  return yup.object().shape({
    // internet_bank: yup
    //   .string()
    //   .required(i18next.t("validation.userPayment.upiId")),
    description: yup
      .string()
      .required(i18next.t("validation.userPayment.description")),
    document_type: yup
      .string()
      .required(i18next.t("validation.userPayment.documentType")),
  });
}

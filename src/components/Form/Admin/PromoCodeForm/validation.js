import { t } from "i18next";
import * as yup from "yup";

export default function validation(userType) {
  return yup.object().shape({
    // title: yup
    //     .string()
    //     .required(t("validation.newsletterSubscribers.title")),
    description: yup.string().required(t("validation.manageCms.description")),
    code: yup.string().required(t("validation.promoCode.requiredCode")),
    // max_discount: yup
    //   .number()
    //   .integer(t("validation.promoCode.mustNumber"))
    //   .min(1, t("validation.promoCode.invalidMaxDiscount"))
    //   .typeError(t("validation.promoCode.mustNumber"))
    //   .required(t("validation.promoCode.requiredMaxDiscount")),
    minimum_purchase: yup
      .number()
      .integer(t("validation.promoCode.mustNumber"))
      .min(1, t("validation.promoCode.invalidMinimumPurchase"))
      .typeError(t("validation.promoCode.mustNumber"))
      .required(t("validation.promoCode.requiredMinimumPurchase")),
    limit_per_user: yup
      .number()
      .integer(t("validation.promoCode.mustNumber"))
      .min(1, t("validation.promoCode.invalidLimit"))
      .typeError(t("validation.promoCode.mustNumber"))
      .required(t("validation.promoCode.requiredLimitPerUser")),
    discount_percentage: yup
      .number()
      .integer(t("validation.promoCode.mustNumber"))
      .min(1, t("validation.promoCode.invalidDiscount"))
      .typeError(t("validation.promoCode.mustNumber"))
      .max(100, t("validation.promoCode.discountLessThan"))
      .required(t("validation.promoCode.requiredDiscountPercentage")),
    user_ids:
      userType === "specific"
        ? yup.array().min(1, t("validation.promoCode.specificUsers"))
        : null,
    start_date: yup
      .string()
      .typeError(t("validation.promoCode.requiredStartDate"))
      .required(t("validation.promoCode.requiredStartDate")),
    end_date: yup
      .string()
      .typeError(t("validation.promoCode.requiredStartDate"))
      .required(t("validation.promoCode.requiredEndDate")),
    intervals: yup.string().required(t("validation.promoCode.appliedOn")),
  });
}

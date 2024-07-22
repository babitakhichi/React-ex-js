import * as yup from "yup";
import i18next from "i18next";

export default function validation() {
  return yup.object().shape({
    message: yup
      .string()
      .required(i18next.t("validation.referralAdmin.message")),
    purchase_reward: yup
      .number()
      .integer(i18next.t("validation.promoCode.mustNumber"))
      .min(1, i18next.t("validation.referralAdmin.invalidPurchaseReward"))
      .typeError(i18next.t("validation.promoCode.mustNumber"))
      .required(i18next.t("validation.referralAdmin.purchase_reward")),
    signup_reward: yup
      .number()
      .integer(i18next.t("validation.promoCode.mustNumber"))
      .min(1, i18next.t("validation.referralAdmin.invalidSignupReward"))
      .typeError(i18next.t("validation.promoCode.mustNumber"))
      .required(i18next.t("validation.referralAdmin.signup_reward")),
    max_coins_limit: yup
      .number()
      .integer(i18next.t("validation.promoCode.mustNumber"))
      .min(1, i18next.t("validation.referralAdmin.invalidMaxCoinLimit"))
      .typeError(i18next.t("validation.promoCode.mustNumber"))
      .required(i18next.t("validation.referralAdmin.max_coins_limit")),
  });
}

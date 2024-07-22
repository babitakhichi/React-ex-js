import i18next from "i18next";
import * as yup from "yup";

export default function validation(planValue, checkboxData, rowData) {
  return yup.object().shape({
    name: !rowData?.is_basic
      ? yup
          .string()
          .required(i18next.t("validation.manageSubscription.planName"))
          .matches(/^[^\s].+[^\s]$/g, i18next.t("validation.common.noSpace"))
      : null,
    price: !rowData?.is_basic
      ? yup
          .number()
          .positive(i18next.t("validation.manageSubscription.priceValid"))
          .integer(i18next.t("validation.manageSubscription.priceValid"))
          // .min(0, i18next.t("validation.manageSubscription.priceGreater"))
          .required(i18next.t("validation.manageSubscription.price"))
      : null,
    quarterly: !rowData?.is_basic
      ? yup
          .number()
          .positive(i18next.t("validation.manageSubscription.quarterlyValid"))
          .integer(i18next.t("validation.manageSubscription.quarterlyValid"))
          .max(
            planValue?.price,
            i18next.t("validation.manageSubscription.quarterlyThanPrice")
          )
          // .min(1, i18next.t("validation.manageSubscription.quarterlyGreater"))
          .required(i18next.t("validation.manageSubscription.quaterlyPrice"))
      : null,
    half_yearly: !rowData?.is_basic
      ? yup
          .number()
          .positive(i18next.t("validation.manageSubscription.half_yearlyValid"))
          .integer(i18next.t("validation.manageSubscription.half_yearlyValid"))
          .max(
            planValue?.quarterly,
            i18next.t("validation.manageSubscription.half_yearlyThanPrice")
          )
          // .min(1, i18next.t("validation.manageSubscription.half_yearlyGreater"))
          .required(i18next.t("validation.manageSubscription.halfYearlyPrice"))
      : null,
    annual: !rowData?.is_basic
      ? yup
          .number()
          .positive(i18next.t("validation.manageSubscription.annualValid"))
          .integer(i18next.t("validation.manageSubscription.annualValid"))
          .max(
            planValue?.half_yearly,
            i18next.t("validation.manageSubscription.annualThanPrice")
          )
          // .min(1, i18next.t("validation.manageSubscription.annualGreater"))
          .required(i18next.t("validation.manageSubscription.annualPrice"))
      : null,
    plan_type: !rowData?.is_basic
      ? yup
          .string()
          .required(i18next.t("validation.manageSubscription.planType"))
      : null,
    translation: checkboxData?.freeCharacters_checkbox
      ? yup
          .number()
          .min(
            1,
            i18next.t(
              "validation.manageSubscription.translationGreaterThenZero"
            )
          )
          .required(i18next.t("validation.manageSubscription.translation"))
      : null,
    meet_duration: checkboxData?.meeting_duration
      ? yup
          .number()
          .min(
            30,
            i18next.t(
              "validation.manageSubscription.meetDurationGreaterThenZero"
            )
          )
          .required(i18next.t("validation.manageSubscription.meetDuration"))
      : null,
    audio_video_conference: checkboxData?.audio_video_conference_checkbox
      ? yup
          .number()
          .min(
            1,
            i18next.t("validation.manageSubscription.audioVideoGreaterThenZero")
          )
          .required(i18next.t("validation.manageSubscription.audioVideo"))
      : null,
    // cloud_storage: checkboxData?.storage_value
    //   ? yup
    //       .number()
    //       .min(
    //         1,
    //         i18next.t("validation.manageSubscription.cloudGreaterThenZero")
    //       )
    //       .required(i18next.t("validation.manageSubscription.cloud"))
    //   : null,

    translationType:
      checkboxData?.translationCheckbox === true
        ? yup
            .array()
            .of(yup.string())
            .min(1, i18next.t("validation.manageSubscription.translationType"))
            .required(
              i18next.t("validation.manageSubscription.translationType")
            )
        : null,
    documentType: planValue?.translationType?.includes("document")
      ? yup
          .array()
          .of(yup.string())
          .min(1, i18next.t("validation.manageSubscription.documentType"))
          .required(i18next.t("validation.manageSubscription.documentType"))
      : null,
    mediaType: planValue?.translationType?.includes("audioVideo")
      ? yup
          .array()
          .of(yup.string())
          .min(1, i18next.t("validation.manageSubscription.mediaType"))
          .required(i18next.t("validation.manageSubscription.mediaType"))
      : null,
  });
}

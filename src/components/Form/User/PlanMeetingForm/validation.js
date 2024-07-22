import i18next from "i18next";
import * as yup from "yup";

export default function validation(value) {
  return yup.object().shape({
    invitation: yup
      .array()
      .of(yup.string().email(i18next.t("validation.adminLogin.validEmail"))),
    // .required(i18next.t("validation.adminLogin.email")),
    event_type: yup
      .string()
      .required(i18next.t("validation.videoConferencing.eventType")),
    host: yup
      .string()
      .required(
        i18next.t(
          `validation.videoConferencing.${
            value?.event_type ?? "Conference"
          }-host`
        )
      ),
    topic:
      value?.event_type === "Panel Discussion" ||
      value?.event_type === "TeleMed"
        ? yup
            .string()
            .required(
              i18next.t(
                `validation.videoConferencing.${
                  value?.event_type ?? "Conference"
                }-topic`
              )
            )
        : null,
    event_name: yup
      .string()
      .required(
        i18next.t(
          `validation.videoConferencing.${
            value?.event_type ?? "Conference"
          }-name`
        )
      )
      .trim()
      .matches(
        /^[a-zA-Z0-9 ]+$/g,
        i18next.t("validation.videoConferencing.eventNameValidation")
      ),
    subject:
      value?.event_type === "Class"
        ? yup
            .string()
            .required(i18next.t(`validation.videoConferencing.subject`))
        : null,
    // location: yup
    //   .string()
    //   .required(i18next.t("validation.videoConferencing.location")),
    time_zone: yup
      .string()
      .required(i18next.t("validation.videoConferencing.timeZone")),
    event_mode: yup
      .string()
      .required(i18next.t("validation.videoConferencing.eventMode")),
    start_date:
      value?.event_type === "TeleMed"
        ? yup
            .string()
            .required(i18next.t(`validation.videoConferencing.appointmentDate`))
        : yup
            .string()
            .required(i18next.t(`validation.videoConferencing.startDate`)),
    start_time: yup
      .string()
      .required(
        i18next.t(
          `validation.videoConferencing.${
            value?.event_type === "TeleMed" ? "appointmentTime" : "startTime"
          }`
        )
      ),
    duration: yup
      .string()
      .required(i18next.t("validation.videoConferencing.duration")),
    // description: yup
    //   .string()
    //   .required(i18next.t("validation.userPayment.description")),
    recurring_type: value?.is_recurring
      ? yup
          .string()
          .required(i18next.t("validation.videoConferencing.recurrence"))
      : null,
    recurring_interval: value?.is_recurring
      ? yup.string().required(i18next.t("validation.videoConferencing.repeat"))
      : null,
    end_date:
      value?.is_recurring && value?.byAfter === "1"
        ? yup
            .string()
            .required(i18next.t("validation.videoConferencing.endDate"))
        : null,
    end_occurrence:
      value?.is_recurring && value?.byAfter === "2"
        ? yup
            .string()
            .required(i18next.t("validation.videoConferencing.occurrences"))
        : null,
  });
}

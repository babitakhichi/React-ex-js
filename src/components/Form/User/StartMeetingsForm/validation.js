import i18next from "i18next";
import * as yup from "yup";

export default function validation() {
  return yup.object().shape({
    event_name: yup
      .string()
      .required(i18next.t("validation.videoConferencing.meeting"))
      .matches(
        /^[a-zA-Z0-9 ]+$/g,
        i18next.t("validation.videoConferencing.meetingNameValidation")
      ),
    invitation: yup
      .array()
      .of(yup.string().email(i18next.t("validation.adminLogin.validEmail"))),
    // .required(i18next.t("validation.adminLogin.email")),
  });
}

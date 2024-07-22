import i18next from "i18next";
import * as yup from "yup";

export default function validation() {
  return yup.object().shape({
    name: yup
      .string()
      .required(i18next.t("validation.manageTeamMembers.name"))

      .max(30, i18next.t("validation.manageTeamMembers.maxname"))
      .matches(
        /^[aA-zZ.\s]+$/,
        i18next.t("validation.manageTeamMembers.validName")
      )
      .matches(/^[^\s].+[^\s]$/g, i18next.t("validation.common.noSpace")),
    position: yup
      .string()
      .required(i18next.t("validation.manageTeamMembers.position"))
      .min(3, i18next.t("validation.manageTeamMembers.minPosition")),
    member_type: yup
      .string()
      .required(i18next.t("validation.manageTeamMembers.membertype")),
    image: yup
      .string()
      .required(i18next.t("validation.manageTeamMembers.image")),
    // description: yup
    // .string()
    // .required(i18next.t("validation.manageCms.description")) .max(300, i18next.t("validation.manageTeamMembers.maxdescription")),
  });
}

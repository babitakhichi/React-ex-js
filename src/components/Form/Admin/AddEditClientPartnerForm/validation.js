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

      category: yup
      .string()
      .required(i18next.t("validation.manageClientsPartners.category")),
         image: yup
      .string()
      .required(i18next.t("validation.manageTeamMembers.image")),
  
  });
}

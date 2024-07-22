import { Form, Formik } from "formik";
import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Input as TextInput, CommonButton } from "../../../index";
import validation from "./validation";

function AddEditReasonForm({
  onSubmit,
  hideReasonModal,
  reasonModal,
  loading,
  rowData,
}) {
  const { t } = useTranslation();
  const initialValues = {
    contact_reason: rowData?.contact_reason || "",
  };

  return (
    <Formik
      initialValues={{ ...initialValues }}
      validationSchema={validation()}
      onSubmit={onSubmit}
      enableReinitialize
    >
      {(props) => {
        return (
          <Form>
            <div className="form-group">
              <label className="form-label" htmlFor="documentType">
                {t("text.master.typeName")}
              </label>
              <TextInput
                className="form-control form-control-lg"
                placeholder={t("text.master.reason")}
                name="contact_reason"
                setFieldValue={props.handleChange}
                disabled={false}
                variant="standard"
                type="text"
              />
            </div>
            <div className="align-center justify-content-center flex-wrap flex-sm-nowrap gx-4 gy-2">
              <div>
                <CommonButton
                  extraClassName="btn btn-lg btn-primary"
                  loading={loading}
                  // onClick={()=>navigate(adminRoutesMap.OTP_VERIFICATION.path)}
                  htmltype="button"
                  type="submit"
                >
                  {reasonModal === "add"
                    ? t("text.common.add")
                    : t("text.common.update")}
                </CommonButton>
              </div>
              <div>
                <Link
                  href="#"
                  onClick={() => hideReasonModal()}
                  className="link link-light"
                >
                  {t("text.common.cancel")}
                </Link>
              </div>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
}

export default AddEditReasonForm;

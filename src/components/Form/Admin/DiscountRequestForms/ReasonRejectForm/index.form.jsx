import { Form, Formik } from "formik";
import { t } from "i18next";
import React from "react";
import { Link } from "react-router-dom";
import { AntTextArea } from "../../../../Antd";
import { CommonButton } from "../../../../UiElement";

import validation from "./validation";

function ReasonRejectForm({ onSubmit, onHideRejectModal, loading }) {
  const initialValues = {
    reason: "",
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
              <AntTextArea
                name="reason"
                setFieldValue={props.handleChange}
                className="form-control form-control-lg"
                placeholder={t("text.discountRequest.writeReason")}
              />
            </div>
            <div className="align-center justify-content-center flex-wrap flex-sm-nowrap gx-4 gy-2">
              <div>
                <CommonButton
                  htmltype="button"
                  type="submit"
                  extraClassName="btn btn-lg btn-primary"
                  loading={loading}
                >
                  {t("text.userLogin.submit")}
                </CommonButton>
              </div>
              <div>
                <Link
                  href="#"
                  onClick={() => onHideRejectModal()}
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

export default ReasonRejectForm;

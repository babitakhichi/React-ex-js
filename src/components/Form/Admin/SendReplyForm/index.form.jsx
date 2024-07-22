import { Form, Formik } from "formik";
import React from "react";
import { Link } from "react-router-dom";

import { Input as TextInput, CommonButton, AntTextArea } from "../../../index";
import validation from "./validation";

function ForgotPasswordForm({ t, hideSendMailModal, sendReply, rowData }) {
  const initialValues = {
    email: rowData?.email || "",
    message: "",
  };

  return (
    <Formik
      initialValues={{ ...initialValues }}
      validationSchema={validation()}
      onSubmit={sendReply}
      enableReinitialize
    >
      {(props) => {
        return (
          <Form>
            <div className="form-group">
              <label className="form-label" htmlFor="email">
                {t("text.adminLogin.email")}
              </label>
              <div className="form-control-wrap">
                <TextInput
                  id="email"
                  className="form-control form-control-lg"
                  name="email"
                  disabled
                  variant="standard"
                  type="email"
                  placeholder="Enter your email address"
                  setFieldValue={props.handleChange}
                  icon=""
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="Reply">
                {t("text.pendingQueries.reply")}
              </label>
              <AntTextArea
                name="message"
                className="form-control form-control-lg"
                placeholder="Enter Reply"
                setFieldValue={props.handleChange}
              />
            </div>
            <div className="align-center justify-content-end flex-wrap flex-sm-nowrap gx-4 gy-2">
              <div>
                <CommonButton
                  extraClassName="btn btn-lg btn-primary"
                  htmltype="button"
                  type="submit"
                >
                  {t("text.pendingQueries.sendReply")}
                </CommonButton>
              </div>
              <div>
                <Link
                  onClick={(e) => {
                    e.preventDefault();
                    hideSendMailModal();
                  }}
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

export default ForgotPasswordForm;

import { Form, Formik } from "formik";
import { t } from "i18next";
import React from "react";
import { Link } from "react-router-dom";
import { Input as TextInput } from "../../../Antd";
import { CommonButton, TextEditor } from "../../../UiElement";

import validation from "./validation";

function ReasonRejectForm({ onSubmit, hideSendNewsletterModal, loading }) {
  const initialValues = {
    title: "",
    description: "",
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
            <div className="row">
              <div className="col-sm-12">
                <div className="mb-3">
                  <label className="form-label" htmlFor="plan">
                    {t("text.newsletterSubscribers.title")}
                  </label>
                  <TextInput
                    className="form-control form-control-lg"
                    placeholder={t(
                      "text.newsletterSubscribers.titlePlaceholder"
                    )}
                    name="title"
                    disabled={false}
                    variant="standard"
                    setFieldValue={props.handleChange}
                    type="text"
                  />
                </div>
              </div>
              <div className="col-sm-12">
                <div className="mb-3">
                  <label className="form-label" htmlFor="plan">
                    {t("text.common.description")}
                  </label>
                  <TextEditor
                    setFieldValue={props.handleChange}
                    name="description"
                  />
                  {/* <AntTextArea
                    className="form-control form-control-lg"
                    placeholder={t("text.userContactUs.descriptionPlaceholder")}
                    name="description"
                    disabled={false}
                    setFieldValue={props.handleChange}
                    variant="standard"
                  /> */}
                </div>
              </div>
            </div>
            <div className="align-center justify-content-center flex-wrap flex-sm-nowrap gx-4 gy-2 mt-3">
              <div>
                <CommonButton
                  htmltype="button"
                  type="submit"
                  extraClassName="btn btn-lg btn-primary"
                  loading={loading}
                >
                  {t("text.common.send")}
                </CommonButton>
              </div>
              <div>
                <Link
                  href="#"
                  onClick={() => hideSendNewsletterModal()}
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

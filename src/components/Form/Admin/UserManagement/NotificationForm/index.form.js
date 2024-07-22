import { Formik, Form } from "formik";
import React from "react";
import { Link } from "react-router-dom";
import { t } from "i18next";
import { CommonButton, TextEditor } from "../../../../UiElement";
import { Input as TextInput } from "../../../../Antd";
import validation from "./validation";

function NotificationForm({ hideSendNotificationModal, onSubmit }) {
  const initialValues = {
    subject: "",
    message: "",
  };
  return (
    <>
      <Formik
        initialValues={{ ...initialValues }}
        onSubmit={onSubmit}
        validationSchema={validation()}
        enableReinitialize
      >
        {(props) => {
          return (
            <Form>
              <div className="form-group">
                <label className="form-label">Subject</label>
                <TextInput
                  className="form-control form-control-lg"
                  placeholder="Enter Subject"
                  name="subject"
                  setFieldValue={props.handleChange}
                />
              </div>
              <div className="form-group">
                <label className="form-label">
                  {t("text.userManagement.notificationMessage")}
                </label>
                {/* <AntTextArea
            className="form-control form-control-lg"
            placeholder="Enter Message"
          /> */}
                <TextEditor setFieldValue={props.handleChange} name="message" />
              </div>
              <div className="align-center justify-content-end flex-wrap flex-sm-nowrap gx-4 gy-2">
                <div>
                  <CommonButton
                    htmltype="submit"
                    type="submit"
                    className="btn btn-lg btn-primary"
                  >
                    {t("text.common.send")}
                  </CommonButton>
                </div>
                <div>
                  <Link
                    href="#"
                    onClick={() => hideSendNotificationModal()}
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
    </>
  );
}

export default NotificationForm;

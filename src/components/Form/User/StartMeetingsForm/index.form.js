import { Form, Formik } from "formik";
import { t } from "i18next";
// import { t } from "i18next";
import React from "react";
import { Input as TextInput } from "../../../Antd";
import { CommonButton, MultipleInput, RippleEffect } from "../../../UiElement";
// import { Col, Row } from "react-bootstrap";
import validation from "./validation";

export default function StartMeetingsForm({
  onSubmit,
  handleStartMeetingModalClose,
  startMeetingloading,
}) {
  const initialValues = {
    event_name: "",
    invitation: undefined,
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
            <div className="modalHeader">
              <h3>{t("text.videoConferencing.startMeeting")}</h3>
            </div>
            <div className="modalForm">
              <div className="form-group">
                <label className="form-label font-bd">
                  {" "}
                  {t("text.videoConferencing.meetingname")}
                </label>
                <div className="form-control-wrap">
                  <TextInput
                    className="form-control"
                    name="event_name"
                    type="text"
                    placeholder={t("text.videoConferencing.meetingPlaceholder")}
                    setFieldValue={props.handleChange}
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label font-bd">
                  {t("text.videoConferencing.invite")}
                </label>
                <div className="form-control-wrap">
                  <MultipleInput
                    setFieldValue={props.handleChange}
                    className="form-control"
                    type="text"
                    name="invitation"
                    placeholder={t("text.adminForgetPassword.emailPlaceholder")}
                    icon={
                      <div className="form-icon form-icon-left">
                        <em className="icon-mail" />
                      </div>
                    }
                  />
                </div>
              </div>
              <div className="text-end modalFooter">
                <RippleEffect extraClassName="me-2 me-sm-3" type="light">
                  <CommonButton
                    onClick={() => handleStartMeetingModalClose()}
                    variant="info"
                  >
                    {t("text.common.cancel")}
                  </CommonButton>
                </RippleEffect>
                <RippleEffect>
                  <CommonButton
                    variant="primary"
                    type="submit"
                    loading={startMeetingloading}
                  >
                    {t("text.videoConferencing.start")}
                  </CommonButton>
                </RippleEffect>
              </div>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
}

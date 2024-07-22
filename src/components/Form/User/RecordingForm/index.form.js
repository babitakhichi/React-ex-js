import { Form, Formik } from "formik";
import { t } from "i18next";

import React from "react";
import { Link } from "react-router-dom";
// import {
//   EmailShareButton,
//   FacebookShareButton,
//   LinkedinShareButton,
//   TelegramShareButton,
//   WhatsappShareButton,
//   EmailIcon,
//   FacebookIcon,
//   LinkedinIcon,
//   TelegramIcon,
//   WhatsappIcon,
// } from "react-share";
// import userRoutesMap from "../../../../routeControl/userRoutes";
import {
  // baseUrlGenerator,
  // encoder,
  modalNotification,
} from "../../../../utils";
import { Input as TextInput } from "../../../Antd";
// import { Col, Row } from "react-bootstrap";

export default function ShareForm({ onSubmit, recordingUrl }) {
  const initialValues = {
    share: recordingUrl
  };

  return (
    <Formik
      initialValues={{ ...initialValues }}
      onSubmit={onSubmit}
      enableReinitialize
    >
      {(props) => {
        return (
          <Form>
            <div className="modalHeader">
              <h3> {t("text.videoConferencing.recordingLink")}</h3>
            </div>
            <div className="shareModal_form">
              <div className="form-group copyClip w-100">
                <label className="form-label font-bd">
                  {t("text.videoConferencing.clickBelow")}
                </label>
                <div className="form-control-wrap d-flex">
                  <TextInput
                    className="form-control"
                    name="share"
                    type="text"
                    setFieldValue={props.handleChange}
                    // value="http://localhost:3000/video-conferencing"
                    readOnly
                  />
                  <Link
                    className="copyClip_icon d-flex align-items-center justify-content-center"
                    to="#"
                    onClick={(e) => {
                      e.preventDefault();
                      window.navigator.clipboard.writeText(
                        props?.values?.share
                      );
                      modalNotification({
                        type: "success",
                        message: t("text.videoConferencing.linkCopy"),
                      });
                    }}
                  >
                    <em className="icon-copy" />
                  </Link>
                </div>
              </div>
              {/* <div className="form-group">
                <label className="form-label font-bd">
                  {t("text.videoConferencing.shareInvitation")}
                </label>
                <div className="react-share">
                  <EmailShareButton url={props?.values?.share}>
                    <EmailIcon size="35" round />{" "}
                  </EmailShareButton>
                  <FacebookShareButton url={props?.values?.share}>
                    <FacebookIcon size="35" round />
                  </FacebookShareButton>
                  <LinkedinShareButton url={props?.values?.share}>
                    <LinkedinIcon size="35" round />
                  </LinkedinShareButton>
                  <TelegramShareButton url={props?.values?.share}>
                    <TelegramIcon size="35" round />
                  </TelegramShareButton>
                  <WhatsappShareButton url={props?.values?.share}>
                    <WhatsappIcon size="35" round />
                  </WhatsappShareButton>
                </div>
              </div> */}
            </div>
          </Form>
        );
      }}
    </Formik>
  );
}

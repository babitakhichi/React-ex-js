import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";

import {
  CommonButton,
  RippleEffect,
  ImageElement,
  ModalComponent,
  // AntSelect,
} from "../../../components";
import userRoutesMap from "../../../routeControl/userRoutes";
import { UserHomeServices } from "../../../services";
import {
  baseUrlGenerator,
  dateFormatter,
  encoder,
  logger,
  modalNotification,
  momentTimezoneFormatter,
} from "../../../utils";

import StartMeetingsForm from "../../../components/Form/User/StartMeetingsForm/index.form";
import UnregisterTranslation from "../UnregisterTranslation/index.page";

function AboutUs() {
  const [startMeetingModal, setStartMeetingModal] = useState(false);
  const [startMeetingloading, setStartMeetingLoading] = useState(false);
  const [basicActiveTranslation, setBasicActiveTranslation] = useState({});
  const handleStartMeetingModalShow = () => setStartMeetingModal(true);

  const handleStartMeetingModalClose = () => setStartMeetingModal(false);
  const [startTranslaionModal, setStartTranslationModal] = useState(false);
  // const [startMeetingloading, setStartMeetingLoading] = useState(false);
  const handleStartTranslationModalShow = () => setStartTranslationModal(true);

  const handleStartTranslationModalClose = () =>
    setStartTranslationModal(false);

  useEffect(() => {
    setTimeout(() => {
      let navbar = document.querySelector(".navbar").clientHeight;
      let sliderNav = document.querySelector(".sliderNav ").clientHeight;
      let banner = document.querySelectorAll(".bannerSec_txt");
      banner.forEach((element) => {
        element.style.paddingTop = `${navbar}px`;
        element.style.paddingBottom = `${sliderNav + 50}px`;
      });
    }, 300);
  });
  const startMeetingsSubmit = async (value) => {
    setStartMeetingLoading(true);
    try {
      let bodyData = {
        start_date: dateFormatter(new Date(), "YYYY-MM-DD"),
        start_time: dateFormatter(new Date(), "HH:mm"),
        isStartNow: true,
        ...value,
      };

      let date = `${bodyData?.start_date} ${bodyData?.start_time}`;
      bodyData.start_date = momentTimezoneFormatter(new Date(date))
        .utc()
        .format();
      bodyData.seleted_time = date;
      delete bodyData.start_time;

      bodyData.is_corporate = 0;
      // bodyData.corporate_id = activeAccount?.id;
      let res = await UserHomeServices.unRegisterUseAddMeetingService(bodyData);
      const { success, message, data } = res;
      if (success === 1) {
        modalNotification({
          type: "success",
          message,
        });
        if (data?.id) {
          window.open(
            baseUrlGenerator(
              `${userRoutesMap.UNREGISTER_JITSI_MEET.path}/${encoder(data?.id)}`
            )
          );
        }

        setStartMeetingModal(false);
      } else {
        modalNotification({
          type: "error",
          message,
        });
      }

      // handleStartMeetingModalClose();
    } catch (error) {
      logger(error);
    }
    setStartMeetingLoading(false);
  };
  const getSubscriptionBaseList = async () => {
    try {
      const res = await UserHomeServices.unRegisterUserSubscriptionService();
      const { success, data, message } = res;
      if (success === 1) {
        setBasicActiveTranslation(data);
      } else {
        modalNotification({
          type: "error",
          message,
        });
      }
    } catch (error) {
      logger(error);
    }
  };
  useEffect(() => {
    getSubscriptionBaseList();
  }, []);

  return (
    <>
      <div className="homePage aboutUsPage">
        <section className="featuresSection py-70 pb-0">
          <Container>
            <Row className="gy-3">
              <Col md={6}>
                <div className="communicateBox communicateBox-audioVideo">
                  <div className="communicateBox_cnt">
                    <h2>Audio/Video Conference</h2>
                    <p>
                      Enjoy high quality audio/video meetings on Secure, Simple
                      and Reliable platform powered by Daakia.
                    </p>
                    <RippleEffect>
                      <CommonButton
                        variant="primary"
                        onClick={() => handleStartMeetingModalShow()}
                      >
                        Try Now
                      </CommonButton>
                    </RippleEffect>
                  </div>
                </div>
              </Col>
              <Col md={6}>
                <div className="communicateBox communicateBox-translation">
                  <div className="communicateBox_cnt">
                    <h2>Translation</h2>
                    <p>
                      Use our AI-powered translation engine to translate text or
                      documents with high accuracy.
                    </p>
                    <RippleEffect>
                      <CommonButton
                        variant="primary"
                        onClick={() => handleStartTranslationModalShow()}
                      >
                        Try Now
                      </CommonButton>
                    </RippleEffect>
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
        </section>
        <section
          id="about"
          className="aboutSec d-flex justify-content-center flex-column position-relative py-70 overflow-hidden"
        >
          <Container className="align-items-center">
            <Row className="align-items-center">
              <Col md={6}>
                <div className="aboutSec_left">
                  <div className="heading mb-0">
                    <h3 className="heading_sub font-ad">About Us</h3>
                    <h1 className="heading_main">
                      An Integrated Social & Business Communication Platform
                    </h1>
                    <p className="mb-0">
                      Daakia is an All in One, first of its kind, Cross Platform
                      Mobile & Web Integrated Solution to make communications
                      easy and effective.
                    </p>
                    <p className="mb-0">
                      We offer Enterprise SaaS solution for intra organization
                      communication, video conference & translation platform.
                    </p>
                    <p className="mb-0">
                      Bring all your personal, social, business and professional
                      communications on Daakia and enjoy a more streamlined,
                      secured experience that makes seamless cross-language
                      communication possible. No more juggling between apps.{" "}
                    </p>
                    <p className="mb-0">
                      Be it at your home or on the go, at work or at school, in
                      a meeting or on a vacation. Be it with a business client
                      or with your loved ones, with your followers or with your
                      colleagues. Be it sharing a document or sharing an
                      emotion, sending a text or receiving directions, sharing
                      moments or sharing memories. Daakia is the platform for
                      all your needs through its Chat, Call, Conference &
                      Translation Solutions.{" "}
                    </p>
                    <p className="mb-0">
                      At Daakia, we aim to build our very own “Digital
                      Ecosystem” comprising various user centric platforms which
                      will empower people and organizations to effectively
                      collaborate and manage their data needs on the go, thereby
                      promoting digital equality and bridging the digital
                      divide.{" "}
                    </p>
                    {/* <p className="mb-0">A one stop solution to make collaboration and communication easy & effective: be it at office, home or on the go. Bring your  work, classroom, webinar together on Daakia and enjoy a more streamlined, secured experience that makes seamless cross-language communication possible.</p>
                                    <p className="mb-0">At Daakia, we aim to build our very own <b> “Digital Ecosystem” </b> comprising various citizen centric platforms which will empower users and organizations to effectively collaborate and manage their data needs on the go, thereby promoting digital sovereignty. </p> */}
                  </div>
                </div>
              </Col>
              <Col md={6}>
                <div className="aboutSec_right">
                  <ImageElement
                    source="about-img.png"
                    alt="about-img"
                    className="img-fluid"
                  />
                </div>
              </Col>
            </Row>
          </Container>
        </section>
      </div>
      <ModalComponent
        show={startMeetingModal}
        modalExtraClass="noHeader"
        onHandleVisible={handleStartMeetingModalShow}
        onHandleCancel={handleStartMeetingModalClose}
        title=""
        size="md"
      >
        <StartMeetingsForm
          onSubmit={startMeetingsSubmit}
          handleStartMeetingModalClose={handleStartMeetingModalClose}
          startMeetingloading={startMeetingloading}
        />
      </ModalComponent>
      <ModalComponent
        show={startTranslaionModal}
        modalExtraClass="noHeader translationModal"
        onHandleVisible={handleStartTranslationModalShow}
        onHandleCancel={handleStartTranslationModalClose}
        title=""
        size="xl"
      >
        <UnregisterTranslation
          basicActiveTranslation={basicActiveTranslation}
        />
      </ModalComponent>
    </>
  );
}

export default AboutUs;

import React, { useEffect, useState } from "react";
import { Container, Row, Col, ListGroup } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { t } from "i18next";
import { logger, makeValidLink, modalNotification } from "../../../utils";

import { UserSubscribeForm } from "../../Form";
import { CommonButton, RippleEffect } from "../index";
// import { Link } from "react-router-dom";
// import { getFooterLink } from "../../../utils";
import ImageElement from "../ImageElement";
import userRoutesMap from "../../../routeControl/userRoutes";
import { CommonServices, FooterServices } from "../../../services";
import config from "../../../config";

function Footer() {
  // const FooterData = getFooterLink(routes);
  const location = useLocation();
  const navigate = useNavigate();
  const { pathname } = location;
  let path = pathname.replace("/", "");
  path = path === "" ? "home" : path;
  const [loading, setLoading] = useState(false);
  const [socialLinkData, setSocialLinkData] = useState({});

  useEffect(() => {
    const mainCnt = document.querySelector(".mainContent");
    const footer = document.querySelector(".footerSec");
    if (
      [
        "contact-us",
        "home",
        "privacy-policy",
        "end-user-agreement",
        "faq",
        "cookies-policy",
      ].includes(path)
    ) {
      mainCnt?.classList.add("downloadSecComing");
      footer?.classList.add("pt-160");
    } else {
      mainCnt?.classList.remove("downloadSecComing");
      footer?.classList.remove("pt-160");
    }
  });
  const onSubmit = async (values, resetForm) => {
    setLoading(true);
    try {
      let bodyData = { ...values };
      const res = await CommonServices.userSubscribe(bodyData);
      const { success, message } = res;
      if (success === 1) {
        resetForm();
        modalNotification({
          type: "success",
          message,
        });
      } else {
        modalNotification({
          type: "error",
          message,
        });
      }
    } catch (error) {
      logger(error);
    }
    setLoading(false);
  };
  const getSocialLink = async () => {
    try {
      const res = await FooterServices.getSocialService();
      const { success, message, data } = res;
      if (success === 1) {
        setSocialLinkData(data);
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
    getSocialLink();
  }, []);
  const socialLinks = [
    {
      url: socialLinkData?.facebook,
      icon: "facebook",
    },
    {
      url: socialLinkData?.twitter,
      icon: "twitter",
    },
    {
      url: socialLinkData?.linkedin,
      icon: "linkdin",
    },

    {
      url: socialLinkData?.instagram,
      icon: "instagram",
    },
  ];

  return (
    <>
      <footer className="footerSec position-relative">
        {[
          "contact-us",
          "home",
          "privacy-policy",
          "end-user-agreement",
          "faq",
          "cookies-policy",
        ].includes(path) ? (
          <Container className="downloadSec">
            <Row className="align-items-center g-0">
              <Col
                sm="4"
                lg="5"
                className="downloadSec_imgBox position-absolute d-none d-lg-block"
              >
                <picture>
                  <source
                    type="image/webp"
                    srcSet="assets/images/frontend/app-screen.webp"
                    alt="app-screen"
                  />
                  <ImageElement
                    source="app-screen.png"
                    alt="app-screen"
                    className="img-fluid me-0"
                  />
                </picture>
              </Col>
              <Col sm="12" lg="7" className="downloadSec_info ms-auto">
                {/* <h2 className="mb-2"> Download App</h2> */}
                <h3 className="mb-1"> {t("text.userFooter.downloadTheApp")}</h3>
                <p className="mb-3">{t("text.userFooter.availableOnPlay")} </p>
                <div className="d-flex justify-content-center justify-content-lg-start">
                  <a
                    className="me-3"
                    href={config.IOS_APP_URL}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <img
                      className="img-fluid me-0"
                      src="../assets/images/frontend/app-store.png"
                      alt="app-store"
                    />
                  </a>
                  <a
                    href={config.PLAY_STORE_URL}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <img
                      className="img-fluid me-0"
                      src="../assets/images/frontend/play-store.png"
                      alt="play-store"
                    />
                  </a>
                </div>
              </Col>
            </Row>
          </Container>
        ) : (
          <></>
        )}

        <Container>
          <Row>
            <Col sm="12" lg="4">
              <div className="footerItem d-flex align-items-start">
                <img
                  className="img-fluid logo-img"
                  src="../assets/images/frontend/footer-logo.png"
                  alt="footer-logo"
                />
                <div className="info info-about">
                  <h2>{t("text.userFooter.aboutDaakia")}</h2>
                  <p>{t("text.userFooter.subTextAbout")}</p>

                  <ListGroup as="ul" className="bg-transparent" horizontal>
                    {socialLinks?.length > 0 &&
                      socialLinks?.map((item, key) => {
                        return (
                          <ListGroup.Item as="li" className="p-0" key={key}>
                            <a
                              href={makeValidLink(item)}
                              target="_blank"
                              rel="noreferrer"
                              aria-label="social"
                            >
                              <em className={`icon-${item?.icon}`} />
                            </a>
                          </ListGroup.Item>
                        );
                      })}
                    {/* <ListGroup.Item as="li" className="p-0">
                      <a
                        href={socialLinkData?.facebook}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {" "}
                        <em className="icon-facebook" />
                      </a>
                    </ListGroup.Item>
                    <ListGroup.Item as="li" className="p-0">
                      <a href="javascript:void(0)">
                        {" "}
                        <em className="icon-twitter" />
                      </a>
                    </ListGroup.Item>
                    <ListGroup.Item as="li" className="p-0">
                      <a href="javascript:void(0)">
                        {" "}
                        <em className="icon-linkdin" />
                      </a>
                    </ListGroup.Item>
                    <ListGroup.Item as="li" className="p-0">
                      <a href="javascript:void(0)">
                        {" "}
                        <em className="icon-instagram" />
                      </a>
                    </ListGroup.Item> */}
                  </ListGroup>
                </div>
              </div>
            </Col>
            <Col md="6" lg="4">
              <div className="info info-form ms-lg-auto">
                <h2>{t("text.userFooter.stayUpToDate")}</h2>
                <UserSubscribeForm onSubmit={onSubmit} loading={loading} />
                {/* <div className="form-group">
                  <TextInput
                    className="form-control"
                    placeholder="Enter Email"
                    type="email"
                  />
                  <CommonButton variant="light" className="rounded-pill">
                    Subscribe
                  </CommonButton>
                </div> */}
              </div>
            </Col>
            <Col md="6" lg="4">
              <div className="info info-getinTouch">
                <h2>{t("text.userFooter.haveAQuestion")}</h2>
                <p>{t("text.userFooter.loveToHear")}</p>
                <RippleEffect>
                  <CommonButton
                    variant="primary"
                    onClick={() => {
                      navigate(userRoutesMap.USER_CONTACT_US.path);
                    }}
                  >
                    {t("text.userFooter.getInTouch")}
                  </CommonButton>
                </RippleEffect>
              </div>
            </Col>
          </Row>
          <Row className="align-items-center copyRight justify-content-between">
            <Col md="6">
              <p className="mb-0">{t("text.userFooter.rightsReserved")}</p>
            </Col>
            <Col md="6">
              <ListGroup
                as="ul"
                className="bg-transparent  justify-content-center justify-content-md-end"
                horizontal
              >
                <ListGroup.Item as="li" className="p-0">
                  <Link to={userRoutesMap.PRIVACY_POLICY.path}>
                    {" "}
                    {t("text.privacyPolicy.pageTitle")}{" "}
                  </Link>
                </ListGroup.Item>
                <ListGroup.Item as="li" className="p-0">
                  <Link to={userRoutesMap.COOKIES_POLICY.path}>
                    {" "}
                    {t("text.cookiesPolicy.pageTitle")}{" "}
                  </Link>
                </ListGroup.Item>
                <ListGroup.Item as="li" className="p-0">
                  <Link to={userRoutesMap.END_USER_AGREEMENT.path}>
                    {" "}
                    {t("text.termsAndCondition.pageTitle")}
                  </Link>
                </ListGroup.Item>
                <ListGroup.Item as="li" className="p-0">
                  <Link to={userRoutesMap.FAQS.path}>
                    {" "}
                    {t("text.faqs.pageTitle")}
                  </Link>
                </ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>
        </Container>
      </footer>
    </>
  );
}

export default Footer;

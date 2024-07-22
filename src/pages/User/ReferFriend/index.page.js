import { t } from "i18next";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Col, Container, Form, InputGroup, Row } from "react-bootstrap";
import {
  EmailIcon,
  EmailShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from "react-share";
import { useSelector } from "react-redux";
import { CommonButton, ImageElement } from "../../../components";
import userRoutesMap from "../../../routeControl/userRoutes";

import { selectProfileData } from "../../../redux/UserSlice/index.slice";
import { baseUrlGenerator, logger, modalNotification } from "../../../utils";
import { AdminReferralsServices } from "../../../services";
import {
  FacebookShareButton,
  LinkedInShareButton,
  TwitterShareButton,
} from "./socialMediaShare.js/FacebookShareButton";

function ReferFriend() {
  let userData = useSelector(selectProfileData);
  const [referData, setReferData] = useState({});
  const getReferralDetails = async () => {
    try {
      const res = await AdminReferralsServices.getReferralDetails();
      const { success, data, message } = res;
      if (success === 1) {
        setReferData(data);
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
    getReferralDetails();
  }, []);
  const referDescription = `Hey! Join me on Daakia, it’s a simple & secure platform for online meetings, chat and translation.
  Use my referral code ${userData?.UserProfile?.referral_code} or click the link below to get exclusive reward coins on sign up. Redeem the coins on your first purchase..

`;
  return (
    <>
      <section className="referPage py-70">
        <Container>
          <Row className="justify-content-center">
            <Col xxl={10}>
              <div className="d-flex align-items-center flex-wrap justify-content-between">
                <h1 className="backheading mb-0 me-1 font-eb">
                  <Link to={userRoutesMap.USER_DASHBOARD.path}>
                    <em className="icon-arrow-back" />
                  </Link>
                  <span> {t("text.referFriend.referfriend")}</span>
                </h1>
                <Link
                  to={userRoutesMap.REFERRAL_REWARDS.path}
                  className="btn btn-primary"
                >
                  {t("text.referFriend.referralTrackingDashboard")}
                </Link>
              </div>

              <div className="referPage_borderBox text-center">
                <div className="referPage_borderBoxTop">
                  <div className="referPage_borderBoxTop-content mx-auto">
                    <h2>
                      {t("text.referFriend.referfriend")}{" "}
                      {t("text.userLogin.and")} <span>win reward coins</span>
                    </h2>
                    <p> {t("text.referFriend.coin1")}</p>
                    <InputGroup>
                      <Form.Control
                        value={userData?.UserProfile?.referral_code}
                        readOnly
                      />
                      <CommonButton
                        variant="btn btn-primary"
                        onClick={() => {
                          window.navigator.clipboard.writeText(
                            `${referDescription} ${baseUrlGenerator(
                              userRoutesMap.SIGNUP.path
                            )}?id=${userData?.UserProfile?.referral_code}`
                          );
                          modalNotification({
                            type: "success",
                            message: t("text.referFriend.copiedCode"),
                          });
                        }}
                      >
                        <em className="icon-copy-past me-2" />
                        {t("text.referFriend.copyCode")}
                      </CommonButton>
                    </InputGroup>
                    <div className="shareBox">
                      <p> {t("text.referFriend.inviteFriends")}</p>
                      <ul className="list-unstyled d-flex flex-wrap justify-content-center">
                        <FacebookShareButton
                          url={`${baseUrlGenerator(
                            userRoutesMap.SIGNUP.path
                          )}?id=${userData?.UserProfile?.referral_code}`}
                          hashtag={`#${userData?.UserProfile?.referral_code}`}
                          quote={`Hey, ${userData?.UserProfile?.full_name} has invited you to check out Daakia. Use this invite code ${userData?.UserProfile?.referral_code} to sign up and get extra ${referData?.signup_reward} coins`}
                        />

                        <TwitterShareButton
                          url={`${baseUrlGenerator(
                            userRoutesMap.SIGNUP.path
                          )}?id=${userData?.UserProfile?.referral_code}`}
                          hashtag={`${userData?.UserProfile?.referral_code}`}
                          quote={referDescription}
                        />

                        <LinkedInShareButton
                          hashtag={`#${userData?.UserProfile?.referral_code}`}
                          quote={referDescription}
                          url={`${baseUrlGenerator(
                            userRoutesMap.SIGNUP.path
                          )}?id=${userData?.UserProfile?.referral_code}`}
                          referral={userData?.UserProfile?.referral_code}
                        />

                        <WhatsappShareButton
                          url={`${baseUrlGenerator(
                            userRoutesMap.SIGNUP.path
                          )}?id=${userData?.UserProfile?.referral_code}`}
                          title={referDescription}
                          className="wt"
                        >
                          <WhatsappIcon size="35" round />
                        </WhatsappShareButton>
                        <EmailShareButton
                          url={`${baseUrlGenerator(
                            userRoutesMap.SIGNUP.path
                          )}?id=${userData?.UserProfile?.referral_code}`}
                          title="title"
                          body={referDescription}
                          className="em"
                        >
                          <EmailIcon size="35" round />{" "}
                        </EmailShareButton>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="referPage_borderBoxBottom">
                  <h2>{t("text.referFriend.howItWorks")}</h2>
                  <div className="d-flex flex-wrap referPage_borderBoxBottom_row">
                    <Col className="itemsBox" sm={6} md={4}>
                      <ImageElement source="contact.svg" />
                      <h3>{t("text.referFriend.shareLink")}</h3>
                      <p>{t("text.referFriend.shareDetails")}</p>
                    </Col>
                    <Col className="itemsBox" sm={6} md={4}>
                      <ImageElement source="referrel-link.svg" />
                      <h3>{t("text.referFriend.yourContacts")}</h3>
                      <p>{t("text.referFriend.contactDetails")}</p>
                    </Col>
                    <Col className="itemsBox" sm={6} md={4}>
                      <ImageElement source="reward.svg" />
                      <h3> {t("text.referFriend.rewardUser")}</h3>
                      <p>
                        On successful registration by your referee, we credit{" "}
                        {referData?.signup_reward} coins to both of you. On
                        first purchase by your referee, we credit additional{" "}
                        {referData?.purchase_reward} coins to you
                      </p>
                    </Col>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
}

export default ReferFriend;

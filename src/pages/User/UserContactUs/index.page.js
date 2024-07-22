import { t } from "i18next";
import React, { useState, useEffect, useRef } from "react";

import { Container, Row, Col } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { UserContactUsForm } from "../../../components";
import { selectUserData } from "../../../redux/AuthSlice/index.slice";
import {
  selectCountryData,
  selectProfileData,
} from "../../../redux/UserSlice/index.slice";
import userRoutesMap from "../../../routeControl/userRoutes";
import { UserContactUsService } from "../../../services";
import { logger, modalNotification } from "../../../utils";

function UserContactUs() {
  const countryList = useSelector(selectCountryData);
  const [loading, setLoading] = useState(false);
  const [contactReasonData, setContactReasonData] = useState([]);
  const formRef = useRef(null);
  let userData = useSelector(selectUserData);
  let profileData = useSelector(selectProfileData);

  const onSubmit = async (value, resetForm) => {
    setLoading(true);
    try {
      let bodyData = {};
      if (userData?.jwt) {
        // bodyData = {
        //   description: value.description,
        //   conatct_type_id: value.conatct_type_id,
        // };
        bodyData = { ...value };
        bodyData.username = userData?.username;
        bodyData.country_id = profileData?.UserProfile?.Country?.id;
        bodyData.full_name = profileData?.UserProfile?.full_name;
        // bodyData.last_name = profileData?.last_name;
        bodyData.country_code = profileData?.UserProfile?.mobile_country_code;
        bodyData.user_id = profileData?.UserProfile?.user_id;
        bodyData.phone_number = profileData?.UserProfile?.mobile_no;
        bodyData.userType = "registered";
        delete bodyData.first_name;
        delete bodyData.last_name;
      } else {
        bodyData = { ...value };
        bodyData.full_name = `${value.first_name} ${value.last_name}`;
        delete bodyData.first_name;
        delete bodyData.last_name;
        bodyData.username = "guest";
        bodyData.userType = "unregistered";
      }
      const response = await UserContactUsService.userContactUsService(
        bodyData
      );
      const { success, message } = response;

      if (success === 1) {
        modalNotification({
          type: "success",
          message,
        });
        resetForm();
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
  const getContactUsReason = async () => {
    const queryParams = { status: "active" };
    try {
      const response = await UserContactUsService.userGetContactReasonService({
        queryParams,
      });
      const { success, data, message } = response;

      if (success === 1) {
        setContactReasonData(data?.documentData?.rows);
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
    getContactUsReason();
  }, []);

  return (
    <>
      <section className="contactPage py-70 pb-3 pb-xxl-5">
        <Container>
          <h3 className="backheading font-eb">
            <Link
              to={
                userData?.jwt
                  ? userRoutesMap.USER_DASHBOARD.path
                  : userRoutesMap.HOME.path
              }
            >
              <em className="icon-arrow-back" />
            </Link>
          </h3>
          <Row>
            <Col sm="12">
              <div className="text-center heading mx-auto">
                <h3 className="heading_sub font-ad">
                  {" "}
                  {t("text.userContactUs.title")}
                </h3>
                <h1 className="heading_main">
                  {t("text.userContactUs.queries")}
                </h1>
                <p className="mb-0">
                  {t("text.userContactUs.teamDescription")}
                </p>
              </div>
            </Col>
            <Col md="5" xxl="4" className="mb-3 mb-md-0">
              <div className="contactPage_left">
                <h3 className="text-white">
                  {t("text.userContactUs.contactInfo")}
                </h3>
                <h4 className="text-white">
                  {t("text.userContactUs.anyQueries")}
                </h4>
                <ul className="list-unstyled contactInfo">
                  <li className="d-flex">
                    <em className="icon icon-phone-filled" />
                    <div>
                      <h6>{t("text.userContactUs.contactNumber")}</h6>
                      <p className="text-white mb-0">
                        +91 9019537499 / +91 9654056369
                      </p>
                    </div>
                  </li>
                  <li className="d-flex">
                    <em className="icon icon-mail-filled" />
                    <div>
                      <h6>{t("text.userContactUs.supportInquiries")}</h6>
                      <p className="text-white mb-0">
                        <a
                          className="text-white"
                          href="mailto:contact@daakia.co.in"
                        >
                          contact@daakia.co.in
                        </a>
                      </p>
                    </div>
                  </li>
                  <li className="d-flex">
                    <em className="icon icon-location-filled" />
                    <div>
                      <h6>{t("text.userContactUs.ourHQ")}</h6>
                      <p className="text-white mb-0">
                        Daakia Private Limited <br />
                        B18/8, Karunamoyee Housing Estate,
                        <br className="d-none d-md-block" />
                        Sector II, Salt Lake, Kolkata - 700091
                        <br className="d-none d-md-block" />
                        West Bengal, India
                      </p>
                    </div>
                  </li>
                </ul>
                <h4 className="text-450">
                  {t("text.userContactUs.lookingFor")}{" "}
                  <br className="d-none d-md-block" />
                  {t("text.userContactUs.pricing")}
                </h4>
                <ul className="list-unstyled contactInfo mb-0">
                  <li className="d-flex">
                    <em className="icon icon-mail-filled" />
                    <div>
                      <h6>{t("text.userContactUs.salesInquiries")}</h6>
                      <p className="text-white mb-0">
                        <a
                          className="text-white"
                          href="mailto:info@daakia.co.in"
                        >
                          info@daakia.co.in
                        </a>
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            </Col>
            <Col md="7" xxl="8" className="contactPage_right">
              <UserContactUsForm
                onSubmit={onSubmit}
                loading={loading}
                contactReasonData={contactReasonData}
                userData={userData}
                profileData={profileData}
                // countryLoader={countryLoader}
                formRef={formRef}
                countryList={countryList}
              />
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
}

export default UserContactUs;

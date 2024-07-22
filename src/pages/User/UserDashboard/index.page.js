import { t } from "i18next";
import React, { useEffect, useState } from "react";
import { Container, Col, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import {
  CommonButton,
  ImageElement,
  ModalComponent,
  // nameFormatter,
  RippleEffect,
  UserBusinessForm,
  textFormatter,
} from "../../../components";
import {
  getProfile,
  getUserAccount,
  getUserSubscription,
  selectCountryData,
  selectProfileData,
  selectSubscriptionData,
  selectUserAccountData,
  updateUserAccount,
} from "../../../redux/UserSlice/index.slice";
import userRoutesMap from "../../../routeControl/userRoutes";
import {
  decodeQueryData,
  decoder,
  getActiveAccount,
  getCurrentActiveSubscription,
  getIscorporateActive,
  logger,
  modalNotification,
} from "../../../utils";
import { UserProfileServices } from "../../../services";

function UserDashboard() {
  const userData = useSelector(selectProfileData);
  const account = useSelector(selectUserAccountData);
  const dispatch = useDispatch();
  const location = useLocation();

  const { search } = location;
  const name = userData?.UserProfile?.full_name?.split(" ");
  const userActiveSubscriptions = useSelector(selectSubscriptionData);
  const [enableConfrencing, setEnableConfrencing] = useState(false);
  const navigate = useNavigate();
  const [enableTranslation, setEnableTranslation] = useState(false);
  const [prevAccount, setPrevAccount] = useState({
    account,
    userActiveSubscriptions,
  });
  const [businessLoader, setBusinessLoader] = useState(false);
  const [businessAccount, setBusinessAccount] = useState(false);
  const countryList = useSelector(selectCountryData);
  const createBusinessAccount = () => setBusinessAccount(true);
  const handleClose = () => setBusinessAccount(false);
  const videoSubscription = getCurrentActiveSubscription(
    userActiveSubscriptions,
    "videoConferencing",
    true
  );
  const translationSubscription = getCurrentActiveSubscription(
    userActiveSubscriptions,
    "translation",
    true
  );
  const checkEnable = () => {
    setEnableConfrencing(
      !!videoSubscription?.id && videoSubscription?.status === "active"
    );
    setEnableTranslation(
      !!translationSubscription?.id &&
        translationSubscription?.status === "active"
    );
  };
  const handleId = async () => {
    const data = decodeQueryData(search);
    const responseAccount = await UserProfileServices.getAccountService();
    let checkId = responseAccount?.data?.some(
      (item) => item?.id === Number(decoder(data?.id))
    );

    if (data?.id && checkId) {
      dispatch(updateUserAccount({ id: decoder(data?.id) }));
    }
  };
  useEffect(() => {
    if (search) {
      handleId();
    }
  }, [location]);

  useEffect(() => {
    checkEnable();
  }, [userActiveSubscriptions]);

  useEffect(() => {
    const activeAccount = getActiveAccount(account);
    let queryParams = {
      is_corporate: getIscorporateActive(account),
      corporate_id: activeAccount?.id,
    };
    setPrevAccount({ account, userActiveSubscriptions });
    dispatch(getUserSubscription({ queryParams }));
  }, [JSON.stringify(prevAccount?.account) !== JSON.stringify(account)]);
  const onBusinessSubmit = async (val) => {
    setBusinessLoader(true);
    try {
      let bodyData = { ...val };
      delete bodyData.isGST;
      const response = await UserProfileServices.addBusinessAccountService(
        bodyData
      );
      const { success, message } = response;
      if (success === 1) {
        modalNotification({
          type: "success",
          message,
        });

        setBusinessAccount(false);
        dispatch(getProfile());
        dispatch(getUserAccount());
      } else {
        modalNotification({
          type: "error",
          message,
        });
      }
    } catch (error) {
      logger(error);
    }
    setBusinessLoader(false);
  };
  return (
    <>
      <div className="dashBoardPage py-70 pt-0">
        <Container>
          <section className="dashBoard">
            <div className="dashBoard_inner">
              <div className="dashBoard_heading row gy-2 align-items-center justify-content-between">
                <div className="col-auto">
                  <h1 className="mb-1 font-bd">
                    {" "}
                    {t("text.videoConferencing.hello")}{" "}
                    {textFormatter(name?.[0])} !
                    {/* {nameFormatter(
                        textFormatter(userData?.first_name),
                        textFormatter(userData?.last_name)
                    )} */}
                  </h1>
                  <p className="font-sb mb-0">
                    {" "}
                    {t("text.videoConferencing.whatWould")}
                  </p>
                </div>
                {!userData?.UserBusinessAccount && (
                  <RippleEffect extraClassName="col-auto">
                    <CommonButton
                      variant="primary"
                      onClick={() => createBusinessAccount()}
                    >
                      {t("text.userProfile.createBusinessAccount")}
                    </CommonButton>
                  </RippleEffect>
                )}
                {/* <RippleEffect extraClassName="col-auto">
                  {" "}
                  <CommonButton
                    variant="primary"
                    onClick={() => navigate(userRoutesMap.REFER_FRIEND.path)}
                  >
                    Refer and Earn
                  </CommonButton>
                </RippleEffect> */}
              </div>
              <Row>
                <Col sm="6" lg="4">
                  <div className="servicesBox customCard text-center h-100 d-flex flex-column justify-content-between align-items-center">
                    <div>
                      <ImageElement
                        source="video-conferencing.svg"
                        alt="video-conferencing"
                      />
                      <h4 className="font-bd">
                        {t("text.manageSubscription.audioVideoconferencing")}
                      </h4>
                      <p>{t("text.videoConferencing.subTextConferencing")}</p>
                    </div>
                    <RippleEffect>
                      <CommonButton
                        className="btn btn-primary min-175"
                        disabled={!enableConfrencing}
                        onClick={() => {
                          navigate(userRoutesMap.VIDEO_CONFERENCING.path);
                        }}
                      >
                        {t("text.dashboard.startNow")}
                      </CommonButton>
                    </RippleEffect>
                  </div>
                </Col>
                <Col sm="6" lg="4" className="mt-3 mt-sm-0">
                  <div className="servicesBox customCard text-center h-100 d-flex flex-column justify-content-between align-items-center">
                    <div>
                      <ImageElement
                        source="translation.svg"
                        alt="translation"
                      />
                      <h4 className="font-bd">
                        {t("text.manageSubscription.translation")}
                      </h4>
                      <p>{t("text.videoConferencing.subTextTranslation")}</p>
                    </div>
                    <RippleEffect>
                      <CommonButton
                        className="btn btn-primary min-175"
                        disabled={!enableTranslation}
                        onClick={() => {
                          navigate(userRoutesMap.TRANSLATION.path);
                        }}
                      >
                        {t("text.dashboard.startNow")}
                      </CommonButton>
                    </RippleEffect>
                  </div>
                </Col>
                <Col sm="12" lg="4" className="mt-3 mt-lg-0">
                  <div className="servicesBox customCard text-center h-100 d-flex flex-column justify-content-between align-items-center">
                    <div>
                      <ImageElement source="webdaak.svg" alt="webdaak" />
                      <h4 className="font-bd mb-0">
                        {t("text.dashboard.webDaak")}{" "}
                      </h4>
                      <h2 className="font-bd mb-0 text-uppercase">
                        Coming <br /> soon!
                      </h2>
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
          </section>
        </Container>
      </div>
      <ModalComponent
        show={businessAccount}
        modalExtraClass="noHeader"
        onHandleVisible={createBusinessAccount}
        onHandleCancel={handleClose}
        title=""
        size="lg"
      >
        <div className="modalHeader">
          <h3> {t("text.userProfile.createBusinessAccount")}</h3>
        </div>
        <UserBusinessForm
          onSubmit={onBusinessSubmit}
          loading={businessLoader}
          countryList={countryList}
          handleClose={handleClose}
        />
      </ModalComponent>
    </>
  );
}

export default UserDashboard;

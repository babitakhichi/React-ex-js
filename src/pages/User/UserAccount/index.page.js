import { Formik } from "formik";
import { t } from "i18next";
import React, { useEffect, useState, useRef } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Media } from "../../../apiEndPoints";
import {
  AddEmailForm,
  ChangeEmailForm,
  // AntSelect,
  CommonButton,
  ImageElement,
  ModalComponent,
  RippleEffect,
  UploadInput,
  UserAccountForm,
  VerificationForm,
  Input as TextInput,
  checkValidCount,
  AntTooltip,
  UserBusinessForm,
} from "../../../components";
import config from "../../../config";
import { selectUserData } from "../../../redux/AuthSlice/index.slice";
import {
  getProfile,
  getUserAccount,
  selectCountryData,
  selectLanguageData,
  selectProfileData,
  selectStateData,
  updateProfile,
} from "../../../redux/UserSlice/index.slice";
import userRoutesMap from "../../../routeControl/userRoutes";
import {
  CommonServices,
  // CommonServices,
  UserAuthServices,
  UserProfileServices,
} from "../../../services";
import {
  // allCountryData,
  dateFormatter,
  logger,
  modalNotification,
} from "../../../utils";

let timer;
function UserAccount() {
  const [editLoading, setEditLoading] = useState(false);
  const languageDetails = useSelector(selectLanguageData);
  const stateList = useSelector(selectStateData);
  const [isEdit, setIsEdit] = useState(false);
  const [genderList, setGenderList] = useState([]);
  const [businessAccount, setBusinessAccount] = useState(false);

  const createBusinessAccount = () => setBusinessAccount(true);
  const formRef = useRef(null);
  let dispatch = useDispatch();
  // const [languageDetails, setLanguageDetails] = useState([]);

  const [otp, setOtp] = useState({
    input1: "",
    input2: "",
    input3: "",
    input4: "",
    input5: "",
    input6: "",
  });
  let userData = useSelector(selectUserData);
  let profileData = useSelector(selectProfileData);

  const getGenderList = async () => {
    try {
      let res = await CommonServices.genderList();
      const { data, success, message } = res;
      if (success === 1) {
        setGenderList(data?.rows);
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
    getGenderList();
    dispatch(getProfile());
  }, []);

  const onSubmitEditProfile = async (values) => {
    setEditLoading(true);
    try {
      let bodyData = { ...values };
      delete bodyData.isGST;
      bodyData.full_name = `${values?.first_name} ${values?.last_name}`;
      delete bodyData.first_name;
      delete bodyData.last_name;
      bodyData.dob = dateFormatter(values?.dob, "YYYY-MM-DD");
      bodyData.username = userData.username;
      if (!profileData?.UserBusinessAccount) {
        bodyData.type = "profile";
        delete bodyData.organization_name;
        delete bodyData.gst_number;
        delete bodyData.address;
        delete bodyData.city;
        delete bodyData.postal_code;
        delete bodyData.state;
        delete bodyData.business_country_id;
        delete bodyData.pan_number;
      }

      const response = await UserAuthServices.updateDetailService(bodyData);
      const { success, message, data } = response;
      if (success === 1) {
        modalNotification({
          type: "success",
          message,
        });
        setIsEdit(false);
        dispatch(updateProfile(data));
        if (data?.UserBusinessAccount) {
          dispatch(getUserAccount(data));
        }
      } else {
        modalNotification({
          type: "error",
          message,
        });
      }
    } catch (error) {
      logger(error);
    }
    setEditLoading(false);
  };
  // -------------------------------------------------email--------------------------------------
  const countryList = useSelector(selectCountryData);
  // const [emailShow, setEmailShow] = useState(false);
  const [changeEmailPhoneShow, setChangeEmailPhoneShow] = useState(false);
  const [addPhoneEmailShow, setMobileShow] = useState(false);
  const [otpShow, setOtpShow] = useState(false);
  // const [newEmailLoading, setNewEmailLoading] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  // const [addChange, setAddChange] = useState(false);
  const [addData, setAddData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  // const [changeEmail, setChangeEmail] = useState(false);
  // const [addEmail, setAddEmail] = useState(false);
  const [counter, setCounter] = useState(60);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [addChangeEmailPhoneCheck, setAddChangeEmailPhoneCheck] = useState({
    type: "",
    useFor: "",
  });
  const [callCounter, setCallCounter] = useState(false);
  const [changeEmailPhoneLoading, setChangeEmailPhoneLoading] = useState(false);

  const [businessLoader, setBusinessLoader] = useState(false);

  const handleClose = () => {
    // setEmailShow(false);
    setMobileShow(false);
    setOtpShow(false);
    setUpdateSuccess(false);
    setChangeEmailPhoneShow(false);
    setBusinessAccount(false);
    // setChangeEmail(false);
    setAddData({});
    setOtp({
      input1: "",
      input2: "",
      input3: "",
      input4: "",
      input5: "",
      input6: "",
    });
    setCounter(60);
    clearTimeout(timer);
  };
  useEffect(() => {
    if (counter > 0 && callCounter && otpShow) {
      timer = setTimeout(() => setCounter((c) => c - 1), 1000);
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [counter, callCounter, otpShow]);

  useEffect(() => {
    setCounter(60);
  }, [changeEmailPhoneShow, addPhoneEmailShow]);

  // const handleEmailShow = (check) => {
  //   if (check === "email") setChangeEmail(true);
  //   else setChangeEmail(false);
  //   setEmailShow(true);
  // };
  const handleChangeEmailPhoneShow = (check) => {
    setAddChangeEmailPhoneCheck({
      type: check,
      useFor: "change",
    });
    // if (check === "email") setChangeEmail(true);
    // else setChangeEmail(false);
    setChangeEmailPhoneShow(true);
  };
  const handleAddPhoneEmailShow = (check) => {
    setAddChangeEmailPhoneCheck({
      type: check,
      useFor: "add",
    });
    // if (check === "email") setAddEmail(true);
    // else setAddEmail(false);
    setMobileShow(true);
  };
  const handleOtpShow = () => {
    // if (check === "add") setAddChange(true);
    // else setAddChange(false);
    setOtpShow(true);
    setCallCounter(true);
  };
  const handleUpdateSuccessShow = () => setUpdateSuccess(true);

  const onSubmitChangePhoneEmail = async (value) => {
    setChangeEmailPhoneLoading(true);
    try {
      let bodyData = { typeCheck: value?.typeCheck };
      if (
        (addChangeEmailPhoneCheck?.type === "email" &&
          addChangeEmailPhoneCheck?.useFor === "change") ||
        value?.type === "email"
      ) {
        bodyData = { ...bodyData, type: "email", email: value?.email };
      } else {
        bodyData = {
          ...bodyData,
          type: "mobile",
          country_code: value?.country_code,
          phone_number: value?.phone_number,
        };
      }

      const response = await UserProfileServices.changeEmailPhoneService(
        bodyData
      );
      const { success, message } = response;
      if (success === 1) {
        modalNotification({
          type: "success",
          message,
        });
        setChangeEmailPhoneShow(false);
        setAddData(bodyData);
        handleOtpShow();
        // setCallCounter(true);
      } else {
        modalNotification({
          type: "error",
          message,
        });
      }
    } catch (error) {
      logger(error);
    }
    setChangeEmailPhoneLoading(false);
  };

  const onSubmitChangeEmailPhoneVerify = async (value, otpValue) => {
    setVerifyLoading(true);
    try {
      let setValue;
      let bodyData;
      if (value?.type === "email") {
        bodyData = {
          type: "email",
          email: value?.email,
          otp: otpValue,
        };
        setValue = { email: value?.email };
      } else {
        bodyData = {
          type: "mobile",
          country_code: `${value?.country_code}`,
          phone_number: value?.phone_number,
          otp: otpValue,
        };
        setValue = {
          country_code: value?.country_code,
          phone_number: value?.phone_number,
        };
      }

      const response = await UserProfileServices.verifyChangeEmailPhoneService(
        bodyData
      );
      const { success, message } = response;
      if (success === 1) {
        modalNotification({
          type: "success",
          message,
        });

        dispatch(
          updateProfile({
            ...profileData,
            ...setValue,
          })
        );
        dispatch(getProfile());
        handleClose();
      } else {
        modalNotification({
          type: "error",
          message,
        });
      }
    } catch (error) {
      logger(error);
    }
    setVerifyLoading(false);
  };

  const onAddEmailPhone = async (value) => {
    setAddLoading(true);
    try {
      let bodyData;
      if (
        addChangeEmailPhoneCheck?.type === "email" &&
        addChangeEmailPhoneCheck?.useFor === "add"
      ) {
        bodyData = { type: "email", email: value?.email };
      } else {
        bodyData = {
          type: "mobile",
          country_code: value?.country_code,
          phone_number: value?.phone_number,
        };
      }

      const response = await UserProfileServices.addEmailPhoneService(bodyData);
      const { success, message } = response;
      if (success === 1) {
        modalNotification({
          type: "success",
          message,
        });
        handleOtpShow();
        setAddData(bodyData);
        setMobileShow(false);
        // setCallCounter(true);
      } else {
        modalNotification({
          type: "error",
          message,
        });
      }
    } catch (error) {
      logger(error);
    }
    setAddLoading(false);
  };

  const onSubmitAddEmailPhoneVerify = async (value, otpValue) => {
    setVerifyLoading(true);
    try {
      let bodyData;
      let setValue;
      if (addChangeEmailPhoneCheck?.type === "email") {
        bodyData = { type: "email", email: value?.email, otp: otpValue };
        setValue = { email: value?.email };
      } else {
        bodyData = {
          type: "mobile",
          country_code: value?.country_code,
          phone_number: value?.phone_number,
          otp: otpValue,
        };
        setValue = {
          country_code: value?.country_code,
          phone_number: value?.phone_number,
        };
      }
      const response = await UserProfileServices.verifyAddEmailPhoneService(
        bodyData
      );
      const { success, message } = response;
      if (success === 1) {
        modalNotification({
          type: "success",
          message,
        });
        setOtpShow(false);
        setUpdateSuccess(true);
        setOtp({});
        dispatch(
          updateProfile({
            ...profileData,
            ...setValue,
          })
        );
        dispatch(getProfile());
      } else {
        modalNotification({
          type: "error",
          message,
        });
      }
    } catch (error) {
      logger(error);
    }
    setVerifyLoading(false);
  };
  const onVerificationSubmit = () => {
    let otpValue = "";
    for (let key in otp) {
      if (key) {
        otpValue += otp[key];
      }
    }
    if (otpValue && otpValue.length === 6) {
      if (addChangeEmailPhoneCheck?.useFor === "add") {
        onSubmitAddEmailPhoneVerify(addData, otpValue);
      } else {
        onSubmitChangeEmailPhoneVerify(addData, otpValue);
      }
    } else {
      modalNotification({
        type: "error",
        message: t("validation.common.validOtp"),
      });
    }
  };

  // const onVerificationSubmit = async () => {
  //   setVerifyLoading(true);
  //   if (addChange) {
  //     try {
  //       let otpValue = "";
  //       let bodyData;
  //       let setValue;
  //       for (let key in otp) {
  //         if (key) {
  //           otpValue += otp[key];
  //         }
  //       }
  //       if (otpValue && otpValue.length === 6) {
  //         if (addEmail) {
  //           bodyData = { type: "email", email: addData?.email, otp: otpValue };
  //           setValue = { email: addData?.email };
  //         } else {
  //           bodyData = {
  //             type: "mobile",
  //             country_code: addData?.country_code,
  //             phone_number: addData?.phone_number,
  //             otp: otpValue,
  //           };
  //           setValue = {
  //             country_code: addData?.country_code,
  //             phone_number: addData?.phone_number,
  //           };
  //         }
  //         const response = await UserProfileServices.verifyAddEmailPhoneService(
  //           bodyData
  //         );
  //         const { success, message } = response;
  //         if (success === 1) {
  //           modalNotification({
  //             type: "success",
  //             message,
  //           });
  //           setOtpShow(false);
  //           setUpdateSuccess(true);
  //           setOtp({});
  //           dispatch(
  //             updateProfile({
  //               ...profileData,
  //               ...setValue,
  //             })
  //           );
  //           dispatch(getProfile());
  //         } else {
  //           modalNotification({
  //             type: "error",
  //             message,
  //           });
  //         }
  //       } else {
  //         modalNotification({
  //           type: "error",
  //           message: t("validation.common.validOtp"),
  //         });
  //       }
  //     } catch (error) {
  //       logger(error);
  //     }
  //   } else {
  //     try {
  //       let otpValue = "";
  //       for (let key in otp) {
  //         if (key) {
  //           otpValue += otp[key];
  //         }
  //       }
  //       if (otpValue && otpValue.length === 6) {
  //         onSubmitChangeEmailPhoneVerify(addData, otpValue);
  //       } else {
  //         modalNotification({
  //           type: "error",
  //           message: t("validation.common.validOtp"),
  //         });
  //       }
  //     } catch (error) {
  //       logger(error);
  //     }
  //   }
  //   setVerifyLoading(false);
  // };
  const reSendOtp = async () => {
    try {
      let bodyData;

      if (
        addChangeEmailPhoneCheck?.type === "email" ||
        addData?.type === "email"
      ) {
        bodyData = { type: "email", email: addData?.email };
      } else {
        bodyData = {
          type: "mobile",
          country_code: addData?.country_code,
          phone_number: addData?.phone_number,
        };
      }

      const response = await UserProfileServices.resendOTPProfileService(
        bodyData
      );
      const { success, message } = response;
      if (success === 1) {
        modalNotification({
          type: "success",
          message,
        });
        setCounter(60);
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

  const initialValues = {
    image: "",
    phone_number: profileData?.UserProfile?.mobile_no || "",
    email: profileData?.UserProfile?.email || "",
    country_code: profileData?.UserProfile?.mobile_country_code || "",
  };

  const onVerifyClick = (verificationType) => {
    try {
      let bodyData = { type: verificationType, typeCheck: true };
      if (verificationType === "email") {
        bodyData.email = profileData?.UserProfile?.email;
      } else {
        bodyData.country_code = profileData?.UserProfile?.mobile_country_code;
        bodyData.phone_number = profileData?.UserProfile?.mobile_no;
      }
      onSubmitChangePhoneEmail(bodyData);
      // setAddData(bodyData);
      // handleOtpShow("change");
    } catch (error) {
      logger(error);
    }
  };

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
      <section className="profilePage">
        <Container>
          <div className="d-flex headTop justify-content-between">
            <h1 className="backheading font-eb">
              <Link to={userRoutesMap.USER_DASHBOARD.path}>
                <em className="icon-arrow-back" />
              </Link>

              {isEdit ? "Edit Profile" : "Profile"}
            </h1>
            {!profileData?.UserBusinessAccount && (
              <RippleEffect>
                <CommonButton
                  variant="btn btn-primary"
                  onClick={() => createBusinessAccount()}
                >
                  {t("text.userProfile.createBusinessAccount")}
                </CommonButton>
              </RippleEffect>
            )}
          </div>
          <Row>
            <Formik initialValues={{ ...initialValues }} enableReinitialize>
              {(props) => (
                <>
                  <Col md="3">
                    <div className="profileCard customCard d-flex align-items-center justify-content-center">
                      <div className="profileCard_imgAnt">
                        <UploadInput
                          apiEndPoints={Media.profileImage}
                          className="img-fluid"
                          name="image"
                          type="file"
                          defaultImageUrl={
                            profileData?.UserProfile?.profile_img_url_full ||
                            `${config.IMAGE_URL}/profile-img.jpg`
                          }
                          setFieldValue={props.handleChange}
                          disabled={!isEdit}
                        >
                          {isEdit && (
                            <label className="profileCard_upload">
                              {/* <input type="file" /> */}
                              <em className="icon-camera" />
                            </label>
                          )}
                        </UploadInput>
                      </div>
                    </div>
                    <div className="paymentBox rounded-1 bg-white paymentBox-coin position-relative mt-xxl-4 mt-lg-3 mt-2 mb-2 mb-lg-0">
                      <h5 className="font-bd mb-0 d-flex align-items-center">
                        <em className="icon-coin" />
                        {t("text.userPayment.coinAvailable")}
                      </h5>
                      <h6 className="font-bd mb-0">
                        {checkValidCount(profileData?.coin)}{" "}
                        <span>{t("text.userPayment.coins")}</span>
                      </h6>
                    </div>
                  </Col>
                  <Col md="9">
                    <div className="formBlock customCard mb-3">
                      {/* --------------------------------------------------------------------------email---------------------------------------------- */}
                      <Row>
                        {/* ------------------------ show email---------------------- */}
                        {profileData?.UserProfile?.email && (
                          <Col sm="6">
                            <div className="form-group mb-sm-0">
                              <label className="form-label d-flex">
                                {t("text.userProfile.emailprofileLabel")}
                                <AntTooltip
                                  promptText={
                                    profileData?.UserProfile?.email_verified
                                      ? "Verified"
                                      : "Not Verified"
                                  }
                                >
                                  <em
                                    className={`ms-2 icon-${
                                      !profileData?.UserProfile?.email_verified
                                        ? "un"
                                        : ""
                                    }verify icon-${
                                      profileData?.UserProfile?.email_verified
                                        ? "gradiant"
                                        : "notverified"
                                    }`}
                                  />
                                </AntTooltip>
                              </label>
                              <div className="form-control-wrap">
                                <TextInput
                                  className="form-control"
                                  name="email"
                                  type="email"
                                  icon={
                                    <div className="form-icon form-icon-left icon-gradiant">
                                      <em className="icon-email" />
                                    </div>
                                  }
                                  placeholder={t(
                                    "text.userSignUp.emailPlaceholder"
                                  )}
                                  setFieldValue={props.handleChange}
                                  disabled
                                />
                              </div>

                              <div className="text-end">
                                {/* {profileData?.UserProfile?.email_verified ? (
                                  <>
                                    <Link
                                      to="#"
                                      className="changeLink font-sb"
                                      // onClick={() => handleEmailShow("email")}
                                      onClick={() =>
                                        handleChangeEmailPhoneShow("email")
                                      }
                                    >
                                      {t("text.userProfile.changeEmail")}
                                    </Link>
                                  </>
                                ) : ( */}
                                {!profileData?.UserProfile?.email_verified && (
                                  <Link
                                    to="#"
                                    className="changeLink font-sb"
                                    // onClick={() => handleEmailShow()}
                                    onClick={() => onVerifyClick("email")}
                                  >
                                    Verify Email
                                  </Link>
                                )}
                                {/* )} */}
                              </div>
                            </div>
                          </Col>
                        )}
                        {/* ------------------------ show phone---------------------- */}
                        {profileData?.UserProfile?.mobile_no && (
                          <Col sm="6">
                            <div className="form-group mb-sm-0">
                              <label className="form-label d-flex">
                                {t("text.userProfile.phoneLabel")}
                                <AntTooltip
                                  promptText={
                                    profileData?.UserProfile?.phone_verified
                                      ? "Verified"
                                      : "Not Verified"
                                  }
                                >
                                  <em
                                    className={`ms-2 icon-${
                                      !profileData?.UserProfile?.phone_verified
                                        ? "un"
                                        : ""
                                    }verify icon-${
                                      profileData?.UserProfile?.phone_verified
                                        ? "gradiant"
                                        : "notverified"
                                    }`}
                                  />
                                </AntTooltip>
                              </label>
                              <div className="form-control-wrap numberCode d-flex">
                                <>
                                  <TextInput
                                    id="country_code"
                                    className="form-control"
                                    name="country_code"
                                    disabled
                                    type="text"
                                    variant="standard"
                                    placeholder="Select"
                                    setFieldValue={props.handleChange}
                                  />
                                  <TextInput
                                    name="phone_number"
                                    className="form-control ms-1"
                                    placeholder={t(
                                      "text.userProfile.phonePlaceholder"
                                    )}
                                    disabled
                                    setFieldValue={props.handleChange}
                                  />
                                </>
                              </div>
                              <div className="text-end">
                                {profileData?.UserProfile?.phone_verified ? (
                                  <>
                                    <Link
                                      to="#"
                                      className="changeLink font-sb"
                                      // onClick={() => handleEmailShow()}
                                      onClick={() =>
                                        handleChangeEmailPhoneShow("phone")
                                      }
                                    >
                                      {t("text.userLogin.changeNumber")}
                                    </Link>
                                  </>
                                ) : (
                                  <Link
                                    to="#"
                                    className="changeLink font-sb"
                                    // onClick={() => handleEmailShow()}
                                    onClick={() => onVerifyClick("mobile")}
                                  >
                                    Verify Number
                                  </Link>
                                )}
                              </div>
                            </div>
                          </Col>
                        )}
                        {/* ------------------------ add number button ---------------------- */}
                        {!profileData?.UserProfile?.mobile_no && (
                          <Col sm="6">
                            <div className="form-group mb-0">
                              <label className="form-label">
                                {" "}
                                {t("text.userProfile.phoneLabel")}
                              </label>
                              <div className="form-control-wrap numberCode d-flex">
                                <RippleEffect>
                                  <CommonButton
                                    extraClassName="btn-md mt-1"
                                    onClick={() =>
                                      handleAddPhoneEmailShow("phone")
                                    }
                                    variant="primary"
                                  >
                                    {t("text.userProfile.addPhone")}
                                  </CommonButton>
                                </RippleEffect>
                                {/* <AntSelect disabled={!isEdit} defaultValue="+41" placeholder="Select" arrayOfData={codeData} />
                            <TextInput className="form-control"
                                type="text"
                                value="123 456 7890" disabled={!isEdit} />     */}
                              </div>
                            </div>
                          </Col>
                        )}
                        {/* ------------------------ add email---------------------- */}
                        {!profileData?.UserProfile?.email && (
                          <Col sm="6">
                            <div className="form-group mb-0">
                              <label className="form-label">
                                {" "}
                                {t("text.userProfile.emailprofileLabel")}
                              </label>
                              <div className="form-control-wrap numberCode d-flex">
                                <RippleEffect>
                                  <CommonButton
                                    extraClassName="btn-md mt-1"
                                    onClick={() =>
                                      handleAddPhoneEmailShow("email")
                                    }
                                    variant="primary"
                                  >
                                    {t("text.userProfile.addEmail")}
                                  </CommonButton>
                                </RippleEffect>
                                {/* <AntSelect disabled={!isEdit} defaultValue="+41" placeholder="Select" arrayOfData={codeData} />
                            <TextInput className="form-control"
                                type="text"
                                value="123 456 7890" disabled={!isEdit} />     */}
                              </div>
                            </div>
                          </Col>
                        )}
                      </Row>
                      {/* ------------------------ change email address modal not used ---------------------- */}
                      {/* <ModalComponent
                        show={emailShow}
                        modalExtraClass="noHeader"
                        onHandleVisible={handleEmailShow}
                        onHandleCancel={handleClose}
                        title=""
                        size="md"
                      >
                        <div className="modalHeader">
                          <h3>
                            {" "}
                            {changeEmail
                              ? t("text.userProfile.changeEmail")
                              : t("text.userLogin.changeNumber")}
                          </h3>
                          <p className="text-sm mb-0">
                            {changeEmail ? (
                              <>
                                {t("text.userProfile.currentEmail")}{" "}
                                <span className="text-500 font-bd">
                                  {profileData?.email}
                                </span>
                              </>
                            ) : (
                              <>
                                {t("text.userProfile.currentPhone")}{" "}
                                <span className="text-500 font-bd">
                                  {profileData?.country_code}{" "}
                                  {profileData?.phone_number}
                                </span>
                              </>
                            )}

                            {changeEmail
                              ? t("text.userProfile.temporaryCodeEmail")
                              : t("text.userProfile.temporaryCodePhone")}
                          </p>
                        </div>
                        <div className="text-end modalFooter">
                          <RippleEffect
                            extraClassName="me-2 me-sm-3"
                            type="light"
                          >
                            <CommonButton
                              onClick={() => handleClose()}
                              variant="info"
                            >
                              {t("text.common.cancel")}
                            </CommonButton>
                          </RippleEffect>
                          <RippleEffect>
                            {/* <CommonButton
                              variant="primary"
                              onClick={onSubmitChangePhoneEmail}
                              loading={changeEmailPhoneLoading}
                            >
                              {t("text.userProfile.onSubmitChangePhoneEmail")}
                            </CommonButton> */}
                      {/*

                            <CommonButton
                              variant="primary"
                              onClick={handleChangeEmailPhoneShow}
                              // onClick={onSubmitChangePhoneEmail}
                              loading={changeEmailPhoneLoading}
                            >
                              Next
                            </CommonButton>
                          </RippleEffect>
                        </div>
                      </ModalComponent> */}
                      {/* ------------------------ add mobile number modal---------------------- */}
                      <ModalComponent
                        show={addPhoneEmailShow}
                        modalExtraClass="noHeader"
                        onHandleVisible={handleAddPhoneEmailShow}
                        onHandleCancel={handleClose}
                        title=""
                        size="md"
                      >
                        <AddEmailForm
                          onSubmit={onAddEmailPhone}
                          loading={addLoading}
                          addChangeEmailPhoneCheck={addChangeEmailPhoneCheck}
                          handleClose={handleClose}
                          // countryLoader={countryLoader}
                          formRef={formRef}
                          countryList={countryList}
                        />
                      </ModalComponent>
                      {/* ------------------------ new email phone  ---------------------- */}
                      <ModalComponent
                        show={changeEmailPhoneShow}
                        modalExtraClass="noHeader"
                        onHandleVisible={handleChangeEmailPhoneShow}
                        onHandleCancel={handleClose}
                        title=""
                        size="md"
                      >
                        <ChangeEmailForm
                          onSubmit={onSubmitChangePhoneEmail}
                          addChangeEmailPhoneCheck={addChangeEmailPhoneCheck}
                          handleClose={handleClose}
                          loading={changeEmailPhoneLoading}
                          formRef={formRef}
                          countryList={countryList}
                        />
                      </ModalComponent>
                      {/* ------------------------ verification for email phone ---------------------- */}
                      <ModalComponent
                        show={otpShow}
                        modalExtraClass="noHeader"
                        onHandleVisible={handleOtpShow}
                        onHandleCancel={handleClose}
                        title=""
                        size="md"
                      >
                        <VerificationForm
                          profileData={profileData}
                          onSubmit={onVerificationSubmit}
                          otp={otp}
                          setOtp={setOtp}
                          // checkEmailPhone={changeEmail}
                          handleClose={handleClose}
                          // addChange={addChange}
                          addData={addData}
                          // addEmail={addEmail}
                          loading={verifyLoading}
                          counter={counter}
                          reSendOtp={reSendOtp}
                        />
                      </ModalComponent>
                      {/* ------------------------ show email---------------------- */}
                      <ModalComponent
                        show={updateSuccess}
                        modalExtraClass="paymentSuccessModal"
                        onHandleVisible={handleUpdateSuccessShow}
                        onHandleCancel={handleClose}
                        title=""
                        size="sm"
                        closeButton={false}
                      >
                        <div className="text-center">
                          <ImageElement
                            source="payment-success.svg"
                            alt="payment-success"
                            className="img-fluid mb-0"
                          />
                          <h3 className="font-bd my-3 my-lg-4">
                            {addChangeEmailPhoneCheck?.type === "email"
                              ? t("text.userProfile.email")
                              : t("text.userProfile.phoneLabel")}{" "}
                            {t("text.userProfile.added")}{" "}
                            <br className="d-none d-sm-block" />{" "}
                            {t("text.userProfile.successfull")}
                          </h3>
                          <div>
                            <RippleEffect>
                              <CommonButton
                                variant="primary"
                                onClick={() => handleClose()}
                              >
                                {t("text.userProfile.ok")}
                              </CommonButton>
                            </RippleEffect>
                          </div>
                        </div>
                      </ModalComponent>
                      {/* --------------------------------Business Account------------- */}
                      <ModalComponent
                        show={businessAccount}
                        modalExtraClass="noHeader"
                        onHandleVisible={createBusinessAccount}
                        onHandleCancel={handleClose}
                        title=""
                        size="lg"
                      >
                        <div className="modalHeader">
                          <h3>
                            {" "}
                            {t("text.userProfile.createBusinessAccount")}
                          </h3>
                        </div>
                        <UserBusinessForm
                          onSubmit={onBusinessSubmit}
                          loading={businessLoader}
                          countryList={countryList}
                          handleClose={handleClose}
                          state={stateList}
                        />
                      </ModalComponent>
                    </div>
                    <div className="formBlock customCard">
                      <UserAccountForm
                        isEdit={isEdit}
                        setIsEdit={setIsEdit}
                        profileData={profileData}
                        languageDetails={languageDetails}
                        onSubmit={onSubmitEditProfile}
                        loading={editLoading}
                        formRef={formRef}
                        countryList={countryList}
                        genderList={genderList}
                        state={stateList}
                      />
                    </div>
                  </Col>
                </>
              )}
            </Formik>
          </Row>
        </Container>
      </section>
    </>
  );
}

export default UserAccount;

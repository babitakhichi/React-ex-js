import { t } from "i18next";
import React, { useState, useEffect, useRef } from "react";

import { Col, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ImageElement,
  SignUpStep1Form,
  SignUpStep2Form,
  SignUpStep3Form,
} from "../../../components";
import {
  selectSignupData,
  login,
  selectUserVerify,
  signupData,
  verifyLogin,
} from "../../../redux/AuthSlice/index.slice";
import {
  getLanguageList,
  getProfile,
  getUserAccount,
  getUserSubscription,
  selectAppVersionData,
  selectCountryData,
  updateAppVersion,
} from "../../../redux/UserSlice/index.slice";
import userRoutesMap from "../../../routeControl/userRoutes";
import { UserAuthServices, UserProfileServices } from "../../../services";
import {
  // allCountryData,
  dateFormatter,
  decodeQueryData,
  filterCountryCode,
  getActiveAccount,
  getIscorporateActive,
  logger,
  modalNotification,
  setLocalStorageToken,
} from "../../../utils";

function Signup() {
  const countryList = useSelector(selectCountryData);
  const location = useLocation();
  const appVersion = useSelector(selectAppVersionData);
  const { search } = location;
  const [counter, setCounter] = useState(60);
  const [selected, setSelected] = useState("");
  // const [counrtyName, setCountryName] = useState("");
  const [backupData, setBackupData] = useState({});
  const [step1Loading, setStep1Loading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState(false);
  const [step3Loading, setStep3Loading] = useState(false);
  let dispatch = useDispatch();
  const [step, setStep] = useState(1);
  let { username, userContact } = useSelector(selectUserVerify);
  let dataSignup = useSelector(selectSignupData);
  // const [countryLoader, setCountryLoader] = useState(false);
  // const [countryList, setCountryList] = useState({});
  const [loginPhone, setLoginEmail] = useState(true);
  const [otp, setOtp] = useState({
    input1: "",
    input2: "",
    input3: "",
    input4: "",
    input5: "",
    input6: "",
  });
  const navigate = useNavigate();

  const emailLogin = () => {
    setLoginEmail(false);
  };
  const phoneLogin = () => {
    setLoginEmail(true);
  };

  const formRef = useRef(null);

  useEffect(() => {
    let timer;
    if (counter > 0 && step === 2) {
      timer = setTimeout(() => setCounter((c) => c - 1), 1000);
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [counter, step]);
  const reSendOtp = async () => {
    try {
      let bodyData;
      if (email) {
        bodyData = {
          verification_type: "email",
          email: userContact?.email,
        };
      } else {
        bodyData = {
          verification_type: "phone",
          country_code: userContact?.country_code,
          phone_number: userContact?.phone_number,
        };
      }
      bodyData.type = "signup";
      const response = await UserAuthServices.resendOTPService(bodyData);
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

  const onStep1Submit = async (values) => {
    setStep1Loading(true);
    try {
      let bodyData = {};
      if (values?.email) {
        bodyData = {
          email: values?.email,
          country_id: values?.country_id,
        };
      } else {
        bodyData = {
          country_id: values?.country_id,
          country_code: values?.country_code,
          phone_number: values?.phoneNumber,
        };
      }
      bodyData.referral_code = values?.referral_code;
      setBackupData(bodyData);
      const response = await UserAuthServices.verifyUserService(bodyData);
      const { success, data, message } = response;
      data.userContact = bodyData;
      if (success === 1) {
        dispatch(verifyLogin(data));
        modalNotification({
          type: "success",
          message,
        });
        setStep(2);
      } else {
        modalNotification({
          type: "error",
          message,
        });
      }
    } catch (error) {
      logger(error);
    }

    setStep1Loading(false);
  };

  const step2Submit = async () => {
    setLoading(true);
    try {
      let otpValue = "";
      for (let key in otp) {
        if (key) {
          otpValue += otp[key];
        }
      }
      if (otpValue && otpValue.length === 6) {
        let bodyData = {
          code: otpValue,
        };
        bodyData.username = username;
        if (backupData?.email) {
          bodyData.type = "email";
        } else {
          bodyData.type = "phone";
        }

        const response = await UserAuthServices.userLoginService(bodyData);
        const { success, data, message } = response;
        const resData = data;
        resData.userRole = "user";
        if (success === 1) {
          dispatch(signupData(resData));
          dispatch(
            updateAppVersion({
              version: data?.app_version,
              refresh: appVersion?.refresh,
            })
          );
          modalNotification({
            type: "success",
            message,
          });
          if (data.verified !== true) setStep(3);
        } else {
          modalNotification({
            type: "error",
            message,
          });
        }
      } else {
        modalNotification({
          type: "error",
          message: t("validation.common.validOtp"),
        });
      }
    } catch (error) {
      logger(error);
    }

    setLoading(false);
  };
  const onSubmit = async (values) => {
    setStep3Loading(true);

    try {
      let bodyData = {
        type: "signup",
        full_name: `${values?.first_name} ${values?.last_name}`,
        // first_name: values?.first_name,
        // last_name: values?.last_name,
        business_name: values?.company_name,
        dob: dateFormatter(values?.dob, "YYYY-MM-DD"),
        username: dataSignup.username,
        country_id: userContact?.country_id,
      };
      if (values.email) {
        bodyData.email = values?.email;
      }
      if (values.phone_number) {
        bodyData.country_code = values?.country_code;
        bodyData.phone_number = values?.phone_number;
      }
      const response = await UserAuthServices.updateDetailService(bodyData);
      const { success, message } = response;
      if (success === 1) {
        modalNotification({
          type: "success",
          message,
        });
        dispatch(login(dataSignup));
        setLocalStorageToken(dataSignup?.jwt);
        dispatch(getProfile());
        dispatch(getUserAccount());
        dispatch(getLanguageList());
        const responseaccount = await UserProfileServices.getAccountService();
        const activeAccount = getActiveAccount(responseaccount);
        let queryParams = {
          is_corporate: getIscorporateActive(responseaccount?.data),
          corporate_id: activeAccount?.id,
        };
        dispatch(getUserSubscription({ queryParams }));
        setBackupData({});
        navigate(userRoutesMap.USER_DASHBOARD.path);
      } else {
        modalNotification({
          type: "error",
          message,
        });
      }
    } catch (error) {
      logger(error);
    }
    setStep3Loading(false);
  };

  // const getCountryList = async (code, check) => {
  //   // setCountryLoader(true);
  //   try {
  //     let res = await CommonServices.singleCountry(code);
  //     const { success, message } = res;
  //     if (success === 1) {
  //       // setCountryLoader(false);
  //       if (check === "id") {
  //         formRef?.current?.setFieldValue(
  //           "country_code",
  //           `+${res?.data?.phone_code}`
  //         );
  //       }
  //     } else {
  //       modalNotification({
  //         type: "error",
  //         message,
  //       });
  //     }
  //   } catch (error) {
  //     logger(error);
  //     // setCountryLoader(false);
  //   }
  // };

  useEffect(() => {
    if (selected) {
      // getCountryList(selected, "id");
      let filteredData = filterCountryCode(selected, countryList);

      formRef?.current?.setFieldValue(
        "country_code",
        `+${filteredData.phone_code}`
      );
    }
  }, [selected]);
  useEffect(() => {
    if (search) {
      const data = decodeQueryData(search);
      setLoginEmail(false);
      if (data?.email) {
        setBackupData({
          ...backupData,
          email: data?.email,
        });
      }
      if (data?.id) {
        setBackupData({
          ...backupData,
          referral_code: data?.id,
        });
      }
    }
  }, [search]);
  return (
    <>
      <section className="authPage vh-100">
        <Row className="g-0 h-100">
          <Col lg="6" className="authPage_left h-100">
            <div className="d-flex h-100 justify-content-start align-items-center flex-column authPage_left_form">
              <div className="authPage_left_logo">
                <Link to={userRoutesMap.HOME.path}>
                  <ImageElement
                    className="img-fluid"
                    source="logo-dark.svg"
                    alt="login-right"
                  />
                </Link>
              </div>

              <div className="d-flex h-100 flex-column justify-content-between w-100">
                {step === 1 && (
                  <SignUpStep1Form
                    loading={step1Loading}
                    onSubmit={onStep1Submit}
                    t={t}
                    userRoutesMap={userRoutesMap}
                    setEmail={setEmail}
                    email={email}
                    loginPhone={loginPhone}
                    emailLogin={emailLogin}
                    phoneLogin={phoneLogin}
                    formRef={formRef}
                    selected={selected}
                    setSelected={setSelected}
                    backupData={backupData}
                    // counrtyName={counrtyName}
                    // setCountryName={setCountryName}
                    countryList={countryList}
                  />
                )}
                {step === 2 && (
                  <SignUpStep2Form
                    onSubmit={step2Submit}
                    setStep={setStep}
                    loading={loading}
                    setOtp={setOtp}
                    otp={otp}
                    setCounter={setCounter}
                    t={t}
                    reSendOtp={reSendOtp}
                    email={email}
                    counter={counter}
                  />
                )}
                {step === 3 && (
                  <SignUpStep3Form
                    loading={step3Loading}
                    onSubmit={onSubmit}
                    countryList={countryList}
                    t={t}
                  />
                )}
              </div>
            </div>
          </Col>
          <Col
            lg="6"
            className="h-100 d-none d-lg-block position-relative authPage_right"
          >
            {(step === 1 || step === 2) && (
              <>
                <ImageElement
                  className="authPage_right-img img-fluid w-100 h-100"
                  source="signup.jpg"
                  alt="login-right"
                />
                <p className="authPage_right-content font-sm mb-0">
                  {t("text.userSignUp.enjoy")}
                </p>
              </>
            )}
            {step === 3 && (
              <>
                <ImageElement
                  className="authPage_right-img img-fluid w-100 h-100"
                  source="signup-1.jpg"
                  alt="login-right"
                />
                <p className="authPage_right-content font-sm mb-0">
                  {t("text.userSignUp.aOne")}
                </p>
              </>
            )}
          </Col>
        </Row>
      </section>
    </>
  );
}

export default Signup;

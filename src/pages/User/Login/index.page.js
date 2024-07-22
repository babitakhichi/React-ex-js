import { t } from "i18next";
import React, { useEffect, useRef, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  ImageElement,
  SignUpStep3Form,
  UserLoginForm,
  UserVerificationForm,
} from "../../../components";
import {
  login,
  selectSignupData,
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
  updateUserSubscription,
} from "../../../redux/UserSlice/index.slice";
import userRoutesMap from "../../../routeControl/userRoutes";
// import { CommonServices } from "../../../services";
import {
  UserAuthServices,
  UserHomeServices,
  UserProfileServices,
} from "../../../services/User";

import {
  // allCountryData,
  dateFormatter,
  getActiveAccount,
  getIscorporateActive,
  logger,
  modalNotification,
  removeLocalStorageToken,
  setLocalStorageToken,
} from "../../../utils";

function Login() {
  // const countryData = useSelector(selectCountryData);
  const countryList = useSelector(selectCountryData);

  const [counter, setCounter] = useState(60);
  const [step, setStep] = useState(1);
  const [backupData, setBackupData] = useState({});
  const [loadingEmail, setLoadingEmail] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step3Loading, setStep3Loading] = useState(false);
  let dataSignup = useSelector(selectSignupData);
  const appVersion = useSelector(selectAppVersionData);
  let { username, userContact } = useSelector(selectUserVerify);
  const formRef = useRef(null);
  const [otpError, setOtpError] = useState(false);
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

  const [otp, setOtp] = useState({
    input1: "",
    input2: "",
    input3: "",
    input4: "",
    input5: "",
    input6: "",
  });
  let dispatch = useDispatch();
  const navigate = useNavigate();

  const loginSuccessfully = async () => {
    setLoading(true);
    try {
      let otpValue = "";
      for (let key in otp) {
        if (key) {
          otpValue += otp[key];
        }
      }

      if (otpValue && otpValue.length === 6) {
        setOtpError(false);
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
          if (data?.verified !== true) {
            dispatch(signupData(resData));
            modalNotification({
              type: "success",
              message,
            });
            setStep(3);
          } else {
            setLocalStorageToken(data?.jwt);
            const responseaccount =
              await UserProfileServices.getAccountService();
            const activeAccount = getActiveAccount(responseaccount?.data);
            let queryParams = {
              is_corporate: getIscorporateActive(responseaccount?.data),
              corporate_id: activeAccount?.id,
            };
            const res =
              await UserHomeServices.userActiveSubscriptionListingService({
                queryParams,
              });
            if (res?.success === 1) {
              dispatch(updateUserSubscription(res?.data));
              dispatch(login(resData));
              dispatch(getProfile());
              dispatch(getUserAccount());
              dispatch(getLanguageList());
              if (
                Number(appVersion?.version) > 1 &&
                data?.app_version !== appVersion?.version
              ) {
                dispatch(
                  updateAppVersion({
                    version: data?.app_version,
                    refresh: true,
                  })
                );
              } else {
                dispatch(
                  updateAppVersion({
                    version: data?.app_version,
                    refresh: appVersion?.refresh,
                  })
                );
              }

              modalNotification({
                type: "success",
                message: "Sign in successful",
              });
              setBackupData({});
              navigate(userRoutesMap.USER_DASHBOARD.path);
            } else {
              removeLocalStorageToken();
              modalNotification({
                type: "error",
                message: res?.message,
              });
            }
          }
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
  const [loginPhone, setLoginEmail] = useState(true);
  const emailLogin = () => {
    setLoginEmail(false);
  };
  const phoneLogin = () => {
    setLoginEmail(true);
  };
  const codeData = [
    {
      id: "+91",
      name: "+91",
    },
    {
      id: "+14",
      name: "+14",
    },
    {
      id: "+4158",
      name: "+4158",
    },
  ];
  // function onlyNumberKey(evt) {
  //   let ASCIICode = evt.which ? evt.which : evt.keyCode;
  //   if (ASCIICode > 31 && (ASCIICode < 48 || ASCIICode > 57)) return false;
  //   return true;
  // }
  const onSubmitEmail = async (values) => {
    setLoadingEmail(true);
    try {
      let bodyData;
      if (values?.email) {
        bodyData = {
          email: values?.email,
          login_type: "login",
          // country_code: `${values?.country_code}`,
        };
      } else {
        bodyData = {
          country_code: values?.country_code,
          phone_number: values?.phoneNumber,
          login_type: "login",
        };
      }
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
    setLoadingEmail(false);
  };
  const onSubmit = async (values) => {
    setStep3Loading(true);
    try {
      let bodyData = {
        type: "signup",
        // first_name: values?.first_name,
        // last_name: values?.last_name,
        full_name: `${values?.first_name} ${values?.last_name}`,
        business_name: values?.company_name,
        dob: dateFormatter(values?.dob, "YYYY-MM-DD"),
        username: dataSignup.username,
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
        const responseaccount = await UserProfileServices.getAccountService();
        const activeAcc = getActiveAccount(responseaccount?.data);
        let queryParams = {
          is_corporate: getIscorporateActive(responseaccount?.data),
          corporate_id: activeAcc?.id,
        };
        dispatch(getUserSubscription({ queryParams }));
        dispatch(getProfile());
        dispatch(getLanguageList());
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

  // const reSendOtp = () => {
  //   try {
  //     setCounter(30);
  //   } catch (error) {
  //     logger(error);
  //   }
  // };
  const reSendOtp = async () => {
    try {
      let bodyData;
      if (!loginPhone) {
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
      bodyData.type = "login";
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

  return (
    <>
      <section className="authPage vh-100">
        <Row className="g-0 h-100">
          <Col lg="6" className="authPage_left h-100">
            <div className="d-flex h-100 justify-content-start align-items-center flex-column authPage_left_form">
              <div className="authPage_left_logo">
                <Link to={userRoutesMap.HOME.path}>
                  <ImageElement source="logo-dark.svg" alt="daakia" />
                </Link>
              </div>
              {step === 1 && (
                <>
                  <UserLoginForm
                    codeData={codeData}
                    onSubmit={onSubmitEmail}
                    t={t}
                    loading={loadingEmail}
                    loginPhone={loginPhone}
                    emailLogin={emailLogin}
                    phoneLogin={phoneLogin}
                    userRoutesMap={userRoutesMap}
                    formRef={formRef}
                    countryList={countryList}
                    backupData={backupData}
                    setBackupData={setBackupData}
                  />
                </>
              )}
              {step === 2 && (
                <UserVerificationForm
                  onSubmit={loginSuccessfully}
                  setStep={setStep}
                  loading={loading}
                  t={t}
                  setOtp={setOtp}
                  otp={otp}
                  loginPhone={loginPhone}
                  counter={counter}
                  reSendOtp={reSendOtp}
                  setOtpError={setOtpError}
                  otpError={otpError}
                  setCounter={setCounter}
                />
              )}
              {step === 3 && (
                <SignUpStep3Form
                  loading={step3Loading}
                  onSubmit={onSubmit}
                  codeData={codeData}
                  countryList={countryList}
                  t={t}
                />
              )}
            </div>
          </Col>
          <Col
            lg="6"
            className="h-100 d-none d-lg-block position-relative authPage_right"
          >
            <ImageElement
              className="authPage_right-img img-fluid w-100 h-100"
              source="login.jpg"
              alt="login-right"
            />
            <p className="authPage_right-content font-sm mb-0">
              {t("text.userLogin.loginDescription")}
            </p>
          </Col>
        </Row>
      </section>
    </>
  );
}

export default Login;

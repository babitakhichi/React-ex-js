import { Form, Formik } from "formik";
import { t } from "i18next";
import React from "react";
// import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
// import { selectUserVerify } from "../../../../redux/AuthSlice/index.slice";
import { otpRegex } from "../../../../utils";
import { Input as TextInput, CommonButton, RippleEffect } from "../../../index";

function VerificationFormCommon({
  onSubmit,
  // setStep,
  loading,
  // t,
  otp,
  setOtp,
  // loginPhone,
  counter,
  reSendOtp,
  verifyModule = false,
  handleClose,
  // otpError,
  // setOtpError,
}) {
  // let { userContact } = useSelector(selectUserVerify);
  const initialValues = {
    input1: "",
    input2: "",
    input3: "",
    input4: "",
    input5: "",
    input6: "",
  };

  const movetoNext = (
    e,
    nextFieldID,
    prevFieldID,
    currentFieldId,
    maxLength = 1
  ) => {
    if (e.target.value.length >= maxLength) {
      if (e.target.value.match(otpRegex())) {
        document.getElementById(nextFieldID).focus();
      }
    }
    if (e.keyCode === 8) {
      let data = { ...otp };
      data[currentFieldId] = "";
      setOtp(data);
      document.getElementById(prevFieldID).focus();
    }
  };

  const onChangeInput = (event) => {
    let { name, value } = event.target;
    if (value.match(otpRegex())) {
      if (value.length === 6) {
        let optData = {};
        [...value].forEach((item, key) => {
          optData[`input${key + 1}`] = item?.[0];
        });
        movetoNext(event, "sixth", "fifth", "input6", event.target.maxLength);
        setOtp({ ...optData });
      } else {
        setOtp((data) => {
          return {
            ...data,
            [name]: value[0],
          };
        });
      }
    }
  };

  const onFocusInput = (currentFieldId) => {
    document.getElementById(currentFieldId).select();
  };

  const Timerformat = (time) => {
    // const minutes = Math.floor(time / 60);

    // const seconds = time % 60;

    let secs = time > 9 ? time : `0${time}`;

    return `${secs}`;
  };

  return (
    <Formik
      initialValues={{ ...initialValues }}
      // validate={(e) => {
      // if (
      //   e.input1 &&
      //   e.input2 &&
      //   e.input3 &&
      //   e.input4 &&
      //   e.input5 &&
      //   e.input6
      // ) {
      //   setOtpError(false);
      // }
      // }}
      onSubmit={onSubmit}
      enableReinitialize
    >
      {() => {
        return (
          <Form className="w-100 h-100">
            <div className="d-flex h-100 flex-column justify-content-between w-100">
              <div className="d-flex flex-column authPage_left_field">
                {/* <div className="authPage_left_head text-center">
                  <h1 className="font-blk text-center mb-0">
                    {t("text.userLogin.verification")}
                  </h1>
                  {loginPhone ? (
                    <>
                      {" "}
                      <p>
                        {t("text.userLogin.verificationdescription")} <br />
                        {t("text.userLogin.mobile")}{" "}
                        <Link to="#" className="link-primary font-bd">
                          {userContact.country_code} {userContact.phone_number}
                        </Link>
                      </p>
                      <div className="">
                        <Link
                          to="#"
                          onClick={() => setStep(1)}
                          className="font-bd numberEdit"
                        >
                          <em className="icon icon-pencil icon-gradiant" />
                          {t("text.userLogin.changeNumber")}
                        </Link>
                      </div>
                    </>
                  ) : (
                    <>
                      {" "}
                      <p>
                        {t("text.userLogin.verificationdescription")} <br />
                        {t("text.userProfile.emailprofileLabel")}{" "}
                        <Link to="#" className="link-primary font-bd">
                          {userContact.email}
                        </Link>
                      </p>
                      <div className="">
                        <Link
                          to="#"
                          onClick={() => setStep(1)}
                          className="font-bd numberEdit"
                        >
                          <em className="icon icon-pencil icon-gradiant" />
                          {t("text.userLogin.changeEmail")}
                        </Link>
                      </div>
                    </>
                  )}
                </div> */}
                <div className="form-group">
                  <label className="form-label">
                    {t("text.userLogin.verificationLabel")}
                  </label>
                  <div className="form-group VerifyInput d-flex">
                    <TextInput
                      className="form-control text-center"
                      type="text"
                      // maxLength="1"
                      name="input1"
                      onKeyUp={(e) =>
                        movetoNext(
                          e,
                          "second",
                          "first",
                          "input1",
                          e.target.maxLength
                        )
                      }
                      onChange={onChangeInput}
                      id="first"
                      onFocus={() => onFocusInput("first")}
                      value={otp.input1}
                    />

                    <TextInput
                      className="form-control text-center"
                      type="text"
                      // maxLength="1"
                      name="input2"
                      onKeyUp={(e) =>
                        movetoNext(
                          e,
                          "third",
                          "first",
                          "input2",
                          e.target.maxLength
                        )
                      }
                      onChange={onChangeInput}
                      id="second"
                      onFocus={() => onFocusInput("second")}
                      value={otp.input2}
                    />
                    <TextInput
                      className="form-control text-center"
                      type="text"
                      // maxLength="1"
                      name="input3"
                      onKeyUp={(e) =>
                        movetoNext(
                          e,
                          "fourth",
                          "second",
                          "input3",
                          e.target.maxLength
                        )
                      }
                      onChange={onChangeInput}
                      id="third"
                      onFocus={() => onFocusInput("third")}
                      value={otp.input3}
                    />
                    <TextInput
                      className="form-control text-center"
                      type="text"
                      // maxLength="1"
                      name="input4"
                      onKeyUp={(e) =>
                        movetoNext(
                          e,
                          "fifth",
                          "third",
                          "input4",
                          e.target.maxLength
                        )
                      }
                      onChange={onChangeInput}
                      id="fourth"
                      onFocus={() => onFocusInput("fourth")}
                      value={otp.input4}
                    />
                    <TextInput
                      className="form-control text-center"
                      type="text"
                      // maxLength="1"
                      name="input5"
                      onKeyUp={(e) =>
                        movetoNext(
                          e,
                          "sixth",
                          "fourth",
                          "input5",
                          e.target.maxLength
                        )
                      }
                      onChange={onChangeInput}
                      id="fifth"
                      onFocus={() => onFocusInput("fifth")}
                      value={otp.input5}
                    />
                    <TextInput
                      className="form-control text-center"
                      type="text"
                      // maxLength="1"
                      name="input6"
                      onKeyUp={(e) =>
                        movetoNext(
                          e,
                          "sixth",
                          "fifth",
                          "input6",
                          e.target.maxLength
                        )
                      }
                      onChange={onChangeInput}
                      id="sixth"
                      onFocus={() => onFocusInput("sixth")}
                      value={otp.input6}
                    />
                  </div>
                  {/* {otpError ? (
                    <p className="text-danger text-center">
                      {t("text.common.otpValid")}
                    </p>
                  ) : null} */}
                </div>
                {verifyModule ? (
                  <div className="d-flex justify-content-between modalFooter">
                    {counter === 0 ? (
                      <>
                        <p className="mb-0">
                          {t("text.userSignUp.notReceived")}{" "}
                          <Link
                            className="link-primary font-bd"
                            to="#"
                            onClick={(e) => {
                              e.preventDefault();
                              reSendOtp();
                              setOtp({
                                input1: "",
                                input2: "",
                                input3: "",
                                input4: "",
                                input5: "",
                                input6: "",
                              });
                            }}
                          >
                            {t("text.userSignUp.resend")}
                          </Link>
                        </p>
                      </>
                    ) : (
                      <p className="text-sm font-sb">
                        {t("text.userLogin.valid")}{" "}
                        <span className="link-primary font-bd">
                          {Timerformat(counter)}
                        </span>{" "}
                        {t("text.userLogin.sec")}
                      </p>
                    )}

                    {/* <p className="text-sm font-sb">
                    Your Code is valid
                    <br /> for <span className="text-500 font-bd">
                      00:30
                    </span>{" "}
                    sec.
                  </p> */}
                    <div className="flex-shrink-0">
                      <RippleEffect extraClassName="me-2 me-sm-3" type="light">
                        <CommonButton
                          onClick={() => handleClose()}
                          variant="info"
                        >
                          {t("text.common.cancel")}
                        </CommonButton>
                      </RippleEffect>
                      <RippleEffect>
                        <CommonButton
                          variant="primary"
                          htmltype="button"
                          type="submit"
                          loading={loading}
                          // onClick={() => otpConfirm()}
                        >
                          {t("text.userLogin.submit")}
                        </CommonButton>
                      </RippleEffect>
                    </div>
                  </div>
                ) : (
                  <>
                    {counter === 0 ? (
                      <p className="text-center mb-0 font-sb">
                        Didn&#39;t received the code?{" "}
                        <Link
                          className="link-primary font-bd"
                          to="#"
                          onClick={(e) => {
                            e.preventDefault();
                            reSendOtp();
                            setOtp({
                              input1: "",
                              input2: "",
                              input3: "",
                              input4: "",
                              input5: "",
                              input6: "",
                            });
                          }}
                        >
                          {t("text.userSignUp.resend")}
                        </Link>
                      </p>
                    ) : (
                      <p className="text-center mb-0 font-sb">
                        {t("text.userLogin.valid")}{" "}
                        <span className="link-primary font-bd">
                          {Timerformat(counter)}
                        </span>{" "}
                        {t("text.userLogin.sec")}
                      </p>
                    )}
                    <RippleEffect>
                      <CommonButton
                        // onClick={() => loginSuccessfully()}
                        loading={loading}
                        htmltype="button"
                        type="submit"
                        variant="primary"
                        extraClassName="w-100 authPage_left_signUp"
                      >
                        {t("text.userLogin.submit")}
                      </CommonButton>
                    </RippleEffect>
                  </>
                )}
              </div>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
}

export default VerificationFormCommon;

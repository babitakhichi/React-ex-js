import { Form, Formik } from "formik";
import React from "react";
import { Link } from "react-router-dom";

import { otpRegex } from "../../../../utils";
// import i18next from "i18next";
import { Input as TextInput, CommonButton, AuthLogo } from "../../../index";

function OtpVerificationForm({
  loading,
  onSubmit,
  otp,
  setOtp,
  t,
  resendCode,
}) {
  const initialValues = {
    input1: "",
    input2: "",
    input3: "",
    input4: "",
  };

  const onChangeInput = (event) => {
    let { name, value } = event.target;
    if (value.match(otpRegex())) {
      setOtp((data) => {
        return {
          ...data,
          [name]: value,
        };
      });
    }
  };

  const movetoNext = (e, nextFieldID, prevFieldID, currentFieldId) => {
    if (e.target.value.length >= e.target.maxLength) {
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

  const onFocusInput = (currentFieldId) => {
    document.getElementById(currentFieldId).select();
  };
  return (
    <Formik
      initialValues={{ ...initialValues }}
      onSubmit={onSubmit}
      enableReinitialize
    >
      {() => {
        return (
          <div className="nk-block nk-block-middle nk-auth-body  wide-xs">
            <AuthLogo />
            <div className="card">
              <div className="card-inner card-inner-lg">
                <div className="nk-block-head">
                  <div className="nk-block-head-content">
                    <h4 className="nk-block-title">
                      {t("text.adminVerification.verification")}
                    </h4>
                    <div className="nk-block-des">
                      <p>
                        {t("text.adminVerification.verificationDescription")}
                      </p>
                    </div>
                  </div>
                </div>
                <Form>
                  <div className="form-group otp-group d-flex gx-2">
                    <div className="col">
                      <TextInput
                        className="form-control form-control-lg text-center"
                        type="text"
                        maxLength="1"
                        name="input1"
                        onKeyUp={(e) =>
                          movetoNext(e, "second", "first", "input1")
                        }
                        onChange={onChangeInput}
                        id="first"
                        onFocus={() => onFocusInput("first")}
                        value={otp.input1}
                      />
                    </div>
                    <div className="col">
                      <TextInput
                        className="form-control form-control-lg text-center"
                        type="text"
                        maxLength="1"
                        name="input2"
                        onKeyUp={(e) =>
                          movetoNext(e, "third", "first", "input2")
                        }
                        onChange={onChangeInput}
                        id="second"
                        onFocus={() => onFocusInput("second")}
                        value={otp.input2}
                      />
                    </div>
                    <div className="col">
                      <TextInput
                        className="form-control form-control-lg text-center"
                        type="text"
                        maxLength="1"
                        name="input3"
                        onKeyUp={(e) =>
                          movetoNext(e, "fourth", "second", "input3")
                        }
                        onChange={onChangeInput}
                        id="third"
                        onFocus={() => onFocusInput("third")}
                        value={otp.input3}
                      />
                    </div>
                    <div className="col">
                      <TextInput
                        className="form-control form-control-lg text-center"
                        type="text"
                        maxLength="1"
                        name="input4"
                        onKeyUp={(e) =>
                          movetoNext(e, "fourth", "third", "input4")
                        }
                        onChange={onChangeInput}
                        id="fourth"
                        onFocus={() => onFocusInput("fourth")}
                        value={otp.input4}
                      />
                    </div>
                  </div>
                  <div className="form-group text-center">
                    <Link
                      className="link link-primary"
                      to="#"
                      onClick={(e) => {
                        e.preventDefault();
                        resendCode();
                        setOtp({
                          input1: "",
                          input2: "",
                          input3: "",
                          input4: "",
                        });
                      }}
                    >
                      {t("text.adminVerification.resend")}
                    </Link>
                  </div>
                  <div className="form-group">
                    <CommonButton
                      extraClassName="btn btn-lg btn-primary btn-block"
                      loading={loading}
                      // onClick={()=> verifySuccessfully()}
                      htmltype="button"
                      type="submit"
                    >
                      {t("text.adminVerification.submit")}
                    </CommonButton>
                  </div>
                </Form>
              </div>
            </div>
          </div>
        );
      }}
    </Formik>
  );
}

export default OtpVerificationForm;

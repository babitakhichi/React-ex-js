import { t } from "i18next";
import React from "react";
// import { Link } from "react-router-dom";
// import { otpRegex } from "../../../../../../utils";

import {
  // CommonButton,
  // Input as TextInput,
  // RippleEffect,
  VerificationFormCommon,
} from "../../../../../index";

function VerificationForm({
  onSubmit,
  // profileData,
  // checkEmailPhone,
  otp,
  setOtp,
  handleClose,
  // addChange,
  addData,
  // addEmail,
  loading,
  reSendOtp,
  counter,
}) {
  // const movetoNext = (
  //   e,
  //   nextFieldID,
  //   prevFieldID,
  //   currentFieldId,
  //   maxLength = 1
  // ) => {
  //   if (e.target.value.length >= maxLength) {
  //     if (e.target.value.match(otpRegex())) {
  //       document.getElementById(nextFieldID).focus();
  //     }
  //   }
  //   if (e.keyCode === 8) {
  //     let data = { ...otp };
  //     data[currentFieldId] = "";
  //     setOtp(data);
  //     document.getElementById(prevFieldID).focus();
  //   }
  // };

  // const onChangeInput = (event) => {
  //   let { name, value } = event.target;
  //   if (value.match(otpRegex())) {
  //     if (value.length === 6) {
  //       let optData = {};
  //       [...value].forEach((item, key) => {
  //         optData[`input${key + 1}`] = item?.[0];
  //       });
  //       movetoNext(event, "sixth", "fifth", "input6", event.target.maxLength);
  //       setOtp({ ...optData });
  //     } else {
  //       setOtp((data) => {
  //         return {
  //           ...data,
  //           [name]: value[0],
  //         };
  //       });
  //     }
  //   }
  // };

  // const onFocusInput = (currentFieldId) => {
  //   document.getElementById(currentFieldId).select();
  // };
  // const Timerformat = (time) => {
  //   const minutes = Math.floor(time / 60);

  //   const seconds = time % 60;
  //   let secs = seconds > 9 ? seconds : `0${seconds}`;

  //   return `${minutes}:${secs}`;
  // };

  return (
    <>
      {/* ------------------------ verification for email phone ---------------------- */}

      {/* <div className="modalHeader">
                <h3>{t("text.userLogin.verification")}</h3>
                {addChange ? (
                  <p className="text-sm mb-0">
                    {addEmail ? (
                      <>
                        {t("text.userProfile.verificationEmail")}{" "}
                        <span className="text-500">{addData.email}</span>
                      </>
                    ) : (
                      <>
                        {t("text.userProfile.verificationPhone")}
                        <span className="text-500">
                          {" "}
                          {addData.country_code} {addData.phone_number}
                        </span>
                      </>
                    )}
                  </p>
                ) : (
                  <p className="text-sm mb-0">
                    {checkEmailPhone ? (
                      <>
                        {t("text.userProfile.verificationEmail")}{" "}
                        <span className="text-500">{addData?.email}</span>
                      </>
                    ) : (
                      <>
                        {t("text.userProfile.verificationPhone")}
                        <span className="text-500">
                          {" "}
                          {addData?.country_code} {addData?.phone_number}
                        </span>
                      </>
                    )}
                  </p>
                )}
              </div> */}
      <div className="modalHeader">
        <h3>{t("text.userLogin.verification")}</h3>
        <p className="text-sm mb-0">
          {addData?.type === "email" ? (
            <>
              {t("text.userProfile.verificationEmail")}{" "}
              <span className="text-500">{addData?.email}</span>
            </>
          ) : (
            <>
              {t("text.userProfile.verificationPhone")}
              <span className="text-500">
                {" "}
                {addData?.country_code} {addData.phone_number}
              </span>
            </>
          )}
        </p>
      </div>
      <div className="">
        <VerificationFormCommon
          otp={otp}
          setOtp={setOtp}
          handleClose={handleClose}
          loading={loading}
          reSendOtp={reSendOtp}
          counter={counter}
          verifyModule
          onSubmit={onSubmit}
        />
        {/* <div className="form-group">
                  <label className="form-label">
                    {t("text.userLogin.verificationLabel")}
                  </label>
                  <div className="VerifyInput d-flex">
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
                </div> */}
        {/* <div className="d-flex justify-content-between modalFooter">
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
                      {t("text.userLogin.valid")} <br />
                      <span className="link-primary font-bd">
                        {Timerformat(counter)}
                      </span>{" "}
                      {t("text.userLogin.sec")}
                    </p>
                  )}

                  
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
                </div> */}
      </div>

      {/* ------------------------ show email---------------------- */}
    </>
  );
}
export default VerificationForm;

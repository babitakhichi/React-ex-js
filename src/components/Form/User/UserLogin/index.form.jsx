import { Form, Formik } from "formik";
import React, { useState } from "react";
// import ReactFlagsSelect from "react-flags-select";
import { Link } from "react-router-dom";
// import { phoneNumberField } from "../../../../utils";
import { phoneNumberField } from "../../../../utils";

import {
  Input as TextInput,
  Checkbox,
  CommonButton,
  RippleEffect,
  AntSelect,
} from "../../../index";
import { Emailvalidation, Phonevalidation } from "./validation";

function LoginForm({
  onSubmit,
  t,
  loading,
  loginPhone,
  emailLogin,
  formRef,
  phoneLogin,
  userRoutesMap,
  countryList,
  backupData,
  setBackupData,
}) {
  const initialValues = {
    email: backupData?.email || "",
    phoneNumber: backupData?.phone_number || "",
    country_code: backupData?.country_code || undefined,
  };
  function handleKey(e) {
    phoneNumberField(e);
  }
  const [agree, setAgree] = useState(false);
  const checkboxHandler = () => {
    setAgree(!agree);
  };

  return (
    <Formik
      initialValues={{ ...initialValues }}
      validationSchema={loginPhone ? Phonevalidation() : Emailvalidation()}
      onSubmit={onSubmit}
      innerRef={formRef}
      enableReinitialize
    >
      {(props) => {
        return (
          <Form className="w-100 h-100">
            <div className="d-flex h-100 flex-column justify-content-between w-100">
              <div className="d-flex flex-column authPage_left_field">
                <div className="authPage_left_head">
                  <h1 className="font-blk text-center mb-0">
                    {t("text.adminLogin.submit")}
                  </h1>
                </div>
                {loginPhone ? (
                  <div className="form-group">
                    <div className="d-flex justify-content-between align-items-center">
                      <label className="form-label">
                        {t("text.userLogin.numberLabel")}
                      </label>
                      <Link
                        className="link-primary f-14 font-sb"
                        to="#"
                        onClick={() => {
                          emailLogin();
                          props.resetForm();
                          setBackupData({});
                          setTimeout(() => {
                            document.getElementById("login-email")?.focus();
                          }, 100);
                        }}
                      >
                        {t("text.userLogin.useEmail")}
                      </Link>
                    </div>
                    <div className="form-control-wrap numberCode d-flex flex-wrap flex-sm-nowrap">
                      <AntSelect
                        size="medium"
                        id="status"
                        extraClassName="form-control"
                        name="country_code"
                        disabled={false}
                        variant="standard"
                        placeholder="Select"
                        setFieldValue={props.handleChange}
                        showSearch
                        focusNext
                        focusId="phoneNumber"
                        // arrayOfData={countryList}
                        // value={values.country_code}
                        // onSelect={(e) => onSelectCountry(props.setFieldValue, e)}
                        // loading={countryLoader}
                      >
                        {countryList.length > 0 &&
                          countryList.map((item, key) => {
                            return (
                              <option key={key} value={`+${item?.phone_code}`}>
                                {`+${item?.phone_code}`}
                              </option>
                            );
                          })}
                      </AntSelect>
                      <TextInput
                        className="form-control"
                        placeholder={t("text.userLogin.numberPlaceholder")}
                        onKeyPress={(e) => handleKey(e)}
                        // type="number"
                        min="0"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        type="text"
                        name="phoneNumber"
                        id="phoneNumber"
                        setFieldValue={props.handleChange}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="form-group">
                    <div className="d-flex justify-content-between align-items-center">
                      <label className="form-label">
                        {t("text.userLogin.emailLabel")}
                      </label>
                      <Link
                        className="link-primary f-14 font-sb"
                        to="#"
                        onClick={() => {
                          phoneLogin();
                          props.resetForm();
                          setBackupData({});
                        }}
                      >
                        {t("text.userLogin.useNumber")}
                      </Link>
                    </div>
                    <TextInput
                      className="form-control"
                      placeholder={t("text.userLogin.emailPlaceholder")}
                      type="text"
                      name="email"
                      id="login-email"
                      setFieldValue={props.handleChange}
                    />
                  </div>
                )}
                <Checkbox onChange={checkboxHandler}>
                  {t("text.userLogin.agree")}{" "}
                  <Link
                    className="link-primary font-bd"
                    to={userRoutesMap.END_USER_AGREEMENT.path}
                  >
                    {t("text.userLogin.endUser")}
                  </Link>{" "}
                  {t("text.userLogin.and")}{" "}
                  <Link
                    to={userRoutesMap.PRIVACY_POLICY.path}
                    className="link-primary font-bd"
                  >
                    {t("text.userLogin.privacyPolicy")}
                  </Link>
                </Checkbox>
                <RippleEffect>
                  {agree ? (
                    <CommonButton
                      // onClick={() => setStep(2)}
                      loading={loading}
                      htmltype="button"
                      type="submit"
                      variant="primary"
                      extraClassName="w-100 authPage_left_signUp"
                    >
                      {t("text.userLogin.next")}
                    </CommonButton>
                  ) : (
                    <CommonButton
                      // onClick={() => setStep(2)}
                      disabled
                      htmltype="button"
                      type="submit"
                      variant="primary"
                      extraClassName="w-100 authPage_left_signUp"
                    >
                      {t("text.userLogin.next")}
                    </CommonButton>
                  )}
                </RippleEffect>
              </div>
              <p className="authPage_left_footer pb-3 mb-0 text-center">
                {t("text.userLogin.haventAccount")}{" "}
                <Link
                  to={userRoutesMap.SIGNUP.path}
                  className="link-primary font-bd"
                >
                  {t("text.userLogin.signUp")}
                </Link>
              </p>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
}

export default LoginForm;

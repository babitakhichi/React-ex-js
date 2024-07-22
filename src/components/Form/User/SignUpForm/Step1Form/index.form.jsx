import { Form, Formik } from "formik";
import React, { useState } from "react";
// import ReactFlagsSelect from "react-flags-select";
import { Link } from "react-router-dom";
import { phoneNumberField } from "../../../../../utils";

import {
  Input as TextInput,
  Checkbox,
  CommonButton,
  RippleEffect,
  AntSelect,
  ImageElement,
  Popovers,
} from "../../../../index";
import { Emailvalidation, Phonevalidation } from "./validation";

function Step1Form({
  loading,
  onSubmit,
  // selected,
  setSelected,
  // counrtyName,
  // setCountryName,
  t,
  userRoutesMap,
  setEmail,
  countryList,
  // email,
  loginPhone,
  emailLogin,
  phoneLogin,
  formRef,
  backupData,
}) {
  const initialValues = {
    email: backupData?.email || "",
    phoneNumber: backupData?.phone_number || "",
    country_code: backupData?.country_code || "",
    // country: backupData?.country || "",
    country_id: backupData?.country_id || undefined,
    referral_code: backupData?.referral_code || "",
  };
  const [agree, setAgree] = useState(false);

  const checkboxHandler = () => {
    setAgree(!agree);
  };

  function handleKey(e) {
    phoneNumberField(e);
  }

  return (
    <Formik
      initialValues={{ ...initialValues }}
      validationSchema={loginPhone ? Phonevalidation() : Emailvalidation()}
      onSubmit={onSubmit}
      innerRef={formRef}
      validate={(e) => {
        if (e?.country_id) {
          setSelected(e.country_id);
        }
        if (e.email.match(/[a-zA-Z]/g)) {
          setEmail(true);
        } else {
          setEmail(false);
        }
      }}
      enableReinitialize
    >
      {(props) => {
        return (
          <Form className="w-100 h-100">
            <div className="d-flex h-100 flex-column justify-content-between w-100">
              <div className="d-flex flex-column authPage_left_field">
                <div className="authPage_left_head text-center">
                  <h1 className="font-blk text-center mb-0">
                    {t("text.userSignUp.signUpFree")}
                  </h1>
                  <p className="subhead">
                    {t("text.userSignUp.signUpdescription")}
                  </p>
                </div>
                <div className="form-group">
                  <label className="form-label">
                    {t("text.userSignUp.selectCountry")}
                  </label>
                  <AntSelect
                    size="medium"
                    id="status"
                    name="country_id"
                    disabled={false}
                    variant="standard"
                    placeholder="Search countries"
                    // defaultValue={values?.country_id}
                    showSearch
                    optionFilterProp="children"
                    filterOption={(input, option) => {
                      return (
                        option?.key
                          ?.toLowerCase()
                          .indexOf(input?.toLowerCase()) >= 0 ||
                        option?.title
                          .toLowerCase()
                          .indexOf(input?.toLowerCase()) >= 0
                      );
                    }}
                  >
                    {countryList?.length > 0 &&
                      countryList?.map((item, index) => {
                        return (
                          <option
                            value={item?.id}
                            title={item?.name}
                            key={index}
                            id={item?.id}
                          >
                            {item?.svg_text ? (
                              <div
                                className="flagIcon"
                                dangerouslySetInnerHTML={{
                                  __html: item?.svg_text?.replace(
                                    /^\/|\/$/g,
                                    ""
                                  ),
                                }}
                              />
                            ) : (
                              <ImageElement
                                className="flagIcon"
                                source="flag-default.svg"
                              />
                            )}

                            {item?.name}
                          </option>
                        );
                      })}
                  </AntSelect>

                  {/* <ReactFlagsSelect
                    name="country"
                    selected={values?.country}
                    onSelect={(code) => {
                      props.setFieldValue("country", code);
                      setSelected(code);
                      setTimeout(() => {
                        document
                          .getElementById(
                            loginPhone ? "phoneNumber" : "login-email"
                          )
                          ?.focus();
                      }, 100);
                    }}
                    selectButtonClassName="form-control"
                    // disabled={email}
                    showSecondarySelectedLabel
                    searchPlaceholder="Search countries"
                    searchable
                    // countries={["US", "GB", "FR", "DE", "IT", "NG"]}
                    // customLabels={{
                    //   US: { primary: "+1" },
                    //   GB: { primary: "+44" },
                    //   FR: {},
                    // }}
                  /> */}
                  {/* {props?.touched?.country_id && props?.errors?.country_id ? (
                    <div className="ant-form-item-explain-error">
                      {props?.errors?.country_id}
                    </div>
                  ) : null} */}
                </div>
                {loginPhone ? (
                  <div className="form-group">
                    <div className="d-flex justify-content-between align-items-center">
                      <label className="form-label">
                        {t("text.userSignUp.numberLabelSignUp")}
                      </label>
                      <Link
                        className="link-primary f-14 font-sb"
                        to="#"
                        onClick={() => {
                          emailLogin();
                          props.setFieldValue("country_code", "");
                          props.setFieldValue("phoneNumber", "");
                          props.setFieldTouched("phoneNumber", false);
                          props.setFieldTouched("country_code", false);
                          setTimeout(() => {
                            document.getElementById("login-email")?.focus();
                          }, 100);
                        }}
                      >
                        {t("text.userLogin.useEmail")}
                      </Link>
                    </div>
                    <div className="numberCode d-flex">
                      {/* <TextInput
                        id="country_code"
                        className="form-control"
                        name="country_code"
                        disabled
                        type="text"
                        variant="standard"
                        placeholder="Select"
                        setFieldValue={props.handleChange}
                      /> */}
                      {/* <ReactFlagsSelect
                        selected={selected}
                        onSelect={(code) => setSelected(code)}
                        selectButtonClassName="form-control"
                        // disabled={email}
                        placeholder="Select"
                        name="country_code"
                        searchPlaceholder="Search countries code"
                        searchable
                        onSelectChange={props.handleChange}
                        className="countryCodeSelect me-2"
                        countries={countryList?.counrty}
                        customLabels={countryList?.label}
                      /> */}
                      <AntSelect
                        size="medium"
                        id="status"
                        extraClassName="form-control"
                        name="country_code"
                        disabled={false}
                        variant="standard"
                        placeholder="Select"
                        setFieldValue={props?.handleChange}
                        showSearch
                        focusNext
                        focusId="phoneNumber"
                        // arrayOfData={countryList}
                        // value={values.country_code}
                        // onSelect={(e) => onSelectCountry(props.setFieldValue, e)}
                        // loading={countryLoader}
                      >
                        {countryList?.length > 0 &&
                          countryList?.map((item, key) => {
                            return (
                              <option key={key} value={`+${item?.phone_code}`}>
                                {`+${item?.phone_code}`}
                              </option>
                            );
                          })}
                      </AntSelect>
                      <TextInput
                        name="phoneNumber"
                        id="phoneNumber"
                        className="form-control"
                        placeholder={t("text.userLogin.numberPlaceholder")}
                        onKeyPress={(e) => handleKey(e)}
                        // type="number"
                        min="0"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        type="text"
                        setFieldValue={props?.handleChange}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="form-group">
                    <div className="d-flex justify-content-between align-items-center">
                      <label className="form-label">
                        {t("text.userSignUp.emailLabelSignUp")}
                      </label>
                      <Link
                        className="link-primary f-14 font-sb"
                        to="#"
                        onClick={() => {
                          phoneLogin();
                          props.setFieldValue("email", "");
                          props.setFieldTouched("email", false);
                        }}
                      >
                        {t("text.userLogin.useNumber")}
                      </Link>
                    </div>
                    <TextInput
                      className="form-control"
                      placeholder={t("text.userSignUp.emailPlaceholderSignUp")}
                      type="text"
                      name="email"
                      id="login-email"
                      setFieldValue={props?.handleChange}
                    />
                  </div>
                )}
                <div className="form-group">
                  <div className="d-flex align-items-center">
                    <label className="form-label">Referral Code</label>
                    <Popovers
                      placement="right"
                      overlayClassName="renewalInfo"
                      content={
                        <>
                          <h5>Referral Code Info</h5>
                          <p>{t("text.userSignUp.earnReward")}</p>
                        </>
                      }
                    >
                      <em className="icon-info paymentBox_infoIcon me-auto ms-2 mb-2" />
                    </Popovers>
                  </div>
                  <TextInput
                    className="form-control"
                    placeholder="Please enter referal code"
                    type="text"
                    name="referral_code"
                    setFieldValue={props?.handleChange}
                  />
                </div>
                <Checkbox name="agree" id="agree" onChange={checkboxHandler}>
                  {t("text.userLogin.agree")}{" "}
                  <Link
                    className="link-primary font-bd"
                    to={userRoutesMap.END_USER_AGREEMENT.path}
                  >
                    {t("text.userLogin.endUser")}
                  </Link>{" "}
                  {t("text.userLogin.and")}{" "}
                  <Link
                    className="link-primary font-bd"
                    to={userRoutesMap.PRIVACY_POLICY.path}
                  >
                    {t("text.userLogin.privacyPolicy")}
                  </Link>
                </Checkbox>
                <RippleEffect>
                  <CommonButton
                    // onClick={() => setStep(2)}
                    disabled={!agree || loading}
                    // loading={loading}
                    htmltype="button"
                    type="submit"
                    variant="primary"
                    extraClassName="w-100 authPage_left_signUp"
                  >
                    {t("text.userLogin.next")}
                  </CommonButton>
                </RippleEffect>
              </div>
              <p className="authPage_left_footer pb-3 mb-0 text-center">
                {t("text.userSignUp.haveAccount")}{" "}
                <Link
                  to={userRoutesMap.LOGIN.path}
                  className="link-primary font-bd"
                >
                  {t("text.adminLogin.submit")}
                </Link>
              </p>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
}

export default React.memo(Step1Form);

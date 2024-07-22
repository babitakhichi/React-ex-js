import { Form, Formik } from "formik";
import React, { useState } from "react";

import { useSelector } from "react-redux";
import { dateFormateWithSlash } from "../../../../../helpers";
import { selectSignupData } from "../../../../../redux/AuthSlice/index.slice";
import {
  dateValidationForDOB,
  // disabledFutureDate,
  phoneNumberField,
} from "../../../../../utils";

import {
  Input as TextInput,
  CommonButton,
  RippleEffect,
  DatePicker,
  AntSelect,
} from "../../../../index";
import validation from "./validation";

function Step3Form({ loading, onSubmit, t, countryList }) {
  let userData = useSelector(selectSignupData);
  const [emailData, setEmailData] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const initialValues = {
    type: "signup",
    first_name: "",
    last_name: "",
    company_name: "",
    dob: "",
    email: userData?.email || "",
    country_code:
      `${userData?.country_code}` && userData?.country_code !== null
        ? `${userData?.country_code}`
        : undefined,
    phone_number: userData?.phone_number || "",
  };
  function handleKey(e) {
    phoneNumberField(e);
  }

  const disabledDobDate = (current) => {
    return current && current.valueOf() > dateValidationForDOB(365);
  };

  return (
    <Formik
      initialValues={{ ...initialValues }}
      validationSchema={validation(emailData, phoneNumber)}
      onSubmit={onSubmit}
      enableReinitialize
      validate={(e) => {
        if (e.email) {
          setEmailData(e.email);
          setPhoneNumber(e);
        }
      }}
    >
      {(props) => {
        const { values } = props;
        return (
          <Form className="w-100 h-100">
            <div className="d-flex flex-column authPage_left_field">
              <div className="authPage_left_head text-center">
                <h1 className="font-blk text-center mb-0">
                  {t("text.userSignUp.there")}
                </h1>
              </div>
              <div className="form-group">
                <label className="form-label">
                  {t("text.userProfile.firstName")}{" "}
                </label>
                <div className="form-control-wrap">
                  <TextInput
                    className="form-control"
                    type="text"
                    name="first_name"
                    setFieldValue={props.handleChange}
                    icon={
                      <div className="form-icon form-icon-left icon-gradiant">
                        <em className="icon-user" />
                      </div>
                    }
                    placeholder={t("text.userProfile.enterFirstName")}
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">
                  {t("text.userProfile.lastName")}
                </label>
                <div className="form-control-wrap">
                  <TextInput
                    className="form-control"
                    type="text"
                    name="last_name"
                    setFieldValue={props.handleChange}
                    icon={
                      <div className="form-icon form-icon-left icon-gradiant">
                        <em className="icon-user" />
                      </div>
                    }
                    placeholder={t("text.userProfile.enterLastName")}
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">
                  {t("text.userProfile.companyName")}
                </label>
                <div className="form-control-wrap">
                  <TextInput
                    className="form-control"
                    type="text"
                    name="company_name"
                    setFieldValue={props.handleChange}
                    icon={
                      <div className="form-icon form-icon-left icon-gradiant">
                        <em className="icon-company" />
                      </div>
                    }
                    placeholder={t("text.userProfile.companyPlaceholder")}
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">
                  {t("text.userProfile.dob")}
                </label>
                <div className="form-control-wrap">
                  <DatePicker
                    getPopupContainer={(trigger) => trigger.parentElement}
                    className="form-control"
                    placeholder="DD-MM-YY"
                    requiredDateTimeFormat={dateFormateWithSlash}
                    validation
                    name="dob"
                    allowClear={false}
                    suffixIcon={
                      <div className="form-icon form-icon-left icon-gradiant">
                        <em className="icon-calendar" />
                      </div>
                    }
                    disabledDate={disabledDobDate}
                    defaultPickerValue={dateValidationForDOB(365)}
                  />
                  {/* <TextInput className="form-control"
                                      type="text"
                                      icon={<div className="form-icon form-icon-left"><em className="icon-calendar"/></div>}
                                      placeholder="DD-MM-YY"/>     */}
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">
                  {" "}
                  {t("text.userProfile.emailprofileLabel")}
                </label>
                <div className="form-control-wrap">
                  <TextInput
                    className="form-control"
                    type="text"
                    name="email"
                    disabled={!!userData?.email}
                    setFieldValue={props.handleChange}
                    icon={
                      <div className="form-icon form-icon-left icon-gradiant">
                        <em className="icon-email" />
                      </div>
                    }
                    placeholder="johndoe@123gmail.com "
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">
                  {" "}
                  {t("text.userProfile.phoneLabel")}
                </label>
                <div className="form-control-wrap numberCode d-flex">
                  <AntSelect
                    size="medium"
                    id="status"
                    extraClassName="form-control"
                    name="country_code"
                    disabled={userData?.email == null || ""}
                    variant="standard"
                    placeholder="Select"
                    setFieldValue={props.handleChange}
                    showSearch
                    value={
                      userData?.country_code
                        ? `${userData?.country_code}`
                        : values.country_code
                    }
                    focusNext
                    focusId="phone_number"

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
                    {userData && (
                      <option
                        key={userData}
                        value={`${userData?.country_code}`}
                      >
                        {`${userData?.country_code}`}
                      </option>
                    )}
                  </AntSelect>
                  <TextInput
                    className="form-control"
                    placeholder={t("text.userProfile.phonePlaceholder")}
                    onKeyPress={(e) => handleKey(e)}
                    min="0"
                    inputmode="numeric"
                    pattern="[0-9]*"
                    type="text"
                    setFieldValue={props.handleChange}
                    name="phone_number"
                    id="phone_number"
                    disabled={!!userData?.phone_number}
                  />
                </div>
              </div>
              <RippleEffect>
                <CommonButton
                  // onClick={() => signUpSuccess()}
                  loading={loading}
                  htmltype="button"
                  type="submit"
                  variant="primary"
                  extraClassName="w-100 authPage_left_signUp"
                >
                  {t("text.userProfile.finish")}
                </CommonButton>
              </RippleEffect>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
}

export default Step3Form;

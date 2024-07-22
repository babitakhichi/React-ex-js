import { Form, Formik } from "formik";
import React, { useState } from "react";
import { Link } from "react-router-dom";

import { t } from "i18next";
import { CommonButton, ImageElement, RippleEffect } from "../../../UiElement";

import validation from "./validation";
import { Password as TextPassword, Input as TextInput } from "../../../index";
import userRoutesMap from "../../../../routeControl/userRoutes";
// import userRoutesMap from "../../../../routeControl/userRoutes";

function PasswordProtectedForm({ onSubmit, loading }) {
  const [showPassword, setShowPassword] = useState(false);
  const initialValues = {
    password: "",
    email: "",
  };

  return (
    <Formik
      initialValues={{ ...initialValues }}
      validationSchema={validation()}
      onSubmit={onSubmit}
    >
      {(props) => {
        return (
          <section className="meetingPage d-flex justify-content-center align-items-center flex-column">
            <div className="meetingPage_logo">
              <ImageElement
                className="img-fluid"
                source="logo-dark.svg"
                alt="login-right"
              />
            </div>
            <Form className="meetingPage_form">
              <h1 className="font-eb">
                {" "}
                {t("text.userPasswordProtected.title")}{" "}
              </h1>
              <div className="d-flex flex-column">
                <div className="form-group">
                  <div className="form-label-group">
                    <label className="form-label" htmlFor="email">
                      {t("text.adminLogin.email")}
                    </label>
                  </div>
                  <div className="form-control-wrap">
                    <TextInput
                      id="email"
                      className="form-control form-control-lg"
                      name="email"
                      disabled={false}
                      variant="standard"
                      type="email"
                      placeholder={t("text.adminLogin.emailPlaceholder")}
                      icon=""
                      setFieldValue={props.handleChange}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <div className="form-label-group">
                    <label className="form-label" htmlFor="password">
                      {t("text.adminLogin.password")}
                    </label>
                  </div>
                  {/* <div className="form-control-wrap"> */}
                  <TextPassword
                    className="form-control form-control-lg"
                    name="password"
                    placeholder={t(
                      "text.userPasswordProtected.meetingPlaceholder"
                    )}
                    setFieldValue={props.handleChange}
                    type={showPassword ? "text" : "password"}
                    toggleIcon={
                      <Link
                        to="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setShowPassword(!showPassword);
                        }}
                        className="form-icon lg form-icon-right passcode-switch"
                        data-target="password"
                      >
                        <em
                          className={`passcode-icon icon-show icon ni ni-eye${
                            showPassword ? "" : "-off"
                          } `}
                        />
                      </Link>
                    }
                    icon=""
                  />
                  {/* </div> */}
                </div>
                <p className="meetingPage_footer mb-0 font-rg">
                  {t("text.userPasswordProtected.agree")}{" "}
                  {/* <Link
                    className="link-primary font-bd text-decoration-underline"
                    to={userRoutesMap.END_USER_AGREEMENT.path}
                  >
                    {t("text.userLogin.endUser")}
                  </Link>{" "}
                  {t("text.userLogin.and")}{" "}
                  <Link
                    to={userRoutesMap.PRIVACY_POLICY.path}
                    className="link-primary font-bd text-decoration-underline"
                  >
                    {t("text.userLogin.privacyPolicy")}
                  </Link> */}
                  <Link
                    to={userRoutesMap.END_USER_AGREEMENT.path}
                    className="link-primary font-bd text-decoration-underline"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    to={userRoutesMap.PRIVACY_POLICY.path}
                    className="link-primary font-bd text-decoration-underline"
                  >
                    Privacy Statement.
                  </Link>
                </p>
                <RippleEffect>
                  <CommonButton
                    htmltype="button"
                    type="submit"
                    variant="primary"
                    loading={loading}
                    extraClassName="w-100 authPage_left_signUp"
                  >
                    {t("text.userPasswordProtected.join")}
                  </CommonButton>
                </RippleEffect>
              </div>
            </Form>
          </section>
        );
      }}
    </Formik>
  );
}
export default React.memo(PasswordProtectedForm);
